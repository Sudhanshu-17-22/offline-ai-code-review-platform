# System Architecture — Offline AI Code Review Platform

## 1. High-Level Overview

The system is a full-stack monorepo application with three major layers:

1. **Client Layer** (Next.js) — handles UI, code input, and result visualization
2. **Server Layer** (Express + Node.js) — handles business logic, auth, orchestration
3. **AI/Analysis Layer** — split into two engines:
   - LLM Engine (Ollama, local) — semantic/logical code review
   - Static Analysis Engine (ESLint + Tree-sitter) — deterministic rule-based checks

## 2. Request Flow (Code Review Pipeline)

\`\`\`
User submits code (paste/upload)
        ↓
Frontend sends code to backend via REST API
        ↓
Backend saves initial review record in MongoDB (status: "processing")
        ↓
Backend runs Static Analysis Engine (AST parse + ESLint rules)
        ↓
Backend sends code + prompt to local Ollama LLM
        ↓
LLM streams response back via Socket.io → Frontend shows live typing effect
        ↓
Backend merges static analysis + AI response → saves final result in MongoDB
        ↓
Frontend renders full review: issues, severity, suggested fixes
\`\`\`

## 3. Database Schema (Simplified)

### User
- id, name, email, password (hashed), createdAt

### Review
- id, userId, code, language, staticAnalysisResults, aiReviewResults, status, createdAt

### Project (optional, for multi-file reviews)
- id, userId, name, files[], createdAt

## 4. Why Offline AI?

Cloud AI code review tools require sending source code to third-party servers. This is unacceptable for:
- Regulated industries (finance, healthcare, defense)
- Companies with strict IP protection policies

By using Ollama to run open-source LLMs (DeepSeek-Coder/Qwen2.5-Coder) **locally**, no code ever leaves the user's machine — solving a genuine enterprise pain point.

## 5. Scoping Decision: Language Support Tiers

Building custom AST parsers and lint rules for every language is not feasible for a single-developer project in a limited timeframe. So:

- **Tier 1 (Full Support):** JavaScript & TypeScript — get AST parsing (Tree-sitter) + ESLint rule checking + AI review
- **Tier 2 (AI-Only):** Python, Java, C++, Go, SQL, HTML/CSS — reviewed by the LLM directly, since these models are multi-lingual by training, but without custom static analysis

This is a deliberate trade-off favoring **reliability over false breadth**.

## 6. Key Non-Functional Requirements

- **Privacy:** No code transmitted to external/third-party servers
- **Performance:** Streaming responses to avoid perceived lag during LLM inference
- **Scalability (future):** Queue-based processing (Bull/Redis) if scaled beyond single-user local use
- **Security:** JWT auth, bcrypt password hashing, input validation via Zod