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

## Key Technical Decisions

### 1. RAG over Fine-tuning
**Why:** Fine-tuning requires retraining the model for every new document, which is expensive, slow, and impractical for a multi-user system where every user uploads different documents. RAG retrieves relevant context at query time and passes it to the model — no retraining needed, works with any document instantly, and the knowledge is always up to date.

**Trade-off:** RAG quality depends heavily on chunking strategy and embedding quality. If chunks are too large, irrelevant context pollutes the answer. If too small, answers lack enough context. We use 1000-char chunks with 200-char overlap — overlap ensures sentences cut at chunk boundaries don't lose meaning.

**Alternative:** Fine-tuning would make sense for a domain-specific assistant (e.g. a legal AI trained on thousands of contracts) where the knowledge is static and shared across all users.

---

### 2. MongoDB Atlas Vector Search over Pinecone / Qdrant
**Why:** Keeps the entire stack on one database — documents, chat history, user data, and vector embeddings all live in MongoDB. This eliminates a separate vector database service, reduces infrastructure cost, and simplifies deployment. MongoDB Atlas free tier supports vector search, making it ideal for a portfolio project.

**Trade-off:** Dedicated vector databases like Pinecone or Qdrant offer more advanced ANN indexing algorithms (HNSW) and better performance at very large scale (millions of vectors). MongoDB Atlas Vector Search uses a flat index which is slightly slower at extreme scale.

**Alternative:** Pinecone would be the right choice if the system needed to handle tens of millions of vectors across thousands of users with sub-10ms query latency.

---

### 3. BullMQ + Redis for Async Ingestion
**Why:** Processing a large PDF synchronously inside an HTTP request would block the server for 10-30 seconds — unacceptable UX and a timeout risk. BullMQ moves ingestion to a background worker: the API responds immediately with `status: pending`, and the worker processes the PDF asynchronously. 3x retry with exponential backoff handles transient failures (Gemini API timeouts, MongoDB write failures) without user intervention.

**Trade-off:** Adds Redis as an infrastructure dependency. For a simple single-user app, in-process queuing (like a simple async function) would work. BullMQ is the right choice when you need persistence (jobs survive server restarts), retry logic, and concurrency control.

**Alternative:** Without Redis, you could use a simple in-memory queue or process PDFs synchronously with a longer timeout. For serverless deployments, a message queue like AWS SQS or Google Pub/Sub would replace BullMQ entirely.

---

### 4. JWT Dual-Token Auth with Refresh Rotation
**Why:** A single long-lived JWT is a security risk — if stolen, an attacker has access until expiry. Dual-token solves this: short-lived access tokens (15 min) limit the damage window, while refresh tokens rotate on every use. Reuse detection invalidates all sessions if a refresh token is replayed — this catches token theft attacks where an attacker steals and uses a refresh token before the legitimate user does.

**Trade-off:** More complexity than a single token. Requires storing refresh tokens in the database for reuse detection, adding a DB read on every refresh. Stateless JWTs lose their stateless advantage when you start persisting them.

**Alternative:** Session-based auth (server-side sessions with Redis) is simpler and easier to invalidate. OAuth-only (no email/password) would eliminate token management entirely but reduces flexibility.

---

### 5. Gemini embedding-001 over text-embedding-004
**Why:** `text-embedding-004` wasn't available on the API key tier used during development. `gemini-embedding-001` produces 3072-dimensional vectors with strong semantic understanding for retrieval tasks. The higher dimensionality (vs the typical 768 or 1536 of other models) captures more semantic nuance.

**Trade-off:** 3072-dim vectors use more storage and make vector search slightly slower than lower-dimensional alternatives. Each chunk document in MongoDB is larger.

**Alternative:** OpenAI's `text-embedding-3-large` (3072-dim) or `text-embedding-3-small` (1536-dim) are strong alternatives with wider ecosystem support. If cost is a concern, `text-embedding-3-small` offers a good balance of quality and size.

---

### 6. RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
**Why:** PDFs contain varied content — paragraphs, bullet points, tables, headers. `RecursiveCharacterTextSplitter` tries to split on natural boundaries (paragraphs → sentences → words) before falling back to character splits. This preserves semantic coherence better than fixed-size splitting. 1000-char chunks fit comfortably within Gemini's embedding input limit (2048 tokens for embedding-001) while being large enough to contain meaningful context.

**Trade-off:** Overlapping chunks (200 chars) increase storage by ~20% but prevent answers from being cut off at chunk boundaries. A sentence that starts at character 900 of one chunk and ends at character 50 of the next will be captured in both.

**Alternative:** Semantic chunking (splitting on embedding similarity drops rather than character count) produces more coherent chunks but is significantly slower and more expensive at ingestion time.

---

### 7. Zustand for Client State + React Query for Server State
**Why:** Separating concerns — React Query handles all async server state (documents list, chat history, document status polling) with built-in caching, background refetching, and optimistic updates. Zustand handles the tiny slice of pure client state (logged-in user, theme preference) that doesn't need React Query's complexity. Together they eliminate the need for Redux entirely.

**Trade-off:** Two state management libraries instead of one. However, they serve genuinely different purposes — mixing them into one Redux store would add unnecessary boilerplate for what is essentially a 3-field client state.

**Alternative:** Redux Toolkit with RTK Query handles both server and client state in one library. Better for large teams with complex interconnected state. Over-engineered for this project's scope.

---

### 8. Separate Frontend and Backend Deployment
**Why:** Deploying frontend (Vercel) and backend (Render) separately allows independent scaling, independent deployment pipelines, and lets each platform optimize for its workload. Vercel's edge network serves the React app from CDN nodes closest to the user. Render runs the Node.js server with persistent connections to MongoDB and Redis.

**Trade-off:** Cross-origin requests require careful CORS configuration. Cookies require `SameSite: none; Secure` in production. A monorepo deployment on a single platform (Railway, Fly.io) would eliminate these issues.

**Alternative:** A monolith deployment on Railway or Fly.io would simplify CORS and cookie handling. Next.js full-stack would eliminate the separate backend entirely for simpler use cases.

---


## Author

**Sheikh Aamir**  
Full-stack developer · New Delhi, India  
[LinkedIn](https://www.linkedin.com/in/sheikh-aamir-41661b262/) · [GitHub](https://github.com/aamirk0008) · aamirsheikh0008@gmail.com

---

## License

MIT

