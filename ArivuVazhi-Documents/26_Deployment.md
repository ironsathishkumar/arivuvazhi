# Deployment

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## V1 Principle
Use simple infrastructure. Avoid unnecessary distributed systems.

## Environments
- development
- test/staging
- production

## Components
- React Native build
- Next.js Admin
- Node.js API
- MongoDB Atlas
- AI providers
- Optional local AI server

## Local AI
Ollama/open-source models can be used for development or hosted on suitable infrastructure later.

## Production
Choose hosting based on actual traffic and AI workload. Do not introduce GPU infrastructure until usage and model requirements justify it.
