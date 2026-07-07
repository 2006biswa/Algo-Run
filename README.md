# AlgoRun

AlgoRun is a full-stack remote code execution platform designed specifically for compiling and running C++ code securely in a cloud environment. It provides developers with an integrated web-based editor to write, execute, and track their programming submissions.

## Features

- **Remote Code Execution:** Securely compiles and executes C++ code on a backend Linux container.
- **User Authentication:** JWT-based stateless authentication with secure password hashing.
- **Execution History:** Tracks and saves historical code submissions, timestamps, and outputs per user.
- **In-Browser Editor:** Custom syntax-highlighted code editor utilizing PrismJS.
- **Concurrent Execution:** Safely handles concurrent user submissions using isolated temporary file generation and cleanup processes.

## Technology Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, child_process
- **Database:** MongoDB, Mongoose
- **Infrastructure:** Docker (Alpine Linux), Render (API), Vercel (Client)

## Architecture Overview

When a user submits code via the frontend interface, the backend Node.js server intercepts the payload and provisions isolated `.cpp` files with unique UUIDs. The server then spawns a child process utilizing the system-level `g++` compiler within the Docker container to build and execute the binary. Standard output (stdout) and standard error (stderr) are captured asynchronously and returned to the client, while all memory and temporary artifacts are immediately wiped from the disk to preserve statelessness.

## Local Development Setup

### Prerequisites
- Node.js (v20 or higher)
- MongoDB account (Atlas or local instance)
- g++ compiler installed on your local machine (if testing the execution engine locally outside of Docker)

### Installation

1. Clone the repository
```bash
git clone https://github.com/2006biswa/Algo-Run.git
cd Algo-Run
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

Start the backend server:
```bash
cd backend
node server.js
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment

The application is containerized using Docker to ensure the `g++` compilation environment is consistent in production. 
- The backend is configured to be deployed as a Docker Web Service on Render.
- The frontend is configured for deployment on Vercel.
