# AI Evaluation Framework

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Evaluation Dataset
Maintain a fixed dataset containing:
- factual questions
- difficult questions
- explanations
- mistake scenarios
- study-plan scenarios
- multilingual examples

## Metrics
- Factual accuracy
- Grounding
- Hallucination rate
- Answer correctness
- Explanation quality
- Structured output success
- Latency
- Cost
- Consistency

## Regression Process
Whenever a provider/model/prompt changes:
1. Run evaluation dataset.
2. Compare against baseline.
3. Review failures.
4. Approve only after acceptance criteria are met.
