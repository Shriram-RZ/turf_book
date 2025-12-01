# Turf Booking Application Walkthrough

## Overview
This is a production-grade Turf Booking Application built with:
- **Backend**: Java Spring Boot (MySQL, JPA, WebSocket, Security)
- **Frontend**: React + Vite (TypeScript, Tailwind CSS)
- **Database**: MySQL 8.0+

## Features
- **User Auth**: Register, Login (JWT)
- **Turf Management**: View Turfs, Slots, Amenities
- **Booking System**:
    - Real-time Slot Updates (WebSocket)
    - Concurrency Control (Pessimistic Locking)
    - Split Payments (Draft Logic)
    - Booking History
- **Social Features**:
    - Friend Requests & List
    - Team Creation & Management
- **Dashboards**:
    - User Dashboard: Manage bookings, friends, teams.
    - Owner Dashboard: QR Scanner (Mock), Slot Management.

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local dev)
- Node.js 18+ (for local dev)

### Running with Docker
1.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
2.  **Access Application**:
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8080`

### Verification Steps

#### 1. Concurrency Test
Run the provided script to simulate concurrent bookings:
```bash
./concurrency_test.sh
```
Check logs to ensure only one booking succeeds per slot.

#### 2. Real-time Updates
1.  Open two browser windows.
2.  Login as User A in Window 1 and User B in Window 2.
3.  User A books a slot.
4.  Verify that the slot turns RED (Locked/Booked) in Window 2 immediately.

#### 3. Social & Split Payment
1.  **Friend Request**: User A invites User B (via email). User B accepts in Dashboard.
2.  **Team**: User A creates a team.
3.  **Booking**: User A initiates a booking. (Split payment logic adds participants, currently defaults to equal split).
4.  **Payment**: Mock payment webhook can be triggered via Postman to `http://localhost:8080/api/payments/webhook`.

#### 4. QR Check-in
1.  Go to User Dashboard -> Booking History.
2.  Note the `qrSecret` (in real app, this would be a QR code image).
3.  Go to Owner Dashboard (`/owner`).
4.  Enter the secret to simulate scanning.
5.  Verify status updates to `COMPLETED`.
