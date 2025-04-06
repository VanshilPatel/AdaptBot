from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import bigquery
import google.generativeai as genai
import os
import re

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





GOOGLE_API_KEY=""
GEMINI_MODEL = genai.GenerativeModel("gemini-1.5-flash-001")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize BigQuery client once with credentials
credentials_path = "./key.json"
bq_client = bigquery.Client.from_service_account_json(credentials_path)

# Project details
PROJECT_ID = ""
BQ_DATASET = ""
BQ_TABLE = ""
BQ_TABLE_LOCATION=""
BQ_DATASET_LOCATION = ""



# Function to get table schema dynamically
def get_table_schema(BQ_DATASET, BQ_TABLE):
    table_ref = f"{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}"
    table = bq_client.get_table(table_ref)
    schema_info = {field.name: field.field_type for field in table.schema}
    return schema_info


# Function to fetch unique values for a column (LIMIT to 50 for efficiency)
def get_unique_values(column):
    query = f"SELECT DISTINCT {column} FROM `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}` LIMIT 50"
    query_job = bq_client.query(query)
    return [row[column] for row in query_job if row[column] is not None]


# Fetch schema dynamically
table_schema = get_table_schema(BQ_DATASET, BQ_TABLE)
table_schema_location = get_table_schema(BQ_DATASET_LOCATION, BQ_TABLE_LOCATION)

# Fetch unique values for key columns
unique_values = {}
for column in ["specialisation_name", "consultingHospitals_location", "gender", "qualifications_degree"]:
    unique_values[column] = get_unique_values(column)

# Function to generate SQL query using Gemini
def generate_sql_query(user_query: str) -> str:
    schema_str = "\n".join([f"- {col} ({dtype})" for col, dtype in table_schema.items()])
    schema_str_loc = "\n".join([f"- {col} ({dtype})" for col, dtype in table_schema_location.items()])
    print("schema -> ", schema_str_loc)
    print("schema --> ", schema_str)
    
    # Unique values structured properly
    unique_values_sections = "\n".join(
        [f"{col} -> Unique values: {', '.join(map(str, unique_values[col]))}" for col in unique_values]
    )


    prompt = f"""
    Convert this question into a correct BigQuery SQL query:
    '{user_query}'

    The table `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}` has these columns:
    {schema_str} and the table `{PROJECT_ID}.{BQ_DATASET_LOCATION}.{BQ_TABLE_LOCATION}` has these columns:
    {schema_str_loc}

    Unique Column Values For Table `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}`:
    {unique_values_sections}

    The query must be **valid BigQuery SQL** and should always use **SELECT**.

    Rules:
    0. If the user is asking for location-related information (e.g., nearest hospital), then just give one isLocation flag as response it's value should be true, otherwise go for this table: `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}`
    1. Use only the provided column names.
    2. The table is in BigQuery, so use Google SQL syntax.
    3. If filtering by text, use `LIKE '%value%'` for partial matches.
    4. If sorting is needed, default to `ORDER BY workExperianceStart DESC`.
    5. Always return a valid SQL query, do not include markdown formatting.
    6. If given a query like "I am having a headache, which doctor should I consult?" then the query should return the doctor name and specialization.
       You should search the specialization from the unique specialization names provided above, not match directly with "headache."

    Respond with only the SQL query, nothing else.
    """

    response = GEMINI_MODEL.generate_content(prompt)
    print("respopnse -> ", response)
    sql_query = response.text.strip()

    # 🔥 Remove incorrect triple backticks (` ```sql ... ``` `)
    sql_query = re.sub(r"^```(sql)?|```$", "", sql_query).strip()
    print("Query -> ", sql_query)

    return sql_query


# Function to convert table result to natural language
def tabular_to_natural(result_rows) -> str:
    prompt = f"Convert this table data into a human-readable response: {result_rows}"
    response = GEMINI_MODEL.generate_content(prompt)
    return response.text.strip()

class QueryRequest(BaseModel):
    user_query: str

@app.post("/query")
def query_bigquery(request: QueryRequest):
    user_query = request.user_query
    sql_query = generate_sql_query(user_query)

    try:
        query_job = bq_client.query(sql_query)
        results = [dict(row) for row in query_job]
        response_text = tabular_to_natural(results)
        return {"sql_query": sql_query, "response": response_text}
    except Exception as e:
        return {"error": str(e)}