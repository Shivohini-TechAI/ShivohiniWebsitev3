import os
import logging
import smtplib
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import requests
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from supabase import create_client, Client

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

# WhatsApp Configuration
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
WHATSAPP_API_URL = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"

# Admin Access Configuration
# Supports comma-separated list of phone numbers for admin commands like !todaysupdate
admin_phones_str = os.getenv("ADMIN_PHONE_NUMBER", "")
ADMIN_PHONE_NUMBERS = [p.strip() for p in admin_phones_str.split(",") if p.strip()]

# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

# Validation
if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY, WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN]):
    logger.warning("Missing one or more critical environment variables.")


# ==========================================
# 2. Client Initialization
# ==========================================
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize clients: {e}")
    raise


# ==========================================
# 3. Database Layer (Supabase)
# ==========================================
def get_or_create_user(phone_number: str) -> Dict[str, Any]:
    """
    Fetch user from Supabase or create a new one if not exists.
    """
    try:
        response = supabase.table("whatsapp_users").select("*").eq("phone", phone_number).execute()
        if response.data:
            return response.data[0]
        
        new_user = {
            "phone": phone_number,
            "onboarding_step": "start",
            "name": None,
            "email": None,
            "contact_number": None,
            "company_name": None
        }
        try:
            supabase.table("whatsapp_users").insert(new_user).execute()
            return new_user
        except Exception as insert_error:
            logger.error(f"Failed to insert user: {insert_error}")
            return {"phone": phone_number, "onboarding_step": "complete"}

    except Exception as e:
        logger.error(f"Error in get_or_create_user: {e}")
        return {"phone": phone_number, "onboarding_step": "complete"}

def update_user_profile(phone_number: str, updates: Dict[str, Any]):
    """
    Update user profile in Supabase.
    """
    try:
        supabase.table("whatsapp_users").update(updates).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")

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

def get_daily_stats() -> str:
    """
    Calculate and format daily statistics (UTC based).
    """
    try:
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        
        # New Users
        new_users_response = supabase.table("whatsapp_users") \
            .select("*", count="exact") \
            .gte("created_at", today_start) \
            .execute()
        new_users_count = new_users_response.count if new_users_response.count is not None else len(new_users_response.data)

        # Interested Leads
        interested_response = supabase.table("whatsapp_users") \
            .select("name, phone, email, contact_number, company_name") \
            .eq("interested_in_services", True) \
            .gte("service_interest_date", today_start) \
            .execute()
        interested_users = interested_response.data

        report_lines = [
            "📊 *Daily Update Report* 📊",
            f"📅 Date: {datetime.now().strftime('%Y-%m-%d')}",
            "",
            f"👤 *New Users Today:* {new_users_count}",
            "",
            f"⭐ *Interested Leads ({len(interested_users)}):*"
        ]

        if interested_users:
            for i, user in enumerate(interested_users, 1):
                name = user.get('name', 'Unknown')
                phone = user.get('phone', 'Unknown')
                contact_number = user.get('contact_number', '-')
                company = user.get('company_name', '-')
                email = user.get('email', '-')
                
                # Format request details if available
                request_data = user.get('service_request_data', {})
                details = ""
                if request_data:
                    details = f"\n   - Agenda: {request_data.get('agenda', 'N/A')}\n   - Type: {request_data.get('meeting_type', 'N/A')}\n   - Date/Time: {request_data.get('date', 'N/A')} {request_data.get('time', 'N/A')}"
                
                report_lines.append(f"{i}. {name} | {company} | {phone}{details}")
        else:
            report_lines.append("No new leads today.")

        return "\n".join(report_lines)

    except Exception as e:
        logger.error(f"❌ Error generating daily stats: {e}")
        return f"❌ Error generating report: {str(e)}"


# ==========================================
# 4. AI Layer (OpenAI)
# ==========================================
def get_embedding(text: str) -> List[float]:
    """
    Generate embedding for the given text using OpenAI.
    """
    try:
        response = openai_client.embeddings.create(input=text, model=EMBEDDING_MODEL)
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise

