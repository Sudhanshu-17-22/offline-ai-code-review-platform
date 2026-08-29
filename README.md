# 🔒 Offline AI Code Review Platform

![CI/CD](https://github.com/Sudhanshu-17-22/offline-ai-code-review-platform/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

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

# Docker Setup
Development
docker compose up --build
Production Simulation
docker compose -f docker-compose.prod.yml up --build

The development Docker setup includes MongoDB and connects to Ollama running on the host machine.

# Environment Variables
Backend

Copy server/.env.example to server/.env and configure the required values.

Frontend

Copy client/.env.example to client/.env.local and configure the required values.

Environment files containing secrets should not be committed to Git.

# Deployment
Live Demo
Frontend: https://your-app.vercel.app
Backend: https://your-app.onrender.com

Note: The live demo runs in "Demo Mode" because Ollama requires local compute resources that free cloud tiers don't provide. For the full offline AI experience with real local LLM inference, please run locally following the instructions above.

Run Locally (Full AI Features)

For real AI-powered code reviews, install Ollama locally and run the configured model:

ollama run qwen2.5-coder:7b

Then start the backend and frontend using the installation instructions above.

# Ollama / Demo Mode

The cloud deployment can use Demo Mode to provide mock AI responses when Ollama is unavailable.

For the complete privacy-first experience, run the application locally with Ollama. In local mode, code is processed by the local LLM and does not need to be sent to a cloud AI provider.

# CI/CD

GitHub Actions runs the backend and frontend tests and builds on pushes and pull requests targeting main.

After successful checks on main, the backend deployment can be triggered through the configured Render deployment hook.

Vercel can automatically deploy the frontend when changes are pushed to the connected GitHub repository.

## Testing

This project maintains >70% code coverage with comprehensive unit and integration tests.

```bash
# Run all tests
npm run test:all

# Run with coverage
npm run coverage:all

## 📄 License
MIT

## 👤 Author
[Sudhanshu Roy]