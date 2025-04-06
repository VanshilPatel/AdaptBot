import pandas as pd
from datetime import datetime

# Read CSV file
df = pd.read_csv('docter_details_updated.csv')

# Convert workExperienceStart (Unix timestamp) to datetime
df['workExperienceStart_date'] = pd.to_datetime(df['workExperienceStart'], unit='s', errors='coerce')

# Calculate years from current year
current_year = datetime.now().year
df['years_of_experience'] = current_year - df['workExperienceStart_date'].dt.year

# Save updated DataFrame to a new CSV file
df.to_csv('docter_details_updated_with_experience.csv', index=False)

print("CSV file saved as 'docter_details_updated_with_experience.csv'")
