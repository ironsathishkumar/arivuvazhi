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
       +---------------+----------------+
       |               |                |
       v               v                v
   Exam Engine     Learning Engine   AI Platform
       |               |                |
       +---------------+                v
                                  AI Orchestrator
                                         |
                             +-----------+-----------+
                             |           |           |
                             v           v           v
                          Ollama      OpenAI      Gemini/Claude
                             |           |           |
                             +-----------+-----------+
                                         |
                                      RAG Layer
                                         |
                                  Approved Knowledge
                                         |
                                      MongoDB
```

## Architectural Principles
- Modular monolith initially.
- AI isolated behind provider interfaces.
- Deterministic calculations remain in backend code.
- AI is used for reasoning, explanation, generation and personalization.
- Knowledge retrieval precedes grounded AI responses.
- Student app never directly calls provider APIs.
- API keys remain server-side.
- New AI providers can be added without changing the student app.
