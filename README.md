# Cold Email Agent

An agentic AI web application that generates high-converting B2B cold emails using **Google Gemini**, built with **FastAPI** (Python) and **React + Tailwind CSS**. Fully deployed with backend API hosted on **Render** and frontend hosted on **Vercel**.

---

## Live Deployment

* **Frontend App (Vercel):** [https://cold-email-agent-blue.vercel.app](https://cold-email-agent-blue.vercel.app)
* **Backend API (Render):** [https://cold-email-agent-2ge9.onrender.com](https://cold-email-agent-2ge9.onrender.com)
* **GitHub Repository:** [https://github.com/AnumithM/Cold_email_agent](https://github.com/AnumithM/Cold_email_agent)

---

## Prerequisites

Install these before running locally:

* [Python 3.11+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/)
* A [Google Gemini API key](https://aistudio.google.com/app/apikey) (supports both `AIzaSy...` and project-linked `AQ...` key formats)

---

## Project Structure

```text
cold-email-agent/
├── backend/
│   ├── main.py           # FastAPI app with Gemini AI & fallback routing
│   ├── requirements.txt  # Dependencies (google-genai SDK, FastAPI, Uvicorn)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js        # Axios instance configured for production/local backend
    │   └── components/
    │       ├── EmailForm.jsx
    │       ├── EmailResult.jsx
    │       └── Skeleton.jsx
    ├── package.json
    └── vite.config.js

## Project Structur

cd cold-email-agent\backend

# Copy env file and add your Gemini API key
Copy-Item .env.example .env
notepad .env   # Set GEMINI_API_KEY=your_key_here without quotes

# Create virtual environment and install dependencies
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start the local development server
uvicorn main:app --reload --port 8000
