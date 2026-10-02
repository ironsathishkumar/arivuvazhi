# AI Guardrails

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Input
- Authentication
- Authorization
- Rate limits
- Prompt injection resistance
- Task validation

## Retrieval
- Approved sources only for grounded exam content
- Exam/subject/topic filters
- Version control

## Output
- Schema validation
- Source support check
- Unsupported-claim detection
- Answer uniqueness check
- Length limits
- Language validation

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
