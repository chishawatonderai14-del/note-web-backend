# 📝 Note Web Backend

An event-driven backend system for managing notes, built with Node.js, PostgreSQL, and Apache Kafka. This project demonstrates REST API design, asynchronous processing, and scalable backend architecture.

---

## 🚀 Features

- RESTful API for note management
- JWT-based authentication (in progress / optional if not done yet)
- Event-driven architecture using Apache Kafka
- Asynchronous processing for activity logging and system events
- Clean backend structure (controllers, services, routes)
- Dockerised environment for local development

---

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Apache Kafka
- Docker

---

## 🧠 Architecture Overview

This project follows a layered backend architecture:

- **Controllers** → Handle HTTP requests
- **Services** → Business logic
- **Routes** → API endpoints
- **Prisma** → Database interaction

Kafka is used to:
- Publish domain events (e.g. NOTE_CREATED)
- Enable asynchronous processing through consumers

---

## 📡 Example Workflow

1. User creates a note via API
2. Backend saves the note to PostgreSQL
3. A `NOTE_CREATED` event is published to Kafka
4. Consumer services process the event (e.g. logging, analytics)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/chishawatonderai14-del/note-web-backend.git
cd note-web-backend

2. Install dependencies
npm install


3. Setup environment variables

Create a .env file:
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
KAFKA_BROKER=localhost:9092


4. Run with Docker

docker-compose up --build\

5. Run locally (without Docker)

npm run dev


📂 Project Structure
src/
  controllers/
  services/
  routes/
  utils/
  prisma/

Dockerfile
docker-compose.yml

📌 Current Status
🚧 Project is actively being developed
Planned improvements:
Complete authentication flow
Add validation middleware
Improve error handling
Add tests