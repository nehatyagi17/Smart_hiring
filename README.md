🚀 TalentSync-AI
AI-Powered Recruitment & HR Management System (Backend)

TalentSync-AI is a Django REST–based AI-powered Applicant Tracking System (ATS) that automates end-to-end hiring and HR workflows.
It includes AI resume screening, candidate ranking, interview scheduling, email + calendar integration, and an advanced HR chatbot (RAG-based) — all built using free and open-source technologies.

✨ Key Features
🔐 Authentication & Role Management

JWT-based authentication

Role-based access control:

HR

Candidate

Employee

📄 Job Management (HR)

Create and manage job descriptions

Jobs act as the base for:

Resume screening

Candidate ranking

Interview scheduling

🤖 AI Resume Screening (FREE • Local AI)

Upload resumes (PDF / DOCX)

Automatic resume text extraction

Semantic similarity matching between:

Job description

Resume content

AI scoring using Sentence Transformers

Automatic candidate status:

SHORTLISTED

REJECTED

✔ No OpenAI
✔ No paid APIs
✔ Fully local AI model

📊 Candidate Ranking (HR)

Ranked candidate list per job

Transparent AI score (0–100)

Sorted results for faster and fair hiring decisions

📅 Interview Scheduling

HR creates interview time slots

Candidates self-book available slots

Slot locking prevents double booking

Interview records stored securely

📧 Email & 📎 Calendar Integration (FREE)

Automatic interview confirmation emails

.ics calendar invite attached

Works seamlessly with:

Google Calendar

Outlook

Apple Calendar

Uses Gmail SMTP with App Passwords

No paid calendar APIs required

🧠 Advanced HR Chatbot (RAG-based)

Employee-only HR chatbot

Retrieval-Augmented Generation (RAG)

Semantic search over HR policy documents

Context-aware conversation

Confidence score to prevent hallucinations

Fully local NLP (no paid LLMs)

🛠 Tech Stack
Backend

Python 3

Django

Django REST Framework

JWT Authentication (SimpleJWT)

AI / NLP

sentence-transformers

scikit-learn

Local model: all-MiniLM-L6-v2

PyTorch (CPU)

Database

SQLite (lightweight, development-friendly)

Email & Calendar

Gmail SMTP (App Password)

Calendar invites via .ics files

🏗 Project Structure
TalentSync-AI/
├── accounts/          # Authentication, roles, users
├── jobs/              # Job descriptions
├── candidates/        # Resume upload & AI screening
├── interviews/        # Interview slots & scheduling
├── chatbot/           # Advanced HR chatbot (RAG)
├── hr_agent_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md

⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/AdityaRawat05/TalentSync-AI.git
cd TalentSync-AI
2️⃣ Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Environment Variables (Email)

Set Gmail credentials using App Passwords:

setx EMAIL_HOST_USER "yourgmail@gmail.com"
setx EMAIL_HOST_PASSWORD "your_app_password"


🔁 Restart terminal after setting variables.

5️⃣ Run Migrations
python manage.py makemigrations
python manage.py migrate

6️⃣ Start Server
python manage.py runserver


Server will run at:

http://127.0.0.1:8000/

🔑 API Flow (High Level)
User (HR / Candidate / Employee)
        ↓
JWT Authentication
        ↓
REST APIs
        ↓
Business Logic
        ↓
AI Resume Screening / RAG Chatbot
        ↓
Database
        ↓
Email + Calendar Notifications

🧪 Core API Endpoints
🔹 Authentication
POST /api/accounts/register/
POST /api/accounts/login/

🔹 Jobs (HR)
POST /api/jobs/create/
GET  /api/jobs/

🔹 Resume Upload (Candidate)
POST /api/candidates/upload/

🔹 Ranked Candidates (HR)
GET /api/candidates/ranked/<job_id>/

🔹 Interview Scheduling
POST /api/interviews/slots/create/    # HR
GET  /api/interviews/slots/<job_id>/
POST /api/interviews/book/<slot_id>/  # Candidate

🔹 HR Chatbot
POST /api/chatbot/ask/

🔒 Security Best Practices

JWT authentication

Role-based permissions

No hard-coded credentials

Environment variables for secrets

.gitignore protects sensitive files

🧠 Interview-Ready Highlights

AI resume screening without paid APIs

Semantic similarity–based candidate ranking

Automated interview scheduling workflow

Email + calendar integration using open standards

Advanced HR chatbot using RAG

Clean, scalable REST architecture

🚀 Future Enhancements

Analytics dashboard

Frontend integration (React)

Cloud deployment (Render / AWS)

PDF-based HR policy ingestion for chatbot

👨‍💻 Team & Contributors

Neha Tyagi (Team Leader)
AI, NLP, LLM
🔗 https://github.com/nehatyagi17

Aditya Rawat
Backend Development
🔗 https://github.com/AdityaRawat05

Ayush Butola
API Handling & Database Management
🔗 https://github.com/AyushButola

Divyam Samant
Frontend Development
🔗 https://github.com/SamantD7
