# PayPal AI PayRequest - AI-Powered Payment Request Platform

## Project Overview
PayPal AI PayRequest is an intelligent payment request platform that combines OpenAI's natural language processing with PayPal's payment infrastructure. Simply describe what you need to get paid for in plain English, and our AI automatically extracts all the necessary details to create a professional PayPal payment request.

## Key Features
- 🤖 **Natural Language Processing**: Describe your payment request in plain English, AI handles the rest
- 💳 **Full PayPal Integration**: Uses PayPal's sandbox environment for secure payment processing
- ✏️ **AI-Powered Data Extraction**: Automatically extracts recipient email, amount, currency, due dates, and more
- 📊 **Dashboard Tracking**: Keep track of all your payment requests in one place
- 🧾 **Itemized Breakdowns**: AI can generate itemized invoice breakdowns from your description

## Tech Stack
- **Streamlit**: Beautiful, responsive web interface
- **OpenAI GPT-3.5-turbo**: Natural language processing to extract payment details
- **PayPal REST SDK**: Integration with PayPal's payment platform
- **Python**: Backend processing

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Get API Keys
1. **PayPal Developer Account**: Create one at [developer.paypal.com](https://developer.paypal.com)
   - Create a sandbox application
   - Copy your Client ID and Client Secret
2. **OpenAI API Key**: Get one from [platform.openai.com](https://platform.openai.com)

### 3. Run the App
```bash
streamlit run app.py
```

### 4. Configure the App
- Open your browser to `http://localhost:8501`
- Enter your API keys in the sidebar
- Start creating AI-powered payment requests!

## How It Works
1. **Describe Your Request**: Type in what you need to get paid for, e.g., "Send $750 to sarah@example.com for graphic design services, due in 30 days"
2. **AI Analysis**: Our AI extracts all the key details from your description
3. **Review & Edit**: You can review and edit any details before creating the payment
4. **Create Payment**: The app generates a PayPal payment link that you can send to your recipient
5. **Track**: All your payment requests are stored in the dashboard for easy tracking

## Hackathon Requirements Met
- ✅ **Meaningful PayPal Integration**: Uses PayPal's REST SDK to create real payment requests in sandbox mode
- ✅ **Meaningful AI Integration**: Uses OpenAI to process natural language and extract structured payment data
- ✅ **Working Prototype**: Fully functional app that can be run locally
- ✅ **Proper Documentation**: Clear setup and usage instructions

## Future Enhancements
- Add PayPal Invoicing API for proper invoice generation
- Add payment reminders via email
- Add analytics and reporting features
- Support for multi-currency payments
- AI-powered fraud detection