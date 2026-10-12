# Mock Test Engine

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Types
- Full mock
- Subject mock
- Topic mock
- Mini mock
- Previous-year mock
- AI-generated mock

## Exam Fidelity and Rules
- Mock exams should behave as closely as practical to the actual exam, using the learner’s active exam program’s configured and versioned exam rules.
- The backend is responsible for enforcing the applicable configured rules and for deterministic scoring. AI must not replace these calculations.
- Any exam-fidelity details not defined by the active program’s configuration are undecided; do not assume or invent additional exam behaviors or rules.

## Flow
Start
→ Timer
→ Answer
→ Navigation
→ Submit
→ Deterministic score
→ Analytics
→ AI interpretation
→ Recommended next training

The backend is responsible for scoring and exam rules.