def generate_ai_response(query: str, context: str = "") -> str:
    """
    Generate a response using OpenAI Chat Completion.
    """
    try:
        if context:
            system_prompt = (
                "You are a helpful, knowledgeable, and professional assistant for Shivohini Tech AI LLP, an IT company. "
                "Use the provided context to answer the user's question. "
                "Strictly prioritize the information found in the context. "
                "Maintain a professional and inviting tone suitable for a tech company.\n\n"
                "IMPORTANT FORMATTING INSTRUCTIONS:\n"
                "- format your response to be highly readable on WhatsApp.\n"
                "- Use *bold* for headings and key terms.\n"
                "- Use bullet points (•) for lists.\n"
                "- Keep paragraphs short (maximum 2-3 sentences).\n"
                "- Use emojis sparingly to make the text inviting."
            )
            user_content = f"Context:\n{context}\n\nQuestion: {query}"
        else:
            system_prompt = (
                "You are a helpful and professional assistant for Shivohini Tech AI LLP, an IT company. "
                "Your role is to assist with:\n"
                "- 🏗️ **Industrial Plant Engineering**\n"
                "- 💻 **Custom Software Solutions**\n"
                "- 🎨 **Surface Engineering Services**\n"
                "- 🤖 **AI & Automation**\n\n"
                "Do NOT offer to help with unrelated topics like student grades, hotel occupancy, or restaurants. "
                "If the user greets you or asks what you can do, strictly respond with the services listed above. "
                "Answer questions naturally and conversationally. "
                "Use WhatsApp formatting (*bold*, lists) to make your answer easy to read."
            )
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


# ==========================================
# 5. Business Logic & Helpers
# ==========================================
def check_contact_intent(query: str) -> Optional[str]:
    """Check if the user is asking for contact information."""
    keywords = ["contact", "phone", "email", "reach", "number", "address", "call"]
    if any(k in query.lower() for k in keywords):
        return (
            "Here is the contact information for our representative, Dr. Gunjan Bhatia:\n"
            "📞 Phone: +917688929473\n"
            "📧 Email: bhatiagunjan27@gmail.com"
        )
    return None

def check_service_interest(query: str) -> bool:
    """Check if the user is expressing interest in services."""
    # Keywords including common typos
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

def send_interest_notification_email(user_details: Dict[str, Any]):
    """Send an email notification to the admin about a user interested in services."""
    if not all([SMTP_USER, SMTP_PASSWORD, ADMIN_EMAIL]):
        logger.warning("Email credentials not set. Skipping notification.")
        return

    try:
        req_data = user_details.get('service_request_data', {})
        
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"New Service Request: {user_details.get('name', 'Unknown')}"

        body = (
            f"User Confirmed Interest in Services.\n\n"
            f"👤 USER DETAILS:\n"
            f"Name: {user_details.get('name', 'N/A')}\n"
            f"Phone (WhatsApp): {user_details.get('phone', 'N/A')}\n"
            f"Contact Number: {user_details.get('contact_number', 'N/A')}\n"
            f"Email: {user_details.get('email', 'N/A')}\n"
            f"Company: {user_details.get('company_name', 'N/A')}\n\n"
            f"📅 MEETING DETAILS:\n"
            f"Agenda: {req_data.get('agenda', 'N/A')}\n"
            f"Type: {req_data.get('meeting_type', 'N/A')}\n"
            f"Preferred Date: {req_data.get('date', 'N/A')}\n"
            f"Preferred Time: {req_data.get('time', 'N/A')}\n\n"
            f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, ADMIN_EMAIL, msg.as_string())
        server.quit()
        logger.info(f"📧 Sent interest notification email for {user_details.get('phone')}")
    except Exception as e:
        logger.error(f"❌ Failed to send email: {e}")

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

# ==========================================
# 6. Core Application Logic
# ==========================================
def send_whatsapp_message(recipient_id: str, text: str):
    """Send a text message back to the user via WhatsApp API."""
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": recipient_id,
        "type": "text",
        "text": {"body": text}
    }
    
    try:
        response = requests.post(WHATSAPP_API_URL, headers=headers, json=data)
        response.raise_for_status()
        logger.info(f"📤 Sent message to {recipient_id}")
    except Exception as e:
        logger.error(f"❌ Error sending message: {e}")
        if 'response' in locals():
            logger.error(f"Response: {response.text}")

def process_message(query: str, sender_id: str) -> List[str]:
    """
    Orchestrate message processing: Admin Commands -> Onboarding -> Service Flow -> RAG Chat.
    """
    try:
        # 1. Admin Commands
        if query.strip().lower() == "!todaysupdate":
            if ADMIN_PHONE_NUMBERS and sender_id not in ADMIN_PHONE_NUMBERS:
                logger.warning(f"Unauthorized command attempt from {sender_id}")
                pass 
            else:
                logger.info(f"📊 Generating daily report for admin {sender_id}")
                return [get_daily_stats()]

        # 2. Onboarding Flow
        user = get_or_create_user(sender_id)
        
        # Check if Onboarding is Active
        onboarding_step = user.get("onboarding_step", "complete")
        if onboarding_step != "complete":
             if onboarding_step == "start":
                update_user_profile(sender_id, {"onboarding_step": "awaiting_name"})
                return [(
                    "Hello! 👋\n"
                    "This is an AI assistant for Shivohini Tech AI LLP.\n"
                    "To get started, may I please have your full name?"
                )]
            
             elif onboarding_step == "awaiting_name":
                name = query.strip()
                update_user_profile(sender_id, {"name": name, "onboarding_step": "awaiting_email"})
                return [f"Thanks, {name}! Could you please share your email address?"]

             elif onboarding_step == "awaiting_email":
                email = query.strip()
                update_user_profile(sender_id, {"email": email, "onboarding_step": "awaiting_contact_number"})
                return ["Got it! What is the best phone number to contact you on? (If different from this WhatsApp number, otherwise just type 'same')"]

             elif onboarding_step == "awaiting_contact_number":
                contact_number = query.strip()
                if contact_number.lower() == "same":
                    contact_number = sender_id
                update_user_profile(sender_id, {"contact_number": contact_number, "onboarding_step": "awaiting_company_name"})
                return ["Great. Lastly, what is the name of your company?"]

             elif onboarding_step == "awaiting_company_name":
                company_name = query.strip()
                update_user_profile(sender_id, {"company_name": company_name, "onboarding_step": "complete"})
                return [(
                    "Thank you! Your details have been saved.\n"
                    "You can now ask me anything about our services. How can I help you today?"
                )]

        # 3. Service Interest Flow (Overrides Standard Chat if Active)
        service_step = user.get("service_flow_step")
        if service_step:
            flow_responses = handle_service_flow(user, query, sender_id)
            if flow_responses:
                return flow_responses
            # If empty, user didn't follow the flow (e.g. asked a new question).
            # Fall through to standard chat.

        # 4. Standard Chat Flow
        
        # Check for Contact Intent
        contact_info = check_contact_intent(query)
        if contact_info:
            return [contact_info]

        # Check for Strong Service Interest Trigger FIRST
        # If the user says "I am interested", we don't need to RAG/AI answer that.
        # We should just jump straight to the meeting logic.
        is_interested = check_service_interest(query)
        logger.info(f"🔍 Service Interest Detected: {is_interested} (Query: '{query}')")
        
        if is_interested:
            # Check if it's a "Strong Intent" (clean interest statement) vs "Informational Interest"
            strong_intent_phrases = ["i want", "i need", "i am interested", "im interested", "i'm interested", "we need", "we want", "looking for"]
            is_strong_intent = any(phrase in query.lower() for phrase in strong_intent_phrases)
            
            # Start the service flow
            update_user_profile(sender_id, {"service_flow_step": "confirm_interest"})
            
            if is_strong_intent and len(query.split()) < 15:
                # Short, direct interest statement -> Jump straight to prompt
                return ["That's great to hear! 🎉\n\nWould you like to schedule a meeting or be contacted to discuss this further?"]
            
            # If it's a longer query (e.g., "I am interested in your AI services, how much do they cost?"),
            # we should Answer First, then Upsell.
            
        # RAG / AI Generating (Only if not purely strong intent or if we need to answer a question)
        query_vector = get_embedding(query)
        matches = search_documents(query_vector)
        
        if matches and matches[0]['similarity'] > 0.35:
            logger.info(f"✅ Found relevant chunks (Similarity: {matches[0]['similarity']:.2f})")
            context = "\n\n".join([m['content'] for m in matches])
            ai_response = generate_ai_response(query, context)
        else:
            logger.info("⚠️ Using AI fallback")
            ai_response = generate_ai_response(query)

        # If we already detected interest but decided to answer the question first
        if is_interested:
            combined_response = f"{ai_response}\n\nWould you like to schedule a meeting or be contacted to discuss this further?"
            return [combined_response]
        
        return [ai_response]

    except Exception as e:
        logger.error(f"❌ Error in process_message: {e}")
        return ["Sorry, I encountered an error while processing your request."]


# ==========================================
# 7. FastAPI Routes
# ==========================================
app = FastAPI(
    title="WhatsApp Chatbot Backend",
    description="Backend service for WhatsApp chatbot using Supabase Vector Search and OpenAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "WhatsApp Chatbot Backend is running! 🚀"}

@app.get("/webhook")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode and token:
        if mode == "subscribe" and token == VERIFY_TOKEN:
            return int(challenge)
        raise HTTPException(status_code=403, detail="Verification failed")
    return {"status": "Webhook endpoint"}

@app.post("/webhook")
async def webhook_handler(request: Request):
    try:
        body = await request.json()
        if body.get("object") == "whatsapp_business_account":
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        for message in value["messages"]:
                            if message["type"] == "text":
                                sender_id = message["from"]
                                body_text = message["text"]["body"]
                                logger.info(f"📩 Message from {sender_id}: {body_text}")
                                
                                responses = process_message(body_text, sender_id)
                                for text in responses:
                                    send_whatsapp_message(sender_id, text)
        return {"status": "processed"}
    except Exception as e:
        logger.error(f"❌ Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
