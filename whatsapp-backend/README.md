# WhatsApp Chatbot Backend

This is a FastAPI-based backend for a WhatsApp chatbot that uses OpenAI's GPT-5-nano and Supabase Vector Search to answer user queries based on company documents.

## 🚀 Prerequisites

- Python 3.8+
- A [Supabase](https://supabase.com/) project (with vector store setup)
- An [OpenAI](https://platform.openai.com/) API Key
- A [Meta for Developers](https://developers.facebook.com/) account
- [ngrok](https://ngrok.com/) (for local testing)

## 🛠️ Installation & Setup

1.  **Navigate to the directory**:
    ```bash
    cd whatsapp-backend
    ```

2.  **Create a virtual environment** (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Configuration**:
    Open `.env` file and ensure the following variables are set:
    ```env
    # Supabase & OpenAI (Same as chatbot-backend)
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key
    OPENAI_API_KEY=your_openai_key

    # WhatsApp Configuration (See Meta Setup below)
    WHATSAPP_TOKEN=your_meta_access_token
    WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
    VERIFY_TOKEN=my_secret_verify_token
    ```

## 📱 Meta (WhatsApp) API Setup Guide

Follow these steps to configure your WhatsApp Business API:

### 1. Create a Meta App
1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Click **My Apps** -> **Create App**.
3.  Select **Other** -> **Next**.
4.  Select **Business** -> **Next**.
5.  Enter an App Name (e.g., "Shivohini Chatbot") and create the app.

### 2. Add WhatsApp Product
1.  On the App Dashboard, scroll down to find **WhatsApp** and click **Set up**.
2.  Select your Meta Business Account (or create one).
3.  You will be redirected to the **Getting Started** page.

### 3. Get Credentials
On the **WhatsApp > API Setup** page:
1.  **Temporary Access Token**: Copy this string. It expires in 24 hours.
    - *Paste this into `WHATSAPP_TOKEN` in your `.env` file.*
2.  **Phone Number ID**: Copy this number (e.g., `1059...`).
    - *Paste this into `WHATSAPP_PHONE_NUMBER_ID` in your `.env` file.*

### 4. Configure Webhook
1.  **Start your local server**:
    ```bash
    uvicorn main:app --reload --port 8001
    ```
2.  **Expose your server** using ngrok (in a new terminal):
    ```bash
    ngrok http 8001
    ```
    *Copy the HTTPS URL (e.g., `https://random-id.ngrok-free.app`).*

3.  **Set up Webhook in Meta**:
    - Go to **WhatsApp > Configuration** in the Meta sidebar.
    - Find the **Webhook** section and click **Edit**.
    - **Callback URL**: Paste your ngrok URL + `/webhook` (e.g., `https://random-id.ngrok-free.app/webhook`).
    - **Verify Token**: Enter the string you chose for `VERIFY_TOKEN` in your `.env` (e.g., `my_secret_verify_token`).
    - Click **Verify and Save**.

4.  **Subscribe to Fields**:
    - Under Webhook fields, click **Manage**.
    - Find `messages` and click **Subscribe**.

## 🏃‍♂️ Running the Chatbot

1.  Ensure your server is running (`uvicorn main:app --reload --port 8001`).
2.  Ensure ngrok is running and the URL matches your Meta Webhook config.
3.  Send a message to the **Test Number** provided in the Meta "API Setup" page.
    - *Note: You must add your own phone number as a recipient in the "To" field on the API Setup page to test with the trial number.*

## 📂 Project Structure

- `main.py`: The FastAPI application handling webhooks and logic.
- `requirements.txt`: Python dependencies.
- `.env`: API keys and configuration.

## ⚠️ Important Notes

- **Token Expiry**: The temporary token from Meta expires in 24 hours. For production, you need to set up a System User and generate a permanent token.
- **Supabase**: This backend uses the same `documents` table and `match_documents` function as the original backend. Ensure your PDF data is already uploaded using the tools in `chatbot-backend`.
