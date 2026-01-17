🤖 OmniBot Backend – Multi-Tenant AI Chatbot API

OmniBot Backend is a scalable, multi-tenant AI chatbot API designed to power plug-and-play chat widgets for any business.
It supports tenant isolation, Retrieval-Augmented Generation (RAG), conversation memory, and LLM provider decoupling.

This backend is framework-agnostic from the frontend perspective and can be integrated with any website or application.

🚀 Features

✅ Multi-tenant architecture (strict data isolation)

✅ Secure AI orchestration layer

✅ RAG-based responses (company data only)

✅ Optional general-purpose AI mode

✅ Conversation memory support

✅ MongoDB-based persistence

✅ LLM provider agnostic (OpenRouter, Gemini, etc.)

✅ Ready for SaaS scaling

🧱 Tech Stack
Layer	Technology
Runtime	Node.js
API Framework	Express.js
Database	MongoDB (Mongoose)
AI Provider	OpenRouter (LLMs via API)
Language	TypeScript
Auth	API key (tenant-based)
Architecture	Clean, decoupled services
📁 Project Structure
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

🔐 Environment Variables

Create a .env file in the backend root:

PORT=4000
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=mongodb://localhost:27017/admin

🔌 MongoDB Setup

Database:

admin


Collections:

Tenant
Document
Conversation (optional)


Example Tenant document:

{
  "_id": "tenant_tutoronline",
  "name": "TutorOnline",
  "systemInstruction": "You are a helpful tutoring assistant.",
  "status": "active"
}


Example Document:

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
Fetch documents for tenant

POST /api/documents
Add document

{
  "tenantId": "tenant_tutoronline",
  "title": "Refund Policy",
  "content": "7-day refund available",
  "type": "text"
}

🧠 AI Orchestration Logic

The AI pipeline works as follows:

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

🧪 Data Isolation Test (Critical)

Tenant A asks:

“What is the price of the Private Pool Villa?”

Expected response:

I’m sorry, I don’t have information on that.


✔ Confirms multi-tenant isolation

🧩 LLM Provider Decoupling

The backend can switch models without changing business logic.

Supported:

OpenRouter (LLaMA, Mistral, GPT, etc.)

Gemini

Local / self-hosted models (future)

📈 Scalability Roadmap

Redis-based conversation cache

Vector DB (Pinecone / Qdrant)

Streaming responses

Role-based admin access

Usage-based billing

Webhook notifications

🧑‍💻 Local Development
npm install
npm run dev


Server starts at:

http://localhost:4000

📄 License

MIT License
Free to use, modify, and commercialize.

✨ Final Note

This backend is not a demo.
It is designed as a real SaaS-ready AI chatbot platform that can be used by any business in minutes.