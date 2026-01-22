import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the process_message function from main.py
try:
    from main import process_message
except ImportError:
    print("❌ Could not import 'main.py'. Make sure you are running this script from the 'whatsapp-backend' directory.")
    sys.exit(1)

def main():
    print("🤖 WhatsApp Backend Tester")
    print("==========================")
    print("This script tests the logic (Vector Search + GPT) without using the WhatsApp API.")
    print("Type 'exit' or 'quit' to stop.\n")

    # Check for API keys
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  Warning: OPENAI_API_KEY not found in .env")
    if not os.getenv("SUPABASE_URL"):
        print("⚠️  Warning: SUPABASE_URL not found in .env")

    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye! 👋")
                break
            
            if not user_input:
                continue
                
            print("Thinking... 🤔")
            
            # Call the backend logic directly
            # Passing a fixed dummy ID for CLI testing
            response = process_message(user_input, "cli_tester_004")
            
            print(f"Bot: {response}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye! 👋")
            break
        except Exception as e:
            print(f"❌ Error: {e}\n")

if __name__ == "__main__":
    main()
