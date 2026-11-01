# AI Model Strategy

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Provider Types
### Local
- Ollama
- Open-source models

### External
- OpenAI
- Gemini
- Claude
- Additional providers later

## Task Routing
| Task | Default strategy |
|---|---|
| Simple explanation | Local/low-cost model |
| Question generation | Local or low-cost model |
| Question validation | Strong model or multi-model |
| Study planning | Reasoning-capable model |
| Complex analysis | Strong model |
| High-risk factual validation | Multi-model + source validation |

## Important
Model names are configuration, not business logic. Models change over time; the application must allow replacement without code changes.

## Evaluation Before Selection
Measure:
- Factual accuracy
- Grounding
- Hallucination
- Structured output success
- Language quality
- Latency
- Cost
- Resource usage
