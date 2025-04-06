from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from google.cloud import bigquery
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = ''
ALLOWED_EXTENSIONS = {'csv'}
SERVICE_ACCOUNT_FILE = "./key.json"
PROJECT_ID = ""
DATASET_ID = ""

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_dataset_if_not_exists():
    client = bigquery.Client.from_service_account_json(SERVICE_ACCOUNT_FILE)
    dataset_ref = client.dataset(DATASET_ID)
    dataset = bigquery.Dataset(dataset_ref)
    dataset.location = ""
    try:
        client.create_dataset(dataset, exists_ok=True)
        return True
    except Exception as e:
        print(f"Error creating dataset: {e}")
        return False

def upload_to_bigquery(file_path, table_name):
    client = bigquery.Client.from_service_account_json(SERVICE_ACCOUNT_FILE)
    
    # Read CSV file with all columns as strings initially
    df = pd.read_csv(file_path, dtype=str)

    # Infer column types dynamically
    inferred_schema = []
    for column in df.columns:
        sample_value = df[column].dropna().iloc[0] if not df[column].dropna().empty else ""

        # Ensure sample_value is a string before calling replace()
        if isinstance(sample_value, str) and sample_value.replace(".", "", 1).isdigit():
            col_type = "FLOAT" if "." in sample_value else "INTEGER"
            df[column] = pd.to_numeric(df[column], errors="coerce")
        else:
            col_type = "STRING"
            df[column] = df[column].astype(str)
        
        inferred_schema.append(bigquery.SchemaField(column, col_type))
    
    # Define table reference
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.{table_name}"
    
    # Configure job
    job_config = bigquery.LoadJobConfig(
        schema=inferred_schema,
        write_disposition="WRITE_TRUNCATE",
        source_format=bigquery.SourceFormat.CSV,
        allow_quoted_newlines=True,
        allow_jagged_rows=True,
    )
    
    # Upload to BigQuery
    try:
        job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        job.result()
        return True
    except Exception as e:
        print(f"Error uploading to BigQuery: {e}")
        return False


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('file')
    results = []
    
    for file in files:
        if file.filename == '':
            continue
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Save file temporarily
            file.save(file_path)
            
            # Create dataset if doesn't exist
            if not create_dataset_if_not_exists():
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': 'Failed to create or access dataset'
                })
                continue
            
            # Upload to BigQuery
            table_name = f"table_{filename.rsplit('.', 1)[0]}"  # Create table name from filename
            success = upload_to_bigquery(file_path, table_name)
            
            # Remove temporary file
            os.remove(file_path)
            
            results.append({
                'filename': filename,
                'status': 'success' if success else 'error',
                'message': 'File uploaded successfully' if success else 'Failed to upload to BigQuery'
            })
        else:
            results.append({
                'filename': file.filename,
                'status': 'error',
                'message': 'Invalid file type. Only CSV files are allowed.'
            })
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5001)