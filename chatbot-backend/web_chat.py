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
MODEL_NAME = "gpt-5-nano" 
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
    session_id: Optional[str] = None  # For anonymous users

# In-memory session store for anonymous users (no phone)
# Key: session_id, Value: dict with service_flow_step and service_request_data
session_store: Dict[str, Dict[str, Any]] = {}

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

        # Include service request details if available
        service_data = user_details.get('service_request_data', {})
        
        body = (
            f"User expressed interest in services.\n\n"
            f"Name: {user_details.get('name', 'N/A')}\n"
            f"Phone: {user_details.get('phone', 'N/A')}\n"
            f"Email: {user_details.get('email', 'N/A')}\n"
            f"Company: {user_details.get('company', 'N/A')}\n"
            f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            f"Meeting Details:\n"
            f"Agenda: {service_data.get('agenda', 'N/A')}\n"
            f"Meeting Type: {service_data.get('meeting_type', 'N/A')}\n"
            f"Preferred Date: {service_data.get('date', 'N/A')}\n"
            f"Preferred Time: {service_data.get('time', 'N/A')}"
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

def check_greeting(query: str) -> Optional[str]:
    """
    Check if the user is sending a simple greeting.
    """
    greetings = ["hey", "hello", "hi", "hii", "hiii", "helo", "heyy", "heyyy", "good morning", "good afternoon", "good evening", "greetings"]
    query_lower = query.lower().strip()
    
    # Check if the query is JUST a greeting (short message)
    if query_lower in greetings or any(query_lower.startswith(g + " ") or query_lower.startswith(g + "!") or query_lower.startswith(g + ",") for g in greetings):
        return "Hey there! How can I help you today?"
    return None

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
    """Check if the user is expressing interest in services."""
    keywords = ["hire", "appointment", "book", "consultation", "session", "interested", "intrested", "build", "need", "cost", "price", "package", "demo", "discuss"]
    
    query_lower = query.lower()
    
    # 1. Strong Intent: Override exclusions if user explicitly states desire
    strong_intent_phrases = ["i want", "i need", "i am interested", "im interested", "i'm interested", "we need", "we want", "looking for"]
    if any(phrase in query_lower for phrase in strong_intent_phrases):
        return True

    # 2. Exclude purely informational queries (e.g. "What services...")
    # unless they contain action verbs like "hire" or "book"
    if any(q in query_lower for q in ["what", "how", "can you", "list", "tell me", "show", "do you"]):
        if any(act in query_lower for act in ["hire", "book", "appointment", "schedule"]):
            return True
        return False
        
    # 3. Keyword Match
    return any(k in query_lower for k in keywords)

def get_or_create_user(phone: str) -> Dict[str, Any]:
    """
    Get user from database or create a basic record if not exists.
    """
    try:
        user_res = supabase.table("users").select("*").eq("phone", phone).execute()
        if user_res.data:
            return user_res.data[0]
        else:
            # Create basic user record
            new_user = {
                "phone": phone,
                "service_flow_step": None,
                "service_request_data": {}
            }
            result = supabase.table("users").insert(new_user).execute()
            return result.data[0] if result.data else new_user
    except Exception as e:
        logger.error(f"Error getting/creating user: {e}")
        return {"phone": phone, "service_flow_step": None, "service_request_data": {}}

def update_user_profile(phone: str, updates: Dict[str, Any]):
    """
    Update user profile in database.
    """
    try:
        supabase.table("users").update(updates).eq("phone", phone).execute()
        logger.info(f"Updated user {phone}: {updates}")
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")

def handle_service_flow(user: Dict[str, Any], query: str, sender_id: str) -> List[str]:
    """
    Handle the multi-step flow for scheduling a meeting/service interest.
    """
    step = user.get("service_flow_step")
    data = user.get("service_request_data") or {}

    if step == "confirm_interest":
        # logic: If yes -> proceed. If no -> cancel. If other -> pass through (return empty)
        if any(yes in query.lower() for yes in ["yes", "sure", "ok", "yeah"]):
            update_user_profile(sender_id, {"service_flow_step": "ask_agenda"})
            return ["Great! To help us prepare, could you briefly describe the agenda or purpose of the meeting?"]
        elif any(no in query.lower() for no in ["no", "nope", "cancel", "not now"]):
            update_user_profile(sender_id, {"service_flow_step": None, "service_request_data": {}})
            return ["No problem! Let me know if you change your mind. How else can I help you today?"]
        else:
            # User ignored the question and asked something else
            update_user_profile(sender_id, {"service_flow_step": None})
            return [] # Empty list signal to continue to RAG

    elif step == "ask_agenda":
        data['agenda'] = query.strip()
        update_user_profile(sender_id, {"service_request_data": data, "service_flow_step": "ask_type"})
        return ["Noted. What is your preferred meeting type? (Call / Video / In-person)"]

    elif step == "ask_type":
        data['meeting_type'] = query.strip()
        update_user_profile(sender_id, {"service_request_data": data, "service_flow_step": "ask_date"})
        return ["Got it. What is your approximate preferred date for the meeting?"]

    elif step == "ask_date":
        data['date'] = query.strip()
        update_user_profile(sender_id, {"service_request_data": data, "service_flow_step": "ask_time"})
        return ["Almost done. What is your preferred time or time range?"]

    elif step == "ask_time":
        data['time'] = query.strip()
        
        # Finalize
        updates = {
            "service_request_data": data, 
            "service_flow_step": None,
            "interested_in_services": True,
            "service_interest_date": datetime.now().isoformat()
        }
        update_user_profile(sender_id, updates)
        
        # Send Email now that we have all details
        full_user = get_or_create_user(sender_id) # Refresh data
        send_interest_notification_email(full_user)
        
        return [(
            "Thank you! We have received your request with all the details.\n"
            "Our team will review your agenda and contact you shortly to confirm the meeting.\n\n"
            "Is there anything else I can help you with?"
        )]
    
    return []

def handle_session_service_flow(session_id: str, user: Dict[str, Any], query: str) -> List[str]:
    """
    Handle the multi-step flow for anonymous users (session-based).
    """
    step = user.get("service_flow_step")
    data = user.get("service_request_data") or {}

    if step == "confirm_interest":
        phone_stored = user.get('phone')
        if any(yes in query.lower() for yes in ["yes", "sure", "ok", "yeah"]):
            session_store[session_id] = {"service_flow_step": "ask_agenda", "service_request_data": data, "phone": phone_stored}
            return ["Great! To help us prepare, could you briefly describe the agenda or purpose of the meeting?"]
        elif any(no in query.lower() for no in ["no", "nope", "cancel", "not now"]):
            session_store[session_id] = {"service_flow_step": None, "service_request_data": {}, "phone": phone_stored}
            return ["No problem! Let me know if you change your mind. How else can I help you today?"]
        else:
            session_store[session_id] = {"service_flow_step": None, "service_request_data": {}, "phone": phone_stored}
            return []

    elif step == "ask_agenda":
        data['agenda'] = query.strip()
        phone_stored = user.get('phone')
        session_store[session_id] = {"service_flow_step": "ask_type", "service_request_data": data, "phone": phone_stored}
        return ["Noted. What is your preferred meeting type? (Call / Video / In-person)"]

    elif step == "ask_type":
        data['meeting_type'] = query.strip()
        phone_stored = user.get('phone')
        session_store[session_id] = {"service_flow_step": "ask_date", "service_request_data": data, "phone": phone_stored}
        return ["Got it. What is your approximate preferred date for the meeting?"]

    elif step == "ask_date":
        data['date'] = query.strip()
        phone_stored = user.get('phone')
        session_store[session_id] = {"service_flow_step": "ask_time", "service_request_data": data, "phone": phone_stored}
        return ["Almost done. What is your preferred time or time range?"]

    elif step == "ask_time":
        data['time'] = query.strip()
        session_store[session_id] = {"service_flow_step": None, "service_request_data": data}
        
        # Format the meeting details for storage
        requirement_text = (
            f"Meeting Request:\n"
            f"Agenda: {data.get('agenda', 'N/A')}\n"
            f"Type: {data.get('meeting_type', 'N/A')}\n"
            f"Date: {data.get('date', 'N/A')}\n"
            f"Time: {data.get('time', 'N/A')}\n"
            f"Requested at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )
        
        user_details = None
        saved_to_db = False
        
        try:
            # Get phone from session data
            phone_from_session = user.get('phone')
            
            logger.info(f"📋 Service request completed for session {session_id}: {data}, phone: {phone_from_session}")
            
            if phone_from_session:
                # Try to find user by phone number
                user_result = supabase.table("users").select("*").eq("phone", phone_from_session).order("created_at", desc=True).limit(1).execute()
                
                if user_result.data:
                    user_details = user_result.data[0]
                    
                    # Update their record with the meeting request
                    supabase.table("users").update({
                        "requirement": requirement_text
                    }).eq("id", user_details['id']).execute()
                    
                    saved_to_db = True
                    logger.info(f"✅ Updated user {user_details.get('email')} (phone: {phone_from_session}) with meeting request")
            
            # Fallback: If no phone or user not found, try recent users
            if not saved_to_db:
                from datetime import timedelta
                cutoff_time = (datetime.now() - timedelta(hours=1)).isoformat()
                recent_users = supabase.table("users").select("*").gte("created_at", cutoff_time).order("created_at", desc=True).limit(1).execute()
                
                if recent_users.data:
                    user_details = recent_users.data[0]
                    
                    supabase.table("users").update({
                        "requirement": requirement_text
                    }).eq("id", user_details['id']).execute()
                    
                    saved_to_db = True
                    logger.info(f"✅ Updated recent user {user_details.get('email')} with meeting request (fallback)")
            
            # Send email if we have user details
            if user_details:
                email_data = {
                    'name': user_details.get('name', 'N/A'),
                    'email': user_details.get('email', 'N/A'),
                    'phone': user_details.get('phone', 'N/A'),
                    'company': user_details.get('company', 'N/A'),
                    'service_request_data': data
                }
                send_interest_notification_email(email_data)
                logger.info(f"📧 Sent email notification to admin for {user_details.get('email')}")
            else:
                logger.warning("⚠️ No user found to associate meeting request and send email")
                
        except Exception as e:
            logger.error(f"❌ Error saving meeting request to database: {e}")
            import traceback
            traceback.print_exc()
        
        return [(
            "Thank you! We have received your meeting request with all the details.\n"
            "Our team will review your agenda and contact you shortly to confirm the meeting.\n\n"
            "Is there anything else I can help you with?"
        )]
    
    return []

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
    Handle chat messages with service flow support.
    Uses phone if available, otherwise falls back to session_id for anonymous users.
    """
    logger.info("=" * 50)
    logger.info(f"🌐 WEB CHAT ENDPOINT HIT!")
    logger.info(f"📨 Raw request: message='{request.message}', phone='{request.phone}', session_id='{request.session_id}'")
    logger.info("=" * 50)
    
    try:
        query = request.message
        phone = request.phone
        session_id = request.session_id
        
        # ALWAYS use session_id for service flow tracking (database may not have flow columns)
        # Phone is only used for user lookup, not for flow state
        user_id = session_id if session_id else phone
        
        logger.info(f"Chat request - phone: '{phone}', session_id: '{session_id}', user_id: '{user_id}', query: '{query}'")
        
        # If no identifier at all, can't track service flow
        if not user_id:
            # Check for Greeting
            greeting_response = check_greeting(query)
            if greeting_response:
                return {"response": greeting_response}
            
            # Check for Contact Info Intent
            contact_info = check_contact_intent(query)
            if contact_info:
                return {"response": contact_info}
            
            # RAG / AI Processing
            query_vector = get_embedding(query)
            matches = search_documents(query_vector)
            
            if matches and matches[0]['similarity'] > 0.50:
                context = "\n\n".join([m['content'] for m in matches])
                response = generate_ai_response(query, context)
            else:
                response = generate_ai_response(query)
                
            return {"response": response}
        
        # ALWAYS use session store for service flow tracking
        # Initialize session if not exists
        if user_id not in session_store:
            session_store[user_id] = {"service_flow_step": None, "service_request_data": {}}
        user = session_store[user_id]
        
        logger.info(f"User {user_id} - service_flow_step: {user.get('service_flow_step')}")
        
        # Check if user is in an active service flow
        if user.get("service_flow_step"):
            flow_responses = handle_session_service_flow(user_id, user, query)
            
            if flow_responses:  # If flow handled the message
                return {"response": flow_responses[0]}
            # If flow_responses is empty, user asked something else, continue to normal processing
        
        # Check for Greeting
        greeting_response = check_greeting(query)
        if greeting_response:
            return {"response": greeting_response}
        
        # Check for Contact Info Intent
        contact_info = check_contact_intent(query)
        if contact_info:
            return {"response": contact_info}

        # Check for Service Interest - START THE FLOW
        if check_service_interest(query):
            # Initialize service flow using session store (include phone for later database lookup)
            session_store[user_id] = {
                "service_flow_step": "confirm_interest",
                "service_request_data": {},
                "phone": phone  # Store phone to identify user in database later
            }
            
            logger.info(f"Started service flow for {user_id}")
            
            return {
                "response": (
                    "I noticed you are interested in our services. That's great! 🎉\n\n"
                    "Would you like to schedule a meeting to discuss this further?"
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