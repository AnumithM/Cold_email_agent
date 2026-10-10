from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Cold Email Agent API", version="1.0.0")

# Allow requests from local environments and production Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://cold-email-agent-blue.vercel.app",
        "*"  # Allows all origins in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# Request Model from Frontend
class EmailRequest(BaseModel):
    target_persona: str
    target_industry: str
    pain_point: str
    product_service: str
    core_benefit: str
    social_proof: str
    prospect_first_name: str = "[First Name]"
    company_name: str = "[Company Name]"
    specific_insight: str = ""


# Structured Output Schema for Gemini
class EmailSchema(BaseModel):
    subject_lines: list[str] = Field(description="List of 3 short, punchy subject lines.")
    email_body: str = Field(description="The complete email body under 100 words without unescaped newlines.")
    tone_notes: str = Field(description="Short description of the tone/angle used.")


class EmailResponse(BaseModel):
    subject_lines: list[str]
    email_body: str
    word_count: int
    tone_notes: str


# Initialize Model using gemini-3.8-flash
model = genai.GenerativeModel("gemini-3.8-flash")

SYSTEM_PROMPT = """You are an expert B2B Copywriter and Cold Email Specialist focused on high deliverability and high conversion rates.

Your task: Generate a personalized, concise, and persuasive cold outreach email.

Strict rules:
1. Subject Lines: Generate exactly 3 punchy subject lines (1-4 words each). AVOID spam triggers like FREE, Urgent, Limited time, Guarantee.

2. Pitch Structure:
   - Hook: Start with a specific, relevant hook based on the prospect's pain point or industry insight. NEVER start with "I hope this email finds you well."
   - Value Proposition: State the problem solved and tangible outcome in 1-2 sentences.
   - Social Proof: Briefly mention a relevant metric or client result.
   - CTA: Use a soft, low-friction CTA. Do NOT demand a 30-minute call upfront.
3. Tone: Professional yet conversational (peer-to-peer, not a desperate seller).
4. Body Length: STRICTLY under 100 words.
5. Use placeholders like [First Name], [Company Name] where appropriate.
"""


@app.get("/")
def root():
    return {"status": "Cold Email Agent API is running", "version": "1.0.0"}


@app.post("/generate-email", response_model=EmailResponse)
async def generate_email(request: EmailRequest):
    user_prompt = f"""
Generate a cold outreach email using these details:

- Target Persona: {request.target_persona}
- Target Industry: {request.target_industry}
- Prospect's Pain Point: {request.pain_point}
- My Product/Service: {request.product_service}
- Core Benefit/Result: {request.core_benefit}
- Social Proof/Metric: {request.social_proof}
- Prospect First Name: {request.prospect_first_name}
- Company Name: {request.company_name}
- Specific Insight: {request.specific_insight if request.specific_insight else "Use a relevant industry-specific observation"}

Remember: Body must be UNDER 100 words.
"""

    try:
        response = model.generate_content(
            [SYSTEM_PROMPT, user_prompt],
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2048,
                response_mime_type="application/json",
                response_schema=EmailSchema,
            ),
        )

        data = json.loads(response.text)

        body = data.get("email_body", "")
        word_count = len(body.split())

        return EmailResponse(
            subject_lines=data.get("subject_lines", []),
            email_body=body,
            word_count=word_count,
            tone_notes=data.get("tone_notes", ""),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating email: {str(e)}",
        )


@app.post("/refine-email")
async def refine_email(request: dict):
    original_email = request.get("email_body", "")
    feedback = request.get("feedback", "")
    context = request.get("context", {})

    refine_prompt = f"""
You are refining a cold email based on user feedback.

Original Email:
{original_email}

User Feedback / Requested Changes:
{feedback}

Context:
{json.dumps(context, indent=2)}

Rewrite the email incorporating the feedback. Keep it under 100 words.
"""

    try:
        response = model.generate_content(
            refine_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.6,
                max_output_tokens=2048,
                response_mime_type="application/json",
                response_schema=EmailSchema,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))