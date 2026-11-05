# AI Second Brain – Frontend

A modern, responsive, and commercial-grade React & TypeScript dashboard for the **AI Second Brain** intelligence system.

## 🚀 Technology Stack

- **React 18** + **TypeScript**
- **Vite 6** (Fast Development & Build Tooling)
- **Tailwind CSS 3** (Custom SaaS Theme with Slate & Brand Violet Palette)
- **React Router DOM 6** (Multi-page SPA Routing)
- **Axios** (Centralized API Client with Error Interceptors)
- **Lucide React** (Clean Modern Icons)
- **React Hot Toast** (User-friendly Feedback Notifications)

---

## 📁 Directory Structure

```text
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .env
├── .env.example
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types/
    │   └── memory.ts              # Strongly-typed API schemas
    ├── services/
    │   ├── api.ts                 # Axios instance with baseUrl & interceptors
    │   ├── memoryService.ts       # CRUD & Search endpoints
    │   └── askService.ts          # Question & Retrieval endpoint
    ├── components/
    │   ├── common/
    │   │   ├── ConfirmModal.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ImportanceMeter.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── StatusBadge.tsx
    │   ├── dashboard/
    │   │   └── StatCard.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Layout.tsx
    │   │   └── Sidebar.tsx
    │   └── memories/
    │       └── MemoryCard.tsx
    └── pages/
        ├── Dashboard.tsx          # Health check, counts, quick actions, recent items
        ├── Memories.tsx           # Full list, filter by importance, sort, delete
        ├── AddMemory.tsx          # Content, importance slider & presets, validation
        ├── MemoryDetails.tsx      # Single memory view by UUID, copy, delete
        ├── Search.tsx             # Keyword search with instant results
        └── AskBrain.tsx           # Chat-style natural language question & memory retrieval
```

---

## 🛠️ Installation & Setup

### 1. Ensure the Backend is Running
Before starting the frontend, ensure the FastAPI backend is running on `http://127.0.0.1:8000`:
```bash
# In the project root:
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables
Create `.env` if not present (default points to local FastAPI):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be accessible at:
👉 **`http://localhost:5173`**

### 5. Production Build
```bash
npm run build
```
Creates an optimized static bundle in `frontend/dist/`.

