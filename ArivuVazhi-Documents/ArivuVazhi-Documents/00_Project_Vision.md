# ArivuVazhi (அறிவுவழி) — Project Vision

## 1. Vision
Build **ArivuVazhi (அறிவுவழி)**, a simple, user-friendly AI-powered government exam preparation platform that acts as a personal exam training coach.

The platform should continuously understand the student's preparation state, identify weak areas, provide targeted practice, explain mistakes, schedule revision, conduct mock tests, and provide evidence-based preparation insights.

**Product philosophy:**

> **Less distraction. More concentration. Better preparation.**

The student experience should be calm, modern, minimal, premium, light-first, and focused on helping learners understand their next useful action. Reduce clutter and avoid unnecessary banners, popups, animations, gamification, promotions, and excessive metrics while retaining the platform’s valid learning and preparation features.

## 2. Product Identity
**ArivuVazhi (அறிவுவழி)** means “Path of Knowledge” and is the product name for this application.

> Brand: **ArivuVazhi**  
> Tagline: **LEARN • PRACTICE • ANALYZE • ACHIEVE**  
> Brand personality: **Intelligent, trustworthy, modern, professional, calm, student-friendly, and motivational.**  
> Legal/trademark/domain availability: **Pending final verification**

### Mobile brand direction
The approved mobile brand palette is:

| Color | Hex | Purpose |
|---|---|---|
| Midnight Navy | `#101D36` | Primary brand color |
| Electric Cyan | `#35C6E8` | Primary accent |
| Deep Teal | `#0D8EA8` | Secondary accent |
| Ice Blue | `#E8F8FC` | Highlight backgrounds |
| Cool Gray | `#F0F4F8` | Application background |
| White | `#FFFFFF` | Cards and surfaces |
| Slate | `#64748B` | Secondary text |

Semantic colors: Success `#16A36A`, Warning `#E9A23B`, Error `#DC4C4C`, and Information `#2786C7`.

Centralize these colors as reusable mobile design tokens rather than hardcoding them across screens. Light mode is the default mobile theme; dark mode is optional. Use this brand direction for the student mobile experience. It does not extend the redesign scope to the admin portal. The precise implementation and presentation should follow the existing mobile specifications and preserve valid product requirements.

## 3. Product Principle
**Our application owns the exam knowledge and learning logic. AI models provide reasoning, generation, explanation, and personalization.**

AI responses must be grounded in approved knowledge whenever the task depends on factual exam content.

## 4. Applications
- Admin Portal: Next.js + TypeScript + MUI
- Student Mobile App: React Native + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas + Mongoose
- AI Platform: Hybrid local/open-source models + external AI providers

## 5. Primary Goals
- Improve exam preparation quality
- Improve confidence through measurable progress
- Reduce manual study planning
- Identify and remediate weak topics
- Provide grounded AI tutoring
- Support multiple AI providers without vendor lock-in
- Keep the student experience simple

## 6. Non-Goals for V1
- Social network/community
- Payments/subscriptions
- Complex mentor marketplace
- Large-scale multi-tenant enterprise features
- Voice-first experience
- Fully autonomous content publishing

## 7. Success Criteria
- Student can complete an assessment and receive a training plan.
- Student can practice, take mocks, review mistakes, and revise.
- AI tutor answers using approved knowledge.
- Admin can control exams, content, knowledge, and AI configuration.
- AI quality, usage, latency, and cost are measurable.
