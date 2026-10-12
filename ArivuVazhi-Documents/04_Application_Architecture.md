# Application Architecture

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

```text
                         Student
                            |
                    React Native App
                            |
                            v
                    Node/Express API
                            |
             Authentication and authorization
             Tenant and learner access checks
                            |
       +--------------------+--------------------+
       |                    |                    |
       v                    v                    v
   Exam Engine        Learning Services       AI Platform
       |                    |                    |
       |                    |              AI Orchestrator
       |                    |                    |
       +--------------------+          +---------+---------+
                                       |                   |
                                       v                   v
                                 Model Router       RAG / Approved
                                       |              Knowledge
                          +------------+------------+        |
                          |            |            |         |
                          v            v            v         v
                       Ollama        OpenAI     Gemini/Claude MongoDB
```

## Architectural Principles
- Use a modular monolith initially.
- Support TNPSC exam programs incrementally across releases. Each learner has exactly one active exam program at a time.
- Enforce tenant isolation and authenticated learner authorization across APIs, backend services, data access, and AI knowledge retrieval. Client-side filtering alone is not sufficient.
- Scope learner-facing services—including plans, practice, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context—to the learner's current active program. Do not mix inactive-program content into these features.
- Enforce the active program's configured syllabus, scoring, negative marking, and other exam rules in backend code. Backend code also performs deterministic scoring and metrics; AI may explain results but must not replace these calculations.
- Keep AI isolated behind provider interfaces. The backend orchestrates provider access; the student app must not call AI-provider APIs directly. Provider credentials and secrets remain server-side.
- Use approved knowledge to ground factual AI responses. Content and AI outputs must respect approved content and its available language; do not imply that content is available in a language unless it is approved and available.
- Use AI for reasoning, explanation, generation, and personalization within authorized context and approved-knowledge limits. Make limitations clear when supporting approved knowledge is unavailable.
- New AI providers can be added without changing the student app.
- Inactive-program progress retention is undecided; this architecture does not define whether or how that progress is retained.
