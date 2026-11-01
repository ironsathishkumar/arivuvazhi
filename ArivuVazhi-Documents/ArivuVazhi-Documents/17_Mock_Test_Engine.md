# Mock Test Engine

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Types
- **Full mock:** A real-exam-like test that follows the learner’s active exam program’s configured rules.
- **Subject mock:** Focused practice scoped to a subject in the learner’s active exam program.
- **Topic mock:** Focused practice scoped to a topic in the learner’s active exam program.
- Mini mock
- Previous-year mock
- AI-generated mock

## Exam Fidelity and Rules
- Full mocks should resemble the actual exam as closely as practical and follow the learner’s active exam program’s configured and versioned rules. This includes configured timing, marks, question pattern and distribution, scoring, and applicable negative marking.
- Subject-wise and topic-wise short mocks are focused practice scoped to the learner’s active exam program. They are not full-exam simulations.
- Do not prescribe exact question counts, durations, or other settings for subject-wise or topic-wise short mocks unless configured for the active program.
- The backend is responsible for enforcing applicable configured rules and deterministic scoring. AI must not replace these calculations.
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