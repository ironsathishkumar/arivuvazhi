# Student Mobile App

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Stack
React Native + TypeScript

## UI Direction
- Design mobile-first screens to feel clean, stylish, approachable, and understandable to students who are unfamiliar with the app.
- **Proposed, not finalized, palette:** deep navy/indigo as the primary color; warm saffron used selectively for key actions or highlights; light cream/off-white backgrounds; and readable dark text.
- Use simple navigation and a clear screen hierarchy. Where practical, give each screen one primary task and make the next action easy to recognize.
- Use familiar labels and clear explanations; do not assume students already understand the app's features or exam-preparation terminology.

## Main Navigation
- Home
- Practice
- Mock
- AI Coach
- Student Feedback
- Profile

Student Feedback must be a dedicated, easy-to-find area that students can open to submit optional feedback.

## First-time Experience
- Guide new students through the app with clear explanations of choices and what to expect.
- Retain required setup choices, including App Language, Exam/Study Language, active exam program, and the applicable goal and study setup.
- Avoid unnecessary steps while preserving those required choices. Which specific steps or settings, if any, should be skipped, combined, deferred, or changed remains undecided; do not assume particular removals.

## Home
Answer the question, “What should I do today?” Show:
- today's plan
- the next action
- preparation progress
- streak
- revision due

Practice and learner-facing study features must use only the learner's active exam program. The learner must be able to reach useful study actions without unnecessary configuration steps. The specific setup steps or settings to simplify or remove are undecided.

## Practice
- topic selection
- adaptive practice
- immediate answer feedback
- explanation
- bookmark/report

Practice and learner-facing study features must use only the learner's active exam program. The learner must be able to reach useful study actions without unnecessary configuration steps. The specific setup steps or settings to simplify or remove are undecided.

## Mock
Present two clearly distinguished mock options, with separate labels and flows:
- **Full Exam Mock:** A full mock that resembles the real exam and follows the active program's configured timing, marks, question pattern and distribution, scoring, and applicable negative marking.
- **Short Subject/Topic Mock:** A focused mock for a selected subject or topic within the learner's active exam program. Exact short-mock settings remain undecided.

Mock screens and flows should resemble the actual exam as closely as practical. Specific mock UI and exam details not established here remain undecided.

## AI Coach
Conversational interface for:
- explanations
- study planning
- mistake analysis
- revision
- exam-related questions

The AI Coach is for authenticated students and must use only the active exam program and authorized learning context. It must not expose AI model or provider complexity.

## Student Feedback
Provide a dedicated, easy-to-find area that students can open and use to submit optional feedback about the app, content, explanations, or suggestions.

## UX Rule
The student should not need to understand AI models, providers, RAG or routing.

Make the student experience easy to navigate and avoid unnecessary configuration steps. Which existing settings or steps should be removed or changed is undecided; do not assume particular settings or steps should be removed.