# AI Strategy

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Core Principle
AI is not the source of truth. Approved application knowledge is the source of truth.

## AI Responsibilities
- Explanation
- Question generation
- Question validation
- Mistake interpretation
- Study planning
- Revision recommendations
- Performance interpretation
- Conversational tutoring

## Non-AI Responsibilities
- Scoring
- Negative marking
- Timer
- Authentication
- Permissions
- Streak calculation
- Persistence
- Exam rule enforcement
- Deterministic analytics

## Hybrid AI Strategy
1. Local/open-source model for development and suitable low-risk tasks.
2. External models for tasks where stronger reasoning/quality is required.
3. AI router chooses provider/model per task.
4. Fallback model is configurable.
5. Important outputs can use multi-model validation.

## Quality Principle
A free model is useful only if it meets the task's accuracy and grounding requirements.
