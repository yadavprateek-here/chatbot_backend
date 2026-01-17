# 🤖 OmniBot Backend – Multi-Tenant AI Chatbot API

OmniBot Backend is a **scalable, multi-tenant AI chatbot API** designed to power **plug-and-play chat widgets** for any business.

It supports **strict tenant isolation**, **Retrieval-Augmented Generation (RAG)**, **conversation memory**, and **LLM provider decoupling**.

This backend is **framework-agnostic from the frontend perspective** and can be integrated with any website or application.

---

## 🚀 Features

- ✅ Multi-tenant architecture (strict data isolation)
- ✅ Secure AI orchestration layer
- ✅ RAG-based responses (company data only)
- ✅ Optional general-purpose AI mode
- ✅ Conversation memory support
- ✅ MongoDB-based persistence
- ✅ LLM provider agnostic (OpenRouter, Gemini, etc.)
- ✅ SaaS-ready and scalable

---

## 🧱 Tech Stack

| Layer            | Technology              |
|------------------|-------------------------|
| Runtime          | Node.js                 |
| API Framework    | Express.js              |
| Database         | MongoDB (Mongoose)      |
| AI Provider      | OpenRouter (LLMs via API) |
| Language         | TypeScript              |
| Authentication  | API Key (tenant-based)  |
| Architecture    | Clean, decoupled services |

---

## 📁 Project Structure

```txt
src/
├── index.ts                 # App entry point
├── routes/
│   ├── chat.route.ts        # Chat API
│   ├── tenant.route.ts      # Tenant CRUD
│   └── document.route.ts    # Knowledge base CRUD
├── services/
│   ├── ai-orchestrator.ts   # LLM + RAG logic
│   ├── tenant.service.ts   # Tenant & document access
│   └── memory.service.ts   # (Optional) conversation memory
├── models/
│   ├── tenant.model.ts
│   ├── document.model.ts
│   └── conversation.model.ts
└── config/
    └── db.ts                # MongoDB connection


## 🔐 Environment Variables

Create a `.env` file in the backend root:

```env
PORT=4000
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=mongodb://localhost:27017/admin


🔌 MongoDB Setup
Database
admin

Collections

Tenant

Document

Conversation (optional)

Example Tenant Document
{
  "_id": "tenant_tutoronline",
  "name": "TutorOnline",
  "systemInstruction": "You are a helpful tutoring assistant.",
  "status": "active"
}

Example Document
{
  "_id": "doc_001",
  "tenantId": "tenant_tutoronline",
  "title": "Pricing Plans",
  "content": "Basic ₹1,999, Pro ₹4,999, Premium ₹9,999",
  "type": "text",
  "tokens": 120
}

📡 API Endpoints
🧠 Chat API

POST /chat/message

Request
{
  "companyId": "tenant_tutoronline",
  "message": "What is the Premium plan price?",
  "history": []
}

Response
{
  "reply": "The Premium plan costs ₹9,999 per month."
}

🏢 Tenants API

GET /api/tenants
Fetch all tenants

POST /api/tenants
Create a new tenant

{
  "name": "New Company"
}

📚 Knowledge Base API

GET /api/tenants/:tenantId/documents
Fetch documents for a tenant

POST /api/documents
Add a document

{
  "tenantId": "tenant_tutoronline",
  "title": "Refund Policy",
  "content": "7-day refund available",
  "type": "text"
}

🧠 AI Orchestration Logic

The AI pipeline follows this flow:

Validate tenant

Fetch tenant-specific documents

Build RAG context

Inject conversation memory (optional)

Apply strict system rules

Call LLM provider

Return grounded response

Prompt Hierarchy
System Rules
↓
Tenant Instructions
↓
RAG Context
↓
Conversation Memory
↓
User Message

🔒 Security & Isolation

🔐 Tenant-based data isolation

🔐 No cross-tenant document access

🔐 No frontend exposure of API keys

🔐 LLM access only via backend

🔐 Safe fallback responses
