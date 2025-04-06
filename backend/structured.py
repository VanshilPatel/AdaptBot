from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import bigquery
import google.generativeai as genai
import os
import re
const GEMINI_API_KEY = import.meta.sampleenv.GEMINI_API_KEY
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Configuration

GEMINI_MODEL = genai.GenerativeModel("gemini-1.5-flash-001")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize BigQuery client
credentials_path = "./key.json"
bq_client = bigquery.Client.from_service_account_json(credentials_path)
PROJECT_ID = ""
BQ_DATASET = ""
BQ_TABLE = ""
BQ_TABLE_LOCATION=""
BQ_DATASET_LOCATION = ""


DOCTOR_CONFIG = {
    "dataset": "company_dataset",
    "table": "docter_details"
}
LOCATION_CONFIG = {
    "dataset": "my_new_dataset",
    "table": "table_places"  # Update with your actual location table name
}

# Keywords that trigger location-based queries
LOCATION_KEYWORDS = [
    "near", "nearby", "location", "address", "distance",
    "closest", "nearest", "area", "where", "place"
]

def get_table_schema(dataset: str, table: str):
    table_ref = f"{PROJECT_ID}.{dataset}.{table}"
    table = bq_client.get_table(table_ref)
    schema_info = {field.name: field.field_type for field in table.schema}
    return schema_info

def get_unique_values(column: str, dataset: str, table: str):
    query = f"SELECT DISTINCT {column} FROM `{PROJECT_ID}.{dataset}.{table}` LIMIT 50"
    query_job = bq_client.query(query)
    return [row[column] for row in query_job if row[column] is not None]

def should_query_locations(user_query: str) -> bool:
    return any(keyword in user_query.lower() for keyword in LOCATION_KEYWORDS)

def generate_medical_prompt(schema_str: str, unique_values_sections: str, user_query: str) -> str:
    return f"""
    Convert this question into a correct BigQuery SQL query:
    '{user_query}'

    The table `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}` has these columns:
    {schema_str}


    Unique Column Values For Table `{PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}`:
    {unique_values_sections}

    The query must be **valid BigQuery SQL** and should always use **SELECT**.

    Rules:
    
    1. Use only the provided column names as shown in the schema above.
    2. The table is in BigQuery, so use Google SQL syntax.
    3. If filtering by text, use `LIKE '%value%'` for partial matches.
    4. If sorting is needed, default to `ORDER BY workExperianceStart DESC`.
    5. Always return a valid SQL query, do not include markdown formatting.
    6. If given a query like "I am having a headache, which doctor should I consult?" then the query should return the doctor name and specialization.
       You should search the specialization from the unique specialization names provided above, not match directly with "headache."
    7. Return only top 3 rows with doctor name , specilisation and experience
    Respond with only the SQL query, nothing else.

    """

def generate_location_prompt(schema_str: str, user_query: str) -> str:
    return f"""
    Generate a BigQuery SQL query to find hospital locations based on this query:
    '{user_query}'

    Use this table: `{PROJECT_ID}.{LOCATION_CONFIG['dataset']}.{LOCATION_CONFIG['table']}`
    Schema:
    {schema_str}

    Rules:
    1. Include hospital_name, address, PlaceId and rating if available
    2. Sort by distance or rating if mentioned in query
    3. Include only active/valid locations
    4. Use LIKE for partial text matches
    5. Return only valid SQL, no formatting
    """

def generate_sql_query(user_query: str) -> tuple[str, str]:
    # Determine which table to query
    is_location_query = should_query_locations(user_query)
    isLocation = False
    if is_location_query:
        user_query = user_query + "my latitude and logitudes are like this : 18.5796705 and 73.7381725 show me the 5 nearest hospitals"
        config = LOCATION_CONFIG
        schema = get_table_schema(config['dataset'], config['table'])
        schema_str = "\n".join([f"- {col} ({dtype})" for col, dtype in schema.items()])
        prompt = generate_location_prompt(schema_str, user_query)
        table_type = "location"
        isLocation = True
    else:
        config = DOCTOR_CONFIG
        schema = get_table_schema(config['dataset'], config['table'])
        schema_str = "\n".join([f"- {col} ({dtype})" for col, dtype in schema.items()])
        
        # Get unique values for doctor-specific columns
        unique_values = {}
        for column in ["specialisation_name", "consultingHospitals_location", "gender", "qualifications_degree"]:
            unique_values[column] = get_unique_values(column, config['dataset'], config['table'])
        
        unique_values_sections = "\n".join(
            [f"{col} -> Unique values: {', '.join(map(str, values))}" for col, values in unique_values.items()]
        )
        
        prompt = generate_medical_prompt(schema_str, unique_values_sections, user_query)
        table_type = "doctor"
        

    response = GEMINI_MODEL.generate_content(prompt)
    sql_query = response.text.strip()
    sql_query = re.sub(r"^```(sql)?|```$", "", sql_query).strip()
    
    return sql_query, table_type, isLocation

def tabular_to_natural(result_rows: list, table_type: str) -> str:
    context = "hospital locations" if table_type == "location" else "medical specialists"
    prompt = f"""
    Convert this {context} data into a natural, helpful response:
    {result_rows}

    If no results were found, then respond Like : "I Dont have data Related to the query asked!!".
    """
    response = GEMINI_MODEL.generate_content(prompt)
    return response.text.strip()

class QueryRequest(BaseModel):
    query: str

@app.post("/query")
def query_bigquery(request: QueryRequest):
    try:
        sql_query, table_type, isLocation = generate_sql_query(request.query)
        query_job = bq_client.query(sql_query)
        results = [dict(row) for row in query_job]
        response_text = tabular_to_natural(results, table_type)
        return {
            "sql_query": sql_query,
            "response": response_text,
            "table_type": table_type,
            "isLocation": isLocation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 