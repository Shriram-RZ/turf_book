# Turf Booking Application

A production-grade Turf Booking Application with robust concurrency control, social features, and split payments.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Java Spring Boot 3, Spring Security, Spring Data JPA
- **Database**: MySQL 8.0
- **DevOps**: Docker, Docker Compose

## Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup
```bash
cd db
# Run the schema script
mysql -u root -p < schema.sql
# (Optional) Seed data
mysql -u root -p < seeds.sql
```

### 2. Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Docker Setup (Full Stack)
```bash
docker-compose up --build
```

## Key Features
- **Concurrency Control**: Pessimistic locking to prevent double bookings.
- **Split Payments**: Invite friends and split the bill.
- **Social**: Friend system and teams.
- **Real-time**: WebSocket updates for slot availability.
