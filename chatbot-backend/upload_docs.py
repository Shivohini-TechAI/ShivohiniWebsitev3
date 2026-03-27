from supabase import create_client
from openai import OpenAI
import os
from dotenv import load_dotenv
import PyPDF2

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from PDF file"""
    text = ""
    
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text

def upload_chunk(content: str, chunk_index: int):
    """Convert text to vector and upload to Supabase"""
    print(f"Processing chunk {chunk_index}...")
    
    # Convert text to vector
    response = openai_client.embeddings.create(
        input=content,
        model="text-embedding-ada-002"
    )
    
    embedding = response.data[0].embedding
    
    # Save to Supabase
    result = supabase.table('documents').insert({
        'content': content,
        'metadata': {'chunk_index': chunk_index, 'source': 'company_pdf'},
        'embedding': embedding
    }).execute()
    
    print(f"✅ Uploaded chunk {chunk_index}")

# Read PDF file
pdf_path = 'company_info.pdf'  # Put your PDF filename here
print(f"Reading PDF: {pdf_path}...")

text = extract_text_from_pdf(pdf_path)
print(f"Extracted {len(text)} characters from PDF")

# Split into chunks (every 500 characters)
chunk_size = 500
chunks = []

for i in range(0, len(text), chunk_size):
    chunk = text[i:i + chunk_size].strip()
    if chunk:  # Skip empty chunks
        chunks.append(chunk)

print(f"Split into {len(chunks)} chunks. Uploading...")

# Upload each chunk
for i, chunk in enumerate(chunks):
    upload_chunk(chunk, i)

print(f"\n🎉 All done! Uploaded {len(chunks)} chunks from PDF.")
