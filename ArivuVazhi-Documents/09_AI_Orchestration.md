# AI Orchestration

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Orchestration Flow
1. Receive task.
2. Authenticate user.
3. Authorize knowledge access.
4. Determine task type.
5. Retrieve required learning context.
6. Retrieve approved knowledge.
7. Build prompt/context.
8. Select model.
9. Execute generation.
10. Parse structured output.
11. Validate.
12. Retry/fallback if required.
13. Store audit record.
14. Return final response.

## Fallback
Example:
Primary local model
→ fallback external model
→ failure response if both unavailable.

## Cost Guard
Before execution:
- Check user limits.
- Check global limits.
- Check task cost policy.
- Reject or downgrade expensive requests when necessary.
