from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class UserDetails(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    requirement: Optional[str] = None

# Check if user exists by email (gets most recent entry)
@app.get("/api/check-user/{email}")
async def check_user(email: str):
    try:
        result = supabase.table('users').select('*').eq('email', email).order('created_at', desc=True).limit(1).execute()
        
        if result.data and len(result.data) > 0:
            return {"exists": True, "user": result.data[0]}
        else:
            return {"exists": False}
            
    except Exception as e:
        print(f"❌ Error checking user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Save new user (first time registration)
@app.post("/api/save-user")
async def save_user(user: UserDetails):
    try:
        # Check if email already exists
        existing = supabase.table('users').select('email').eq('email', user.email).execute()
        
        if existing.data and len(existing.data) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert new user
        result = supabase.table('users').insert({
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'company': user.company,
            'requirement': user.requirement,
            'created_at': 'now()'
        }).execute()
        
        print(f"✅ User saved: {user.name}")
        
        return {"status": "success", "message": "User details saved", "data": result.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error saving user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Add new requirement (creates new row with all user details)
@app.post("/api/add-user-requirement")
async def add_user_requirement(user: UserDetails):
    try:
        # Insert NEW row with all user details + new requirement
        result = supabase.table('users').insert({
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'company': user.company,
            'requirement': user.requirement,
            'created_at': 'now()'
        }).execute()
        
        print(f"✅ New requirement saved for: {user.name} - {user.requirement}")
        
        return {
            "status": "success",
            "message": "Requirement saved successfully",
            "data": result.data[0]
        }
        
    except Exception as e:
        print(f"❌ Error saving requirement: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get all requirements for a user
@app.get("/api/user-requirements/{email}")
async def get_user_requirements(email: str):
    try:
        result = supabase.table('users').select('*').eq('email', email).order('created_at', desc=True).execute()
        
        return {
            "status": "success",
            "count": len(result.data),
            "requirements": result.data
        }
        
    except Exception as e:
        print(f"❌ Error fetching requirements: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    query: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        query = request.query
        print(f"📥 Received query: {query}")
        
        emb_response = openai_client.embeddings.create(
            input=query,
            model="text-embedding-ada-002"
        )
        query_vector = emb_response.data[0].embedding
        
        result = supabase.rpc('match_documents', {
            'query_embedding': query_vector,
            'match_threshold': 0.7,
            'match_count': 3
        }).execute()
        
        matches = result.data if result.data else []
        
        if matches and len(matches) > 0 and matches[0]['similarity'] > 0.75:
            print(f"✅ Found relevant chunks, similarity: {matches[0]['similarity']:.2f}")
            
            context = "\n\n".join([m['content'] for m in matches])
            
            completion = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful company assistant. Answer questions based on the provided context. Be concise and friendly. Keep responses under 200 words."
                    },
                    {
                        "role": "user",
                        "content": f"Context:\n{context}\n\nQuestion: {query}"
                    }
                ],
                max_tokens=200
            )
            
            return {
                "answer": completion.choices[0].message.content,
                "source": "document",
                "confidence": matches[0]['similarity']
            }
        
        else:
            print("⚠️ Using AI fallback")
            
            fallback = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful and friendly AI assistant. Answer questions naturally and conversationally. Keep responses under 200 words."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                max_tokens=200
            )
            
            return {
                "answer": fallback.choices[0].message.content,
                "source": "ai_fallback"
            }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "Chatbot API is running! 🚀"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
