# ArivuVazhi (அறிவுவழி) — Project Documentation

This documentation defines the current architecture and implementation plan for **ArivuVazhi (அறிவுவழி)**, an AI-first government exam preparation and training platform.

## Locked Decisions
- Student app: React Native + TypeScript
- Admin portal: Next.js App Router + TypeScript + MUI
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas + Mongoose
- AI: Hybrid local/open-source + external providers
- Local AI: Ollama-compatible architecture
- AI architecture: provider abstraction + model router + RAG + validation
- Student experience: simple and user-friendly
- Backend: modular monolith initially
- Avoid unnecessary infrastructure in V1

## Exam Program Support
The product will support TNPSC exam programs incrementally across releases. A program must have its syllabus, approved content, and exam rules configured before it is offered. This does not mean that all TNPSC programs will be available at launch.

Which programs will be offered in each release, and the program-specific syllabus, approved content, and exam rules, remain pending until confirmed and configured.

## Product Identity
- Working product name: **ArivuVazhi**
- Tamil name: **அறிவுவழி**
- Brand variant: **ArivuVazhi AI** (optional)
- Meaning: **Path of Knowledge**
- Product category: AI-powered government exam preparation and training
- Legal/trademark/domain availability: **Pending final verification**
