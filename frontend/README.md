# Terapitika Frontend 🧠

> AI-Powered Mental Health Platform - Professional Therapy Meets Cutting-Edge Technology

This is the frontend application for Terapitika, built with Next.js 14, TypeScript, and Tailwind CSS. It provides a seamless interface for clients, therapists, and administrators to interact on the platform.

## 🚀 Features

- **Guest Chat**: Instant access to AI therapy (limited) without registration.
- **Client Dashboard**: Manage sessions, profile, and settings.
- **Therapist Portal**: Dashboard for managing clients, sessions, and availability.
- **Admin Dashboard**: Comprehensive platform management and analytics.
- **Real-time Communication**: Voice, video, and text sessions using WebRTC and WebSockets.
- **Modern UI**: Built with shadcn/ui and Radix UI primitives for accessibility and aesthetics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Real-time**: [Socket.io-client](https://socket.io/docs/v4/client-api/)
- **Video/Voice**: WebRTC ([Simple-peer](https://github.com/feross/simple-peer))
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API Client**: [Axios](https://axios-http.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 📁 Project Structure

```bash
src/
├── app/                # Next.js App Router (pages and layouts)
│   ├── (auth)/         # Authentication routes (login, register)
│   ├── (dashboard)/    # Client dashboard
│   ├── (therapist)/    # Therapist portal
│   ├── (admin)/        # Admin dashboard
│   ├── chat/           # Chat interface
│   ├── therapists/     # Therapist directory
│   └── session/        # Active session pages
├── components/         # Shared and feature-specific components
│   ├── ui/             # shadcn/ui core components
│   ├── auth/           # Auth components
│   ├── chat/           # Chat components
│   └── landing/        # Landing page sections
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared instances
├── store/              # Zustand state stores
├── types/              # TypeScript interfaces and types
└── styles/             # Global CSS
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env.local` (or create it):
   ```bash
   cp .env.local.example .env.local
   ```
   *Note: Ensure `NEXT_PUBLIC_API_URL` points to your backend.*

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to check for code quality issues.

---

Built with ❤️ for better mental health access.
