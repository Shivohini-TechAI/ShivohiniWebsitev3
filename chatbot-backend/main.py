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

@app.post("/api/save-user")
async def save_user(user: UserDetails):
    try:
        # Save to Supabase (create a 'users' table first)
        result = supabase.table('users').insert({
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'company': user.company,
            'created_at': 'now()'
        }).execute()
        
        print(f"✅ User saved: {user.name}")
        
        return {"status": "success", "message": "User details saved"}
        
    except Exception as e:
        print(f"❌ Error saving user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


class ChatRequest(BaseModel):
    query: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        query = request.query
        print(f"📥 Received query: {query}")
        
        # Generate embedding
        emb_response = openai_client.embeddings.create(
            input=query,
            model="text-embedding-ada-002"
        )
        query_vector = emb_response.data[0].embedding
        
        # Search Supabase
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
                model="gpt-5-nano",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful company assistant. Answer questions based on the provided context. Be concise and friendly."
                    },
                    {
                        "role": "user",
                        "content": f"Context:\n{context}\n\nQuestion: {query}"
                    }
                ]
                # ✅ No temperature parameter - uses default (1)
            )
            
            return {
                "answer": completion.choices[0].message.content,
                "source": "document",
                "confidence": matches[0]['similarity']
            }
        
        else:
            print("⚠️ Using AI fallback")
            
            fallback = openai_client.chat.completions.create(
                model="gpt-5-nano",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful and friendly AI assistant. Answer questions naturally and conversationally."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ]
                # ✅ No temperature parameter - uses default (1)
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
    return {"status": "Chatbot API with GPT-5 nano is running! 🚀"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
