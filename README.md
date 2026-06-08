# 🚀 Smart Hiring: AI-Powered Recruitment & HR Management System

An advanced, Django-based AI Applicant Tracking System (ATS) and HR management suite designed to automate end-to-end hiring and employee support. 

Smart Hiring leverages local AI models, semantic search, and automated scheduling workflows to streamline the recruitment funnel without relying on paid third-party APIs.

---

## ✨ Key Features

### 🔐 Authentication & Role Management
* **JWT-Based Authentication:** Secure token-based user sessions.
* **Role-Based Access Control (RBAC):** Customized access for:
  * **HR / Recruiters:** Create jobs, view rankings, schedule interviews.
  * **Candidates:** Upload resumes, view job listings, book interviews.
  * **Employees:** Access company policies and HR support.

### 📄 Job Management (HR)
* **Create & Manage Job Roles:** Define job descriptions, required skills, and candidate criteria.
* **Recruitment Pipeline Integration:** Job posts act as the core reference for resume scoring, ranking, and scheduling.

### 🤖 Local AI Resume Screening (No Paid API Keys)
* **Format Support:** Upload and parse resumes directly from PDF or Word (.docx) formats.
* **Semantic Analysis:** Matches candidate resumes against job descriptions using state-of-the-art NLP models.
* **Sentence Transformers:** Computes relative score metrics locally using the `all-MiniLM-L6-v2` transformer model.
* **Auto-Status Assignment:** Candidates are automatically tagged as `SHORTLISTED` or `REJECTED` based on score thresholds.

### 📊 Candidate Ranking & Analytics
* **Consolidated Dashboard:** HR can view candidate scores (0–100) sorted by match quality.
* **Bias-Free Sorting:** Facilitates faster, objective, and fair initial screening decisions.

### 📅 Automated Interview Scheduling
* **Dynamic Time Slots:** HR lists open time slots for specific job roles.
* **Self-Service Booking:** Shortlisted candidates choose and book their preferred times.
* **Anti-Double-Booking:** Race-condition prevention/slot locking to eliminate scheduling overlaps.

### 📧 Email & Calendar Integration (Free & Open Standards)
* **Instant Notifications:** Automatically dispatches interview confirmations.
* **Universal Calendar Invites:** Generates and attaches `.ics` files compatible with **Google Calendar**, **Outlook**, and **Apple Calendar**.
* **Gmail SMTP Integration:** Leverages secure Gmail App Passwords for zero-cost transactional emails.

### 🧠 Advanced RAG-based HR Chatbot
* **Internal Knowledge Base:** Exclusive HR chatbot for employee support.
* **Retrieval-Augmented Generation (RAG):** Performs semantic search queries over official HR policy documents (`policy.txt`).
* **Confidence Checks:** Assesses response accuracy and limits hallucinations.
* **Fully Local Execution:** Entire NLP process runs locally without external APIs.

---

## 🛠 Tech Stack

| Component | Technology | Detail |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3, Django, Django REST Framework (DRF) | Core application APIs and logic |
| **Security** | django-rest-framework-simplejwt | JWT authentication & role authorization |
| **AI / NLP** | `sentence-transformers`, `scikit-learn`, `PyTorch` | Local semantic search & scoring (`all-MiniLM-L6-v2`) |
| **Database** | SQLite | Lightweight & developer-friendly |
| **Email & Calendar** | SMTP (Gmail App Passwords), `icalendar` | Automatic confirmation and `.ics` generation |

---

## 🏗 Project Structure

```text
Smart_hiring/
├── accounts/            # Authentication, roles, and user profiles
├── candidates/          # Resume upload, parsing, and AI scoring
├── chatbot/             # RAG-based chatbot logic & policy documents
├── interviews/          # Time slot allocation and booking engine
├── hrAgent_backend/     # Main Django settings, urls, and configurations
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py            # Django admin command-line tool
├── requirements.txt     # Python package dependencies
├── .gitignore           # File exclusion rules
└── README.md            # Project documentation
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/nehatyagi17/Smart_hiring.git
cd Smart_hiring
```

### 2️⃣ Create and Activate a Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 4️⃣ Set Environment Variables
To enable automated emails and calendar invites, set up Gmail SMTP App Passwords:

**On Windows (Command Prompt):**
```cmd
setx EMAIL_HOST_USER "yourgmail@gmail.com"
setx EMAIL_HOST_PASSWORD "your_app_password"
```

**On macOS/Linux:**
```bash
export EMAIL_HOST_USER="yourgmail@gmail.com"
export EMAIL_HOST_PASSWORD="your_app_password"
```
> [!NOTE]
> Please restart your terminal/IDE after setting the environment variables for them to take effect.

### 5️⃣ Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6️⃣ Start the Server
```bash
python manage.py runserver
```
The API server will run locally at: **`http://127.0.0.1:8000/`**

---

## 🧪 Core API Endpoints

### 🔹 Authentication & Accounts
* **`POST /api/accounts/register/`** - Register a new user (HR, Candidate, or Employee).
* **`POST /api/accounts/login/`** - Authenticate user and return JWT access/refresh tokens.

### 🔹 Jobs (HR Only)
* **`POST /api/jobs/create/`** - Post a new job opportunity.
* **`GET /api/jobs/`** - List all active job postings.

### 🔹 Resume & Screening (Candidate / HR)
* **`POST /api/candidates/upload/`** - Candidate uploads resume (.pdf/.docx) to a specific job.
* **`GET /api/candidates/ranked/<job_id>/`** - HR views a ranked list of candidates matching the job.

### 🔹 Interview Scheduling
* **`POST /api/interviews/slots/create/`** - HR posts available time slots for a job.
* **`GET /api/interviews/slots/<job_id>/`** - Candidates retrieve open interview slots.
* **`POST /api/interviews/book/<slot_id>/`** - Candidate books a slot (triggers calendar invite & email).

### 🔹 HR Chatbot (Employee Only)
* **`POST /api/chatbot/ask/`** - Query the RAG chatbot about HR policies.

---

## 🔒 Security Best Practices
* **Robust Authorization:** Restricted API access using Django's permission classes.
* **Token Rotation:** Safe session management using Short-lived Access Tokens (JWT).
* **Decoupled Configuration:** Sensitive details (SMTP, passwords) are loaded via environment variables.

---

## 👨‍💻 Team & Contributors

* **Neha Tyagi (Team Leader)**
  * AI, NLP, and LLM Development
  * 🔗 [GitHub Profile](https://github.com/nehatyagi17)
* **Aditya Rawat**
  * Backend API & Infrastructure Development
  * 🔗 [GitHub Profile](https://github.com/AdityaRawat05)
* **Ayush Butola**
  * Database Design & Integration
  * 🔗 [GitHub Profile](https://github.com/AyushButola)
* **Divyam Samant**
  * Frontend Interface Design
  * 🔗 [GitHub Profile](https://github.com/SamantD7)
