# User Journey

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Student Journey
Registration
→ Choose App Language and Exam/Study Language
→ Select one active supported TNPSC program
→ Set Goal
→ Initial Assessment for the active program
→ Learning Profile for the active program
→ Personalized Plan for the active program
→ Practice using a selected difficulty mode (Easy, Medium, Hard, or Very Hard)
→ Immediate Result
→ Mistake Analysis
→ Revision for the active program
→ Mock Exam configured for the active program and designed to resemble the actual exam as closely as practical, following that program’s configured exam rules
→ Performance Analysis for the active program
→ Updated Plan for the active program
→ Repeat

The student experience should reduce unnecessary setup and configuration while retaining the approved journey steps and preferences above. Which steps, if any, can be skipped, combined, deferred, or otherwise simplified is undecided; do not assume specific changes to the steps.

Provide a dedicated, easy-to-find feedback area that a student can open to optionally submit feedback about the app, content, explanations, or suggestions. Its placement, interaction details, and submission workflow are undecided.

The learner may change App Language or Exam/Study Language in settings and may switch to another supported TNPSC program later. At any time, the learner has exactly one active program. All learner-facing plans, practice, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context must use only the current active program; content from inactive programs must not be mixed into those features. Content and AI responses must respect the selected Exam/Study Language and the availability of approved content in that language. Do not imply that content is available in a language unless it is approved and available.

**Pending decision:** Whether and how to retain a learner's progress for inactive programs has not been confirmed. If retained, it must remain separate from active-program progress.

**Undecided:** Further details of the student setup flow and mock-exam experience, beyond following active-program configured rules and resembling the actual exam as closely as practical, have not been specified.

## AI Tutor Journey
Student asks question
→ Intent detection
→ Permission/context check
→ Knowledge retrieval
→ Context construction
→ Model routing
→ AI response
→ Grounding/format validation
→ Final response
→ Audit log

## AI Question Journey
Task configuration
→ Retrieve approved knowledge
→ Generate question
→ Validate factual support
→ Validate answer uniqueness
→ Duplicate check
→ Difficulty check
→ Admin review
→ Approve/publish

## Admin Knowledge Journey
Upload document
→ Extract
→ Clean
→ Chunk
→ Add metadata
→ Embed/index
→ Quality check
→ Publish knowledge version