# Cold Email Agent

An agentic AI app that generates high-converting B2B cold emails using **Google Gemini**, built with **FastAPI** (Python) and **React + Tailwind CSS**.

---

## Prerequisites

Install these before running:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

## Project Structure

```
cold-email-agent/
├── backend/
│   ├── main.py           # FastAPI app with Gemini AI
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    │       ├── EmailForm.jsx
    │       ├── EmailResult.jsx
    │       └── Skeleton.jsx
    ├── package.json
    └── vite.config.js
```

---

## Setup & Run

### 1. Backend

```powershell
cd cold-email-agent\backend

# Copy env file and add your Gemini API key
Copy-Item .env.example .env
notepad .env   # Replace "your_gemini_api_key_here" with your real key

# Create virtual environment and install dependencies
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

---

### 2. Frontend

```powershell
cd cold-email-agent\frontend

npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Features

| Feature | Description |
|---|---|
| **Email Generator** | Fill in 6 fields → get 3 subject lines + email body |
| **Agentic Refinement** | Paste feedback → AI rewrites the email instantly |
| **Word Count Guard** | Live word count (green ≤100, amber if over) |
| **Copy to Clipboard** | One-click copy for each subject line and body |
| **Skeleton Loader** | Shimmer animation while AI generates |
| **Personalization** | Optional fields: first name, company, specific insight |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/generate-email` | Generate cold email from prospect details |
| `POST` | `/refine-email` | Refine existing email with feedback |
