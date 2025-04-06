import os
import logging
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema.runnable import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
const CHATBOT_BASE_URL= import.meta.sampleenv.CHATBOT_BASE_URL
# Set up FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set Google API Key
os.environ["GOOGLE_API_KEY"] = " "

# Initialize the Gemini LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-002")

# Define structured query prompt (Doctor details, appointments, schedules)
structured_template = PromptTemplate(
    input_variables=["query"],
    template="You are a hospital scheduling assistant. Answer based on structured data:\n\n{query}"
)

# Define unstructured query prompt (Hospital information, services, policies)
unstructured_template = PromptTemplate(
    input_variables=["query"],
    template="You are a hospital information assistant. Answer based on unstructured hospital details:\n\n{query}"
)

# Use RunnableSequence instead of LLMChain
structured_chain = structured_template | llm | RunnableLambda(lambda x: x["text"])
unstructured_chain = unstructured_template | llm | RunnableLambda(lambda x: x["text"])

# Query model
class QueryRequest(BaseModel):
    query: str
def is_greeting(query):
    greeting_keywords = [ "hello", "hey", "good morning", "good evening", "good afternoon"]
    return any(keyword in query.lower() for keyword in greeting_keywords)

# Function to determine if a query is related to structured data (doctors, schedules)
def is_structured_query(query):
    structured_keywords = [
        "doctor", "availability", "schedule", "appointment", "specialty", "consultation", "consult", "headache", "fever", "cough", "pain", "rash", "infection", 
        "dizziness", "vomiting", "nausea", "fatigue", "cold", "flu", 
        "stomach ache", "diarrhea", "chest pain", "sore throat", "earache",
        "timing", "fees", "cost", "charges", "opening hours", "working hours", 
        "contact", "phone number", "email", "location", "address", 
        "treatment", "procedures", "services offered", "surgeon", "physician", 
        "emergency contact", "departments", "nurse", "patient admission", "hairfall","specialisation","specialization", "speciality", "Dr.", "experience",
        "near", "nearby", "location", "address", "distance",
    "closest", "nearest", "area", "where", "place","list","out","visit","listout","blood","sugar","diabetes", "knee", "pain", "brain"
    ]
    return any(keyword in query.lower() for keyword in structured_keywords)

# Function to determine if a query is related to unstructured data
def is_unstructured_query(query):
    unstructured_keywords = [
        "about", "hospital details", "services", "history", "facilities", "policies", 
        "mission", "vision", "values", "infrastructure", "accreditation", 
        "awards", "recognition", "founder", "established", "background", 
        "medical ethics", "rules", "guidelines", "insurance", "payment options",
        "bed capacity", "research", "training", "education", "CSR activities", 
        "medical camps", "awareness programs", "partnerships", "affiliations"
    ]
    return any(keyword in query.lower() for keyword in unstructured_keywords)

# Function to call the structured data FastAPI endpoint
def fetch_structured_data(query):
    try:
        response = requests.post(`${CHATBOT_BASE_URL}/query`, json={"query": query})
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching structured data: {e}")
        return "Error retrieving structured data."

# Function to call the unstructured data FastAPI endpoint
def fetch_unstructured_data(query):
    try:
        response = requests.post(`${CHATBOT_BASE_URL}/chat/`, json={"query": query})
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching unstructured data: {e}")
        return "Error retrieving unstructured data."

# Query router
def route_query(query):
    if is_greeting(query):
        return "Hello! How can I assist you today?"  # More human-like response
    elif is_structured_query(query):
        return fetch_structured_data(query)
    elif is_unstructured_query(query):
        return fetch_unstructured_data(query)
    else:
        return "I'm sorry, I can only assist with hospital FAQs and doctor appointments."

# FastAPI endpoint
@app.post("/query")
def handle_query(request: QueryRequest):
    response = route_query(request.query)
    return {"response": response}

# Example query (For CLI use)
if __name__ == "__main__":
    user_query = input("Ask a question: ")
    response = route_query(user_query)
    print("\nResponse:", response)


