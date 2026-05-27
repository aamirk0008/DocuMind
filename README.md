# DocuMind — AI-Powered Document Q&A System

> Upload any PDF and chat with it using AI. Every answer is grounded in your document with exact source citations.

🔗 **Live Demo:** [docu-mind-neon-gamma.vercel.app](https://docu-mind-neon-gamma.vercel.app)  
📦 **Backend:** [documind-7b6s.onrender.com](https://documind-7b6s.onrender.com/api/health)

---

## What is DocuMind?

DocuMind is a production-grade RAG (Retrieval-Augmented Generation) system that lets users upload PDF documents and ask questions in natural language. Unlike generic AI chatbots, every answer is strictly grounded in the uploaded document — with exact source citations showing which chunk of the document the answer came from.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS v4
- Zustand (auth + theme state)
- React Query (server state + polling)
- React Router v6
- Lucide React

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- MongoDB Atlas Vector Search
- LangChain.js
- Gemini API (gemini-2.5-flash + gemini-embedding-001)
- BullMQ + Redis (Upstash)
- Passport.js (Google OAuth 2.0)
- JWT (dual-token with refresh rotation)

**Infrastructure**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas (Mumbai region)
- Queue: Upstash Redis

---

## Architecture

**Ingestion Pipeline**
```
User uploads PDF
       ↓
Express API → Multer (file validation)
       ↓
Document saved to MongoDB (status: pending)
       ↓
Job pushed to BullMQ queue
       ↓
Ingestion Worker picks up job
       ↓
pdfjs-dist → extract text from all pages
       ↓
RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
       ↓
Gemini embedding-001 → 3072-dim vectors
       ↓
insertMany → MongoDB Atlas chunks collection
       ↓
Document status → ready ✓
```

**Query Pipeline**
```
User asks a question
       ↓
Embed question → Gemini embedding-001 (RETRIEVAL_QUERY)
       ↓
$vectorSearch aggregation → top 5 chunks (cosine similarity)
       ↓
Filter by documentId → only chunks from this document
       ↓
Build context string from retrieved chunks
       ↓
Gemini 2.5 Flash → grounded answer with source citations
       ↓
Save to ChatSession → return to frontend ✓
```

---

## Features

- **RAG Pipeline** — PDF → chunks → embeddings → vector search → Gemini answer
- **Source Citations** — every answer shows which chunk it came from with relevance scores
- **BullMQ Async Queue** — large PDFs processed in background, 3x retry with exponential backoff
- **JWT Dual-Token Auth** — access + refresh tokens with rotation and reuse detection
- **Google OAuth 2.0** — sign in with Google via Passport.js
- **AI Suggested Questions** — Gemini generates 5 starter questions when document is ready
- **Real-time Status Polling** — document status updates live without page refresh
- **Chat History** — all conversations persisted to MongoDB
- **Dark / Light Mode** — full theme support with toggle
- **Rate Limiting** — per-route limits (auth: 10/15min, upload: 20/hr, chat: 20/min)
- **Input Validation** — express-validator on all routes

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── redis.js            # Upstash Redis connection
│   │   ├── gemini.js           # LangChain + Gemini init
│   │   └── passport.js         # Google OAuth strategy
│   ├── models/
│   │   ├── User.js             # email, password, googleId, refreshTokens
│   │   ├── Document.js         # metadata, status, chunkCount
│   │   └── ChatSession.js      # messages[], sources[], documentId
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── document.routes.js
│   │   ├── chat.routes.js
│   │   └── oauth.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── document.controller.js
│   │   └── chat.controller.js
│   ├── services/
│   │   ├── ingestion.service.js  # PDF → chunks → embeddings
│   │   ├── query.service.js      # vector search → Gemini answer
│   │   └── token.service.js      # JWT issue + verify
│   ├── workers/
│   │   └── ingestion.worker.js   # BullMQ consumer
│   ├── queues/
│   │   └── ingestion.queue.js    # BullMQ producer
│   ├── middleware/
│   │   ├── auth.js               # verifyAccessToken
│   │   ├── upload.js             # Multer config
│   │   ├── rateLimiter.js        # per-route rate limits
│   │   ├── validate.js           # express-validator middleware
│   │   └── errorHandler.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── chat.validator.js
│   ├── app.js
│   └── server.js

frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── AuthPage.jsx          # Login + register + Google OAuth
│   │   ├── DashboardPage.jsx     # Document library
│   │   ├── ChatPage.jsx          # Chat interface
│   │   └── OAuthCallback.jsx     # OAuth redirect handler
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Card.jsx
│   │   └── layout/
│   │       └── Navbar.jsx
│   ├── hooks/
│   │   ├── useDocuments.js
│   │   └── useChat.js
│   ├── store/
│   │   ├── authStore.js          # Zustand auth state
│   │   └── themeStore.js         # Zustand theme state
│   └── lib/
│       ├── api.js                # Axios instance + interceptors
│       └── utils.js              # cn() utility
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email + password |
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout + clear cookie |
| GET | `/api/oauth/google` | Initiate Google OAuth |
| GET | `/api/oauth/google/callback` | Google OAuth callback |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload PDF (multipart) |
| GET | `/api/documents` | List user's documents |
| GET | `/api/documents/:id/status` | Get document status |
| GET | `/api/documents/:id/suggestions` | Get AI suggested questions |
| DELETE | `/api/documents/:id` | Delete document + chunks |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/:documentId/ask` | Ask a question |
| GET | `/api/chat/:documentId/history` | Get chat history |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Upstash Redis account (free tier works)
- Google AI Studio API key (for Gemini)
- Google Cloud Console project (for OAuth)

### Backend

```bash
git clone https://github.com/aamirk0008/documind-backend
cd documind-backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=your_upstash_redis_url
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback
NODE_ENV=development
```

```bash
npm run dev
```

### Frontend

```bash
git clone https://github.com/aamirk0008/documind-frontend
cd documind-frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev
```

### MongoDB Atlas Vector Search Index

Create a vector search index on the `documind.chunks` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 3072,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "metadata.documentId"
    }
  ]
}
```

Name the index `vector_index`.

---

## Key Technical Decisions

**Why RAG over fine-tuning?**
RAG is faster to deploy, cheaper to run, and more accurate for document-specific queries. Fine-tuning requires retraining for every new document — RAG works with any document instantly.

**Why BullMQ for ingestion?**
Processing large PDFs synchronously would block the HTTP request. BullMQ moves ingestion to a background worker with retry logic, so users get an immediate response and the document processes asynchronously.

**Why MongoDB Atlas Vector Search over Pinecone?**
Keeps the stack unified — one database for documents, chat history, and vector embeddings. Reduces infrastructure complexity and cost for a project at this scale.

**Why Gemini embedding-001 over text-embedding-004?**
text-embedding-004 wasn't available on the API key tier used. gemini-embedding-001 produces 3072-dim vectors with strong semantic understanding for document retrieval tasks.

**Why dual-token JWT?**
Short-lived access tokens (15min) limit exposure if stolen. Refresh tokens rotate on every use — reuse detection invalidates all sessions if a token is replayed, preventing token theft attacks.

---


## Author

**Sheikh Aamir**  
Full-stack developer · New Delhi, India  
[LinkedIn](https://www.linkedin.com/in/sheikh-aamir-41661b262/) · [GitHub](https://github.com/aamirk0008) · aamirsheikh0008@gmail.com

---

## License

MIT

