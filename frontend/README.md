# TurfBook Frontend

A modern, production-grade frontend for the TurfBook platform, built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **User Role Management**: Distinct dashboards for Users, Turf Owners, and Admins.
- **Booking Flow**: Seamless slot selection, participant management, and split payments.
- **Interactive UI**: Premium design with smooth transitions, loading states, and responsive layouts.
- **Real-time Updates**: Polling for slot availability and booking status.
- **QR Integration**: QR code generation for bookings and scanning for owner verification.
- **Analytics**: Visual charts for revenue and occupancy tracking.

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) + clsx + tailwind-merge
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **QR**: qrcode.react, html5-qrcode

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and update the values if necessary.
    ```bash
    cp .env.example .env
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Directory Structure

- `src/components`: Reusable UI components (atomic, cards, loaders, charts).
- `src/pages`: Application pages grouped by feature (Auth, Home, Turfs, Booking, Dashboard, Owner, Admin).
- `src/context`: Global state stores (Auth).
- `src/services`: API integration and query client configuration.
- `src/layouts`: Layout wrappers (Main, Auth, Dashboard).
- `src/router`: Route definitions and protected route logic.
- `src/types`: TypeScript interfaces.

## Key Components

- **TurfCard**: Displays turf details with image, rating, and amenities.
- **SlotGrid**: Interactive grid for selecting booking slots.
- **BookingConfirmation**: Multi-step wizard for finalizing bookings.
- **RevenueLineChart**: Visualizes earnings over time.
- **QRScanner**: Camera interface for verifying booking QR codes.
