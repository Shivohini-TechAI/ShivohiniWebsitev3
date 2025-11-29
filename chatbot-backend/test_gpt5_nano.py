from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Test query
response = client.chat.completions.create(
    model="gpt-5-nano",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What services do you offer?"}
    ]
)

print("✅ GPT-5 nano response:")
print(response.choices[0].message.content)
print(f"\n💰 Tokens used: {response.usage.total_tokens}")
print(f"💵 Cost: ₹{response.usage.total_tokens * 0.0000058:.4f}")
