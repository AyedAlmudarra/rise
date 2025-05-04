import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

job_id = "ftjob-nMQRY0gas42E3yHGwaXumsXk"

response = openai.fine_tuning.jobs.retrieve(job_id)
print(f" Status: {response.status}")
print(f" Model: {response.fine_tuned_model}")
