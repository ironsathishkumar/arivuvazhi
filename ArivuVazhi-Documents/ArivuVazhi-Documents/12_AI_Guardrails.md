# AI Guardrails

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Input
- AI Coach use requires authentication.
- Limit AI Coach use to exam-preparation support.
- Authorize each request for the specific tenant and learner. Use only learning context that learner is permitted to access.
- Use only the learner's current active exam program as AI Coach context. Do not mix in inactive-program content.
- Respect the learner's selected Exam/Study Language and the availability of approved content in that language.
- Rate limits
- Prompt injection resistance
- Task validation

## Retrieval
- Approved sources only for grounded exam content
- Filter by tenant and the learner's active exam program, and apply relevant subject/topic filters.
- Filter by language where applicable; use only approved, available content in the selected Exam/Study Language. Do not imply unavailable content exists.
- Version control

## Output
- Schema validation
- Source support check
- Unsupported-claim detection
- Answer uniqueness check
- Length limits
- Language validation; respect the selected Exam/Study Language and approved content availability.
- Keep AI-provider access and secrets server-side. Student clients must not call AI-provider APIs directly.

## Human-in-the-Loop
AI-generated questions should enter review before becoming trusted production content unless a separately approved automated policy exists.

## Audit
Store:
- request ID
- user ID
- task
- provider/model
- prompt version
- retrieved knowledge IDs
- response
- validation result
- latency
- token usage
- estimated cost
