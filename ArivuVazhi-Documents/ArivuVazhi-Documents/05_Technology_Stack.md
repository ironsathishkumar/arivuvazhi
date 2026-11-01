# Technology Stack

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Student Mobile
- React Native — confirmed mobile application technology; do not use Flutter.
- TypeScript throughout the mobile application.
- React Navigation.
- Reusable React Native components and a centralized design-token system for colors, typography, spacing, radius, and other shared styles. Do not hardcode colors independently across screens.
- React Query/TanStack Query for server-state and API integration where appropriate. Client state and API behavior must follow the existing backend contracts; do not introduce incompatible endpoints, payloads, or assumptions.
- Secure local storage for JWT/session material, following the existing authentication and backend contracts. Keep credentials protected and do not assume a token format, refresh flow, or session lifecycle not specified by those contracts.
- Push notification support, subject to product configuration and user preferences.
- Do not use Material UI (MUI) in the React Native application. MUI remains part of the admin portal stack.

## Admin Portal
- Next.js
- App Router
- TypeScript
- MUI
- React Hook Form
- TanStack Query where appropriate

## Backend
- Node.js
- Express.js
- TypeScript
- Mongoose
- MongoDB Atlas
- JWT
- Argon2
- Joi
- Helmet
- CORS
- Rate limiting
- Winston
- Swagger/OpenAPI
- Jest
- Supertest

## AI
- Python
- FastAPI for the AI backend.
- AI Provider abstraction
- Ollama/local models
- OpenAI
- Gemini
- Claude
- Embedding provider abstraction
- RAG/retrieval layer

The React Native client must use the existing server-side API contracts; provider access and secrets remain server-side. The AI backend choice does not replace the Node.js/Express application backend.

## Principles
Avoid Redis, S3, Kubernetes and dedicated microservices in V1 unless actual scale requires them.
