import os
import logging
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client, Client
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# ==========================================
# 1. Configuration & Environment Variables
# ==========================================
load_dotenv()

# Logger Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# AI Configuration
MODEL_NAME = "gpt-4o" 
EMBEDDING_MODEL = "text-embedding-ada-002"

# API Keys & Credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

# Validate critical environment variables
if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY]):
    logger.warning("Missing one or more environment variables. Application may not function correctly.")


# ==========================================
# 2. Client Initialization
# ==========================================
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize clients: {e}")
    pass


# ==========================================
# 3. FastAPI Application Setup
# ==========================================
app = FastAPI(
    title="Web Chat Backend",
    description="Backend service for Web Chatbot using Supabase Vector Search and OpenAI",
    version="1.0.0"
)
print("✅ Web Chat App initialized!")


# CORS is handled by the main app when mounted, but keeping this for standalone testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 4. Data Models
# ==========================================
class UserDetails(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    requirement: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    phone: Optional[str] = None

# ==========================================
# 5. Helper Functions
# ==========================================
def get_embedding(text: str) -> List[float]:
    """
    Generate embedding for the given text using OpenAI.
    """
    try:
        response = openai_client.embeddings.create(
            input=text,
            model=EMBEDDING_MODEL
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise

def search_documents(query_vector: List[float], match_threshold: float = 0.5, match_count: int = 5) -> List[Dict[str, Any]]:
    """
    Search Supabase for relevant documents using vector similarity.
    """
    try:
        result = supabase.rpc('match_documents', {
            'query_embedding': query_vector,
            'match_threshold': match_threshold,
            'match_count': match_count
        }).execute()
        return result.data if result.data else []
    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        return []

def generate_ai_response(query: str, context: str = "") -> str:
    """
    Generate a response using OpenAI Chat Completion.
    """
    try:
        if context:
            system_prompt = (
                "You are a helpful and knowledgeable assistant. "
                "Use the provided context to answer the user's question. "
                "If the answer is found in the context, prioritize that information. "
                "If the context is relevant but doesn't fully answer the question, or if the answer is not in the context at all, "
                "use your general knowledge to provide a complete and helpful answer. "
                "Do not mention that you are using general knowledge or that the context was insufficient."
            )
            user_content = f"Context:\n{context}\n\nQuestion: {query}"
        else:
            system_prompt = "You are a helpful and friendly AI assistant. Answer questions naturally and conversationally."
            user_content = query

        completion = openai_client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        return "I apologize, but I'm having trouble processing your request right now."

def send_interest_notification_email(user_details: Dict[str, Any]):
    """
    Send an email notification to the admin about a user interested in services.
    """
    if not all([SMTP_USER, SMTP_PASSWORD, ADMIN_EMAIL]):
        logger.warning("Email credentials not set. Skipping email notification.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"New Service Interest: {user_details.get('name', 'Unknown')}"

        body = (
            f"User expressed interest in services.\n\n"
            f"Name: {user_details.get('name', 'N/A')}\n"
            f"Phone: {user_details.get('phone', 'N/A')}\n"
            f"Email: {user_details.get('email', 'N/A')}\n"
            f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USER, ADMIN_EMAIL, text)
        server.quit()
        logger.info(f"📧 Sent interest notification email for {user_details.get('phone')}")
    except Exception as e:
        logger.error(f"❌ Failed to send email: {e}")

def check_contact_intent(query: str) -> Optional[str]:
    """
    Check if the user is asking for contact information.
    """
    keywords = ["contact", "phone", "email", "reach", "number", "address", "call"]
    query_lower = query.lower()
    if any(keyword in query_lower for keyword in keywords):
        return (
            "Here is the contact information for Dr. Gunjan Bhatia:\n"
            "📞 Phone: +917688929473\n"
            "📧 Email: bhatiagunjan27@gmail.com"
        )
    return None

def check_service_interest(query: str) -> bool:
    """
    Check if the user is expressing interest in services.
    """
    keywords = ["service", "price", "cost", "package", "hire", "appointment", "book", "consultation", "session"]
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in keywords)

# ==========================================
# 6. API Routes
# ==========================================
@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "Web Chat Backend is running! 🚀"}

@app.post("/api/save-user")
async def save_user(user: UserDetails):
    """
    Save user details to Supabase.
    """
    try:
        # Check if user exists
        existing_user = supabase.table("users").select("*").eq("phone", user.phone).execute()
        
        user_data = {
            "phone": user.phone,
            "name": user.name,
            "email": user.email,
            "company": user.company,
            "requirement": user.requirement
        }
        
        if existing_user.data:
            supabase.table("users").update(user_data).eq("phone", user.phone).execute()
        else:
            supabase.table("users").insert(user_data).execute()
            
        return {"status": "success", "message": "User details saved"}
    except Exception as e:
        logger.error(f"Error saving user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Handle chat messages.
    """
    try:
        query = request.message
        phone = request.phone
        
        # Check for Contact Info Intent
        contact_info = check_contact_intent(query)
        if contact_info:
            return {"response": contact_info}

        # Check for Service Interest
        if check_service_interest(query):
            # Update User Record
            if phone:
                try:
                    # Try to update service interest if columns exist
                    supabase.table("users").update({
                        "interested_in_services": True,
                        "service_interest_date": datetime.now().isoformat()
                    }).eq("phone", phone).execute()
                    
                    # Fetch user details for email
                    user_res = supabase.table("users").select("*").eq("phone", phone).execute()
                    if user_res.data:
                        send_interest_notification_email(user_res.data[0])
                except Exception as e:
                    logger.warning(f"Could not update service interest (columns might be missing): {e}")
                    # Fallback: still try to send email if we can fetch user
                    try:
                        user_res = supabase.table("users").select("*").eq("phone", phone).execute()
                        if user_res.data:
                            send_interest_notification_email(user_res.data[0])
                    except:
                        pass

            return {
                "response": (
                    "I noticed you are interested in our services. That's great! 🎉\n\n"
                    "Here is the contact information for Dr. Gunjan Bhatia to take this forward:\n"
                    "📞 Phone: +917688929473\n"
                    "📧 Email: bhatiagunjan27@gmail.com\n\n"
                    "We have also noted your interest and will get back to you shortly."
                )
            }

        # RAG / AI Processing
        query_vector = get_embedding(query)
        matches = search_documents(query_vector)
        
        if matches and matches[0]['similarity'] > 0.50:
            context = "\n\n".join([m['content'] for m in matches])
            response = generate_ai_response(query, context)
        else:
            response = generate_ai_response(query)
            
        return {"response": response}

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
