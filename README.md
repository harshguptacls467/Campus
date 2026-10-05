# 🎓 Campus Copilot

> **AI-Native Campus Intelligence for Engineering Students**  
> Grounded RGPV notices, real-time exam circular ingestion, intelligent day-wise study planning, placement gap analysis, and deterministic deadline action tracking.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: 20+ LTS
- **Supabase**: PostgreSQL with `pgvector`
- **Google Gemini API Key**: `gemini-3.8-flash` & `gemini-embedding-001`

### 2. Install & Configure
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and enter your Supabase & Gemini keys
```

### 3. Run Locally
```bash
# Terminal 1: Run Fastify API Server (Port 5001)
npm run server

# Terminal 2: Run Next.js Frontend (Port 3000)
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend API:** Fastify 5, TypeScript
- **Database & Storage:** Supabase (PostgreSQL 15), pgvector 768-d semantic embeddings, Supabase Storage
- **AI Intelligence:** Google Gemini (`gemini-3.8-flash`, `gemini-embedding-001`) with strict Zod runtime schema validation
- **Data Ingestion:** Real-time RGPV portal scraper with SHA-256 deduplication and fallback circulars

---

## 📖 Production Deployment Guide

For step-by-step production deployment instructions (Vercel, Railway, Render, or self-hosted Ubuntu VPS with Nginx & PM2), please see:

👉 **[Complete Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md)**

