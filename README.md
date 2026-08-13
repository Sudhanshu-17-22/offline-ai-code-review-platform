# 🔒 Offline AI Code Review Platform

A privacy-first, AI-powered code review platform that runs **entirely offline** using local LLMs — no code ever leaves your machine. Built for developers and organizations who can't send proprietary code to cloud AI services due to compliance or security concerns.

## 🎯 Problem Statement

Most AI code review tools (like GitHub Copilot or cloud-based linters) send your code to external servers. This is a dealbreaker for:
- Companies with strict data compliance (HIPAA, SOC2, GDPR)
- Developers working on proprietary/sensitive codebases
- Teams without reliable internet access

This platform solves that by running the entire AI review pipeline **locally** using Ollama-hosted open-source LLMs, combined with deterministic static analysis (AST parsing + ESLint rules).

## ⚙️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Monaco Editor, Zustand
**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, Socket.io
**AI Layer:** Ollama (local LLM runtime) + DeepSeek-Coder / Qwen2.5-Coder
**Static Analysis:** ESLint (rule engine), Tree-sitter (AST parsing)
**Auth:** JWT, bcrypt
**Testing:** Jest, Supertest

## ✨ Core Features

- 100% offline AI-powered code review
- Real-time streaming analysis (WebSockets)
- Static analysis: complexity, unused vars, code smells
- Monaco-based code editor (same as VS Code)
- Review history & dashboard analytics
- Severity-tagged issues with suggested fixes

## 🌐 Language Support

| Tier | Languages | Analysis Depth |
|---|---|---|
| Full Support | JavaScript, TypeScript | AI + AST + ESLint |
| AI-Only Support | Python, Java, C++, Go, SQL, HTML/CSS | AI review only |

## 📁 Project Structure

See `docs/architecture.md` for full system design details.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Ollama installed locally

### Installation

\`\`\`bash
# Clone repo
git clone <your-repo-url>
cd offline-ai-code-review-platform

# Setup backend
cd server
npm install
npm run dev

# Setup frontend (in a new terminal)
cd client
npm install
npm run dev
\`\`\`

## 📄 License
MIT

## 👤 Author
[Sudhanshu Roy]