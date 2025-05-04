import openai 
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

file_id = "file-VoWAGjFfjnojdjQ1ngEjJN"

response = openai.fine_tuning.jobs.create(
    training_file=file_id,
    model="gpt-3.5-turbo-0125",  
    suffix="rise-v1"
)

print(" Training started!")
print(" Job ID:", response.id)

