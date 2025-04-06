from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.cloud import storage, aiplatform_v1
import fitz
import os
import psycopg2
import google.generativeai as genai
from psycopg2 import pool
import numpy as np
import vertexai
from vertexai.language_models import TextGenerationModel, TextEmbeddingModel
import logging
from contextlib import contextmanager
from dotenv import load_dotenv
const GEMINI_API_KEY = import.meta.sampleenv.GEMINI_API_KEY

# Load environment variables
load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(os.path.dirname(__file__), "key.json")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = ""
LOCATION = ""
BUCKET_NAME = ""
DB_CONFIG = {
    "dbname": "",
    "user": "",
    "password": "",
    "host": "",
    "port": "",
}

# Initialize Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)
# GEMINI_MODEL = genai.GenerativeModel("gemini-1.5-flash")

# Create a connection pool
try:
    connection_pool = psycopg2.pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
        **DB_CONFIG
    )
    logger.info("Database connection pool created successfully")
except Exception as e:
    logger.error(f"Error creating connection pool: {e}")
    raise

@contextmanager
def get_db_connection():
    """Context manager for database connections from the pool."""
    conn = None
    try:
        conn = connection_pool.getconn()
        yield conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise
    finally:
        if conn:
            connection_pool.putconn(conn)

def get_embedding(text):
    """Generates text embeddings using Vertex AI."""
    try:
        model = TextEmbeddingModel.from_pretrained("text-embedding-005")
        embeddings = model.get_embeddings([text])
        if embeddings and len(embeddings) > 0:
            return embeddings[0].values
        return None
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        return None

def read_pdf_from_gcs(bucket_name, blob_name):
    """Reads a PDF file from Google Cloud Storage and extracts text."""
    try:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        with blob.open("rb") as pdf_file:
            doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
            return "\n".join([page.get_text() for page in doc])
    except Exception as e:
        logger.error(f"Error reading PDF from GCS: {e}")
        return None

def store_embedding(filename, content):
    """Stores document embeddings in PostgreSQL."""
    try:
        embedding = get_embedding(content)
        if embedding is None:
            logger.error("Failed to generate embedding")
            return False

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO document_embeddings (filename, embedding, chunk) 
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) 
                    DO UPDATE SET embedding = EXCLUDED.embedding, chunk = EXCLUDED.chunk
                    """, 
                    (filename, np.array(embedding).tolist(), content)
                )
                conn.commit()
                logger.info(f"Embeddings stored for: {filename}")
                return True
    except Exception as e:
        logger.error(f"Error storing embeddings: {e}")
        return False


def retrieve_relevant_document(query):
    """Finds the most relevant document based on embeddings."""
    try:
        query_embedding = get_embedding(query)
        if query_embedding is None:
            logger.error("Failed to generate query embedding")
            return None, None

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT filename, chunk
                    FROM document_embeddings
                    ORDER BY embedding <-> %s::vector
                    LIMIT 1
                    """,
                    (np.array(query_embedding).tolist(),)
                )
                result = cursor.fetchone()
                return result if result else (None, None)
    except Exception as e:
        logger.error(f"Error retrieving document: {e}")
        return None, None


def generate_response(query):
    """Uses Gemini to generate a response based on the retrieved document."""
    filename, content = retrieve_relevant_document(query)
    if not content:
        return "No relevant document found."

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Using the following document, answer the query: {query}\n\nDocument:\n{content}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return "Error generating response."

# FastAPI setup
app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/chat/")
def chat(request: QueryRequest):
    """Handles chat queries and returns AI-generated responses."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    response = generate_response(request.query)
    return {"response": response}

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup connection pool on shutdown."""
    if connection_pool:
        connection_pool.closeall()
        logger.info("Database connection pool closed")

# Initialize by reading and storing PDF
@app.on_event("startup")
async def startup_event():
    """Initialize the application by reading and storing PDF."""
    pdf_text = read_pdf_from_gcs(BUCKET_NAME, "hospital_details/appolo_about.pdf")
    if pdf_text:
        success = store_embedding("appolo_about.pdf", pdf_text)
        if success:
            logger.info("PDF text successfully stored in embeddings.")
        else:
            logger.error("Failed to store PDF embeddings.")
    else:
        logger.error("Failed to read PDF from GCS.")