# Welcome to the Legal AI project

This project is an interactive demo of an **automated regulatory compliance audit tool**, designed for legal teams.

Users can upload a legal document (e.g. a privacy policy) and receive:
- ✅ A **global compliance score**
- 📋 A **summary of positive points**
- ⚠️ A **list of improvement areas** with relevant legal articles and recommendations
- 📄 A downloadable **PDF report**


> The goal is to provide a **legal assistant powered by AI** capable of quickly reviewing a document for regulatory compliance, using a rule-based assessment aligned with applicable laws.

---

## 🧠 Tech Stack

- **Frontend**: React + TypeScript (TSX), TailwindCSS + ShadCN/UI
- **Backend**: Python, FastAPI, OpenAI API

---

## 🔍 How It Works

The user uploads a PDF document.

The file is sent to the backend for analysis.

A loading animation is shown while processing.

The backend returns:

    - a compliance score (0–100)

    - positive audit findings and improvement suggestions

The frontend renders a detailed and user-friendly report.

---

## ⚙️ Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the backend server

```bash
uvicorn app:main --reload
```

### 4. Start the frontend development server

```bash
npm run dev
```