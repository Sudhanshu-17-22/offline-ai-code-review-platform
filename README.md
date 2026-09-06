# Offline AI Code Review Platform
A privacy-first code review platform that analyzes code locally using AI and static analysis — without sending source code to external AI services.**


## Why This Project?
Most AI code review tools require developers to send their source code to third-party cloud services. That can be a problem when working with private repositories, proprietary code, or sensitive projects.
I built this platform to solve that problem by combining **local AI-powered code review with static analysis**, allowing developers to review code while keeping their source code on their own machine.


## Features
* 🤖 **Offline AI Code Review** — powered by Ollama
* 🔍 **Static Analysis** — detects common code issues
* 🌳 **AST-based Analysis** — deeper structural code inspection
* ⚡ **Real-time Streaming** — review results streamed using Socket.io
* 📝 **Monaco Code Editor** — write and review code directly in the browser
* 📊 **Analytics Dashboard** — track scores, languages, and review trends
* 📚 **Review History** — search and filter previous reviews
* 🔐 **JWT Authentication** — secure user authentication
* 🐳 **Docker Support** — containerized frontend and backend


## Tech Stack
** Frontend **
- Next.js 
- React 
- TypeScript 
- Tailwind CSS 
- Monaco Editor 
- Zustand 
- Recharts

** Backend **
- Node.js 
- Express.js 
- TypeScript
- Socket.io 
- JWT
- Zod

** AI & Code Analysis **
- Ollama 
- Qwen2.5-Coder 
- Tree-sitter 
- AST-based Static Analysis

** Database & Testing **
- MongoDB 
- Mongoose 
- Jest 
- Supertest

** DevOps & Tools **
- Docker 
- Docker Compose 
- Git 
- GitHub 
- VS Code


## Architecture
Browser
   │
   ▼
Next.js Frontend
   │
   ▼
Express API ───────► MongoDB
   │
   ├───────────────► Static Analysis
   │
   └───────────────► Ollama
                         │
                         ▼
                    Local AI Model
                         │
                         ▼
                  Review + Analysis
                         │
                         ▼
                   Socket.io Stream

The application keeps the AI processing local through Ollama, reducing dependency on external AI APIs and keeping source code within the local environment.


## Getting Started
* Prerequisites *
- Node.js
- MongoDB
- Ollama
- Git


### Clone
git clone https://github.com/your-username/offline-ai-code-review-platform.git
cd offline-ai-code-review-platform


### Install dependencies
cd server
npm install

cd ../client
npm install


### Configure environment variables
Create `.env` files using the environment variables required by the server and client configuration.


### Start Ollama
* Pull the required mode *
- ollama pull qwen2.5-coder:7b


### Run the application
Start the backend:
cd server
npm run dev

Start the frontend in another terminal:
cd client
npm run dev

Open:
http://localhost:3000


## Project Structure
offline-ai-code-review-platform/
├── client/          # Next.js frontend
├── server/          # Express backend
├── docs/             # Project documentation
├── docker-compose.yml
└── README.md


## What I Learned

Building this project helped me work through real full-stack problems rather than only implementing individual features. I worked with authentication, API design, MongoDB, local LLM integration, AST-based analysis, real-time streaming, testing, Docker, and frontend state management.
The main takeaway was learning how to **break a problem into smaller systems, debug them independently, and integrate them into one working application.**


## Future Improvements
- Support additional local AI models
- Improve static analysis rules
- Add pull-request integration
- Add more programming language support
- Improve review performance for large codebases


## License
This project is licensed under the MIT License.


## Connect
** Sudhanshu Roy **
- LinkedIn: [https://www.linkedin.com/in/sudhanshu-roy-1492682b1]
- GitHub: [https://github.com/Sudhanshu-17-22]