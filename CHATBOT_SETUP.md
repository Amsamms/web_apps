# Web Apps Portfolio - Ministral AI Chatbot Setup

This project includes an AI-powered chatbot assistant that can answer questions about all the web applications in the portfolio using the ultra-low-cost Ministral 3B API.

## Chatbot Features

- **Complete App Knowledge**: The chatbot has access to the full HTML content of all apps, including private/hidden ones
- **Ultra Low Cost**: Uses Ministral 3B API at only $0.04 per million tokens (10x cheaper than GPT-4)
- **Automatic Fallback**: If API fails, automatically falls back to intelligent local processing
- **Mobile Friendly**: Responsive design that works on all devices

## Setup Instructions

### 1. Get Ministral API Key
1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Create an account and get your API key
3. The API is extremely affordable - sending the full HTML content (~2,000 tokens) costs less than $0.0001 per conversation

### 2. Configure the Chatbot
1. Open `index.html`
2. Find this line (around line 747):
   ```javascript
   this.apiKey = 'YOUR_MISTRAL_API_KEY_HERE';
   ```
3. Replace `'YOUR_MISTRAL_API_KEY_HERE'` with your actual API key

### 3. Test the Setup
1. Open the website
2. Click the chatbot toggle button (bottom right)
3. Ask a question like "What games are available?" or "Tell me about the data analysis tools"

## Cost Analysis

- **Ministral 3B**: $0.04 per million tokens
- **Full HTML content**: ~2,000 tokens per conversation
- **Cost per conversation**: ~$0.00008 (less than 1 cent per 100 conversations!)
- **Comparison**: 10x cheaper than Gemini Flash, 25x cheaper than GPT-4o

## How It Works

1. **Stateless Design**: Each message is processed independently with fresh HTML context
2. **Context Injection**: The chatbot sends the complete HTML content of the page as context with each user query
3. **Smart Parsing**: Ministral 3B processes the full app catalog to provide accurate, relevant answers
4. **Real-time Data**: Always has access to the latest app information since it reads the live HTML
5. **Fallback System**: If API fails, automatically switches to local rule-based processing

## Features Supported

- Find apps by category (games, tools, data analysis, etc.)
- Get detailed descriptions of specific apps
- Learn how to unlock private apps
- Get recommendations based on user needs
- Mobile-responsive chat interface

## Security Notes

- API key is stored client-side (for demo purposes)
- For production, consider implementing server-side API calls
- The chatbot only has access to publicly available website content
