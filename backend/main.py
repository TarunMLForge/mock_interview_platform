import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from groq import Groq
from typing import List

load_dotenv()

app = FastAPI(title="Zero-Cost AI Mock Interview API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq Client
groq_api_key = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=groq_api_key) if groq_api_key else None

# ----------------- PYDANTIC SCHEMAS ----------------- #
class QuestionBreakdown(BaseModel):
    q_num: int
    score: int = Field(description="Score out of 10")
    mistakes: list[str] = Field(description="Array of brief mistakes made")
    missing_terms: list[str] = Field(description="Array of technical keywords missing")
    perfect_ans: str = Field(description="A concise ideal benchmark answer")

class EvaluationReport(BaseModel):
    overall_score: int = Field(description="Overall score out of 100")
    summary: str = Field(description="2-3 sentence performance summary")
    breakdown: list[QuestionBreakdown]

class DialogueTurn(BaseModel):
    q_num: int
    q: str
    a: str

class EvaluateRequest(BaseModel):
    role_id: str
    role_title: str
    exp_level: str
    dialogues: List[DialogueTurn]

class QuestionsRequest(BaseModel):
    role_id: str
    role_title: str
    exp_level: str

class QuestionList(BaseModel):
    questions: list[str]

# ----------------- ENDPOINTS ----------------- #

@app.get("/health")
def health_check():
    return {"status": "awake"}

@app.post("/api/questions", response_model=QuestionList)
def generate_questions(req: QuestionsRequest):
    """
    Generates 5 specialized questions in a single token-optimized batch using Groq.
    """
    if not client:
        print("API Error (Fallback used): GROQ_API_KEY not configured")
        return {
            "questions": [
                f"Can you walk me through your experience as a {req.role_title}?",
                "What is the most technically challenging problem you have solved?",
                "How do you ensure code quality, security, and maintainability?",
                "Describe a scenario where you had to learn a new technology quickly.",
                "How do you handle disagreements on technical architecture?"
            ]
        }
        
    from domains import get_rubric
    domain_rubric = get_rubric(req.role_id)
    
    system_instruction = f"You are a Lead Interviewer for {req.role_title}. Domain Focus: {domain_rubric}. You must return exactly 5 highly technical interview questions. You must respond in valid JSON matching this schema: {{'questions': ['question 1 string', 'question 2 string', 'question 3 string', 'question 4 string', 'question 5 string']}}. Do not return objects inside the array, ONLY plain strings."
    prompt = f"Generate 5 interview questions for a {req.exp_level} {req.role_title}."
    
    try:
        response = client.chat.completions.create(
            model='llama-3.1-8b-instant',
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        data = json.loads(response.choices[0].message.content)
        return QuestionList(**data)
    except Exception as e:
        print(f"API Error (Fallback used): {e}")
        return {
            "questions": [
                f"Can you walk me through your experience as a {req.role_title}?",
                "What is the most technically challenging problem you have solved?",
                "How do you ensure code quality, security, and maintainability?",
                "Describe a scenario where you had to learn a new technology quickly.",
                "How do you handle disagreements on technical architecture?"
            ]
        }

@app.post("/api/evaluate", response_model=EvaluationReport)
def evaluate_interview(req: EvaluateRequest):
    """
    Batched Groq evaluation. Evaluates all questions at once to save tokens.
    """
    def fallback_mock():
        breakdowns = []
        total_score = 0
        for d in req.dialogues:
            ans = d.a.strip()
            if not ans:
                score = 0
                mistakes = ["No answer provided."]
                missing_terms = ["All expected terms"]
                perfect_ans = "You must provide an answer to receive feedback."
            elif len(ans) < 30:
                score = 3
                mistakes = ["Answer is far too brief.", "Lacks necessary technical depth."]
                missing_terms = ["Examples", "Specifics"]
                perfect_ans = "An ideal answer requires explaining the concept thoroughly and giving a practical example."
            elif len(ans) < 100:
                score = 6
                mistakes = ["Answer is somewhat superficial.", "Could dive deeper into technical specifics."]
                missing_terms = ["Trade-offs", "Advanced concepts"]
                perfect_ans = "An ideal answer would define the concept clearly, provide an example, and discuss trade-offs."
            else:
                score = 8
                mistakes = ["Minor details could be clarified."]
                missing_terms = ["Edge cases"]
                perfect_ans = "A perfect answer addresses the core question, provides examples, and discusses trade-offs comprehensively."
            
            total_score += score
            breakdowns.append({
                "q_num": d.q_num,
                "score": score,
                "mistakes": mistakes,
                "missing_terms": missing_terms,
                "perfect_ans": perfect_ans
            })
            
        overall = int((total_score / (len(req.dialogues) * 10)) * 100) if req.dialogues else 0
        
        if overall == 0:
            summary = "You did not provide answers to the questions. Please ensure your microphone is working and you speak clearly."
        elif overall < 50:
            summary = "Your answers were generally too brief or missing. Try to elaborate more and provide specific technical details."
        elif overall < 80:
            summary = "You demonstrated a basic understanding, but there is room for deeper technical articulation."
        else:
            summary = "Great job! You provided detailed and comprehensive answers."

        return {
            "overall_score": overall,
            "summary": summary,
            "breakdown": breakdowns
        }

    if not client:
        print("API Error (Fallback used): GROQ_API_KEY not configured")
        return fallback_mock()
        
    from domains import get_rubric
    domain_rubric = get_rubric(req.role_id)
    
    system_instruction = f"""You are a strict Lead Interviewer for {req.role_title}. Domain Focus: {domain_rubric}. Evaluate the following interview transcript. CRITICAL: If the candidate does not provide an answer, provides a very short answer, or says 'I don't know', you MUST give a score of 0 or a very low score for that question. Be extremely critical of poor or missing answers and reflect this in the overall_score.
You must respond in valid JSON format matching this exact schema:
{{
  "overall_score": int (0-100),
  "summary": "2-3 sentence performance summary",
  "breakdown": [
    {{
      "q_num": int,
      "score": int (0-10),
      "mistakes": ["mistake 1", "mistake 2"],
      "missing_terms": ["term 1", "term 2"],
      "perfect_ans": "ideal benchmark answer"
    }}
  ]
}}"""
    
    prompt = f"Role:{req.role_title} | Level:{req.exp_level}\nEvaluate this interview transcript:\n"
    for d in req.dialogues:
        prompt += f"Q{d.q_num}:{d.q}\nA:{d.a}\n"
    
    try:
        response = client.chat.completions.create(
            model='llama-3.1-8b-instant',
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        data = json.loads(response.choices[0].message.content)
        return EvaluationReport(**data)
    except Exception as e:
        print(f"API Error (Fallback used): {e}")
        return fallback_mock()
