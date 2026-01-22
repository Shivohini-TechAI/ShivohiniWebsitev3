import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
API_VERSION = "v17.0"

if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
    print("Error: Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID in .env file.")
    exit(1)

def send_test_message(recipient_phone_number):
    """
    Sends a test 'Hey' message to the specified phone number.
    """
    url = f"https://graph.facebook.com/{API_VERSION}/{PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "to": recipient_phone_number,
        "type": "text",
        "text": {"body": "Hey! This is a test message from your Python script. 🚀"}
    }
    
    try:
        print(f"Sending message to {recipient_phone_number}...")
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            print("✅ Message sent successfully!")
            print("Response:", json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Failed to send message. Status Code: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    # REPLACE THIS WITH YOUR PHONE NUMBER (including country code, e.g., 919876543210)
    # NOTE: If your app is in 'Development' mode, you can only send messages to verified test numbers.
    RECIPIENT_PHONE_NUMBER = "919876543210" # <--- CHANGE THIS NUMBER
    
    print("--- WhatsApp Test Message Sender ---")
    user_input = input(f"Enter recipient phone number (default: {RECIPIENT_PHONE_NUMBER}): ").strip()
    
    if user_input:
        RECIPIENT_PHONE_NUMBER = user_input
        
    send_test_message(RECIPIENT_PHONE_NUMBER)
