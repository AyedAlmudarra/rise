import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

file_path = "../Data/Rise_Fine_Tuning.jsonl"


response = openai.files.create(
    file=open(file_path, "rb"),
    purpose="fine-tune"
)

print(" File uploaded successfully!")
print(" File ID:", response.id)