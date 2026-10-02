# AI Architecture

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

```text
Request
  |
  v
AI Gateway
  |
  v
Intent/Task Classifier
  |
  v
Context Builder
  |
  +--> Student Learning Context
  +--> Exam Context
  +--> Retrieved Knowledge
  |
  v
Model Router
  |
  +--> Ollama
  +--> OpenAI
  +--> Gemini
  +--> Claude
  |
  v
Response Parser
  |
  v
Validator / Guardrails
  |
  v
Final Response
```

## AI Provider Interface
All providers should implement a common contract:
- generate
- generateStructured
- stream
- embed
- healthCheck

## Provider Configuration
- provider
- model
- task
- enabled
- priority
- fallback
- max tokens
- temperature
- cost metadata
