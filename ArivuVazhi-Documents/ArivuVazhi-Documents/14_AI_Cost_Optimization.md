# AI Cost Optimization

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Principles
- Do not use AI for deterministic calculations.
- Use local models where quality is sufficient.
- Route simple tasks to inexpensive models.
- Cache reusable outputs.
- Limit context size.
- Retrieve only relevant RAG chunks.
- Track token usage.
- Set per-user and global limits.
- Use multi-model validation only for important tasks.

## Admin Metrics
- Requests/day
- Requests/month
- Tokens
- Estimated cost
- Cost/user
- Cost/feature
- Cost/model
- Error rate
- Average latency
