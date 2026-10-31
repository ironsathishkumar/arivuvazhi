# Feature Requirements

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Scope and Status

- Support TNPSC exam programs incrementally across releases; do not imply that every program is available at launch.
- Each learner has exactly one active exam program at a time and may switch to another supported program.
- All learner-facing study features must use only the learner’s current active program. This includes plans, practice and difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context. Switching programs replaces the prior program as the active context.
- **Pending decision:** Whether and how to retain progress for inactive programs has not been confirmed. If progress is retained, it must remain separate from active-program progress.
- Exam content and AI responses must respect the learner’s selected Exam/Study Language and the availability of approved content in that language. Do not imply content is available in a language when it is not approved or available.

## MVP

- Authentication and role-based access.
- Exam configuration for supported TNPSC programs, introduced incrementally, including program-specific syllabus and exam rules.
- Subject and topic management for configured programs.
- Question bank and question lifecycle management, including review of AI-generated questions before approval or publication.
- Practice sessions for the learner’s active program, with four difficulty modes: **Easy, Medium, Hard, and Very Hard**. Question selection or generation must use the selected mode.
- Full mock tests configured for the active program. They must follow that program’s configured timing, marks, question pattern and distribution, scoring, and applicable negative marking, and must resemble the real exam as closely as practical.
- Short subject-wise and topic-wise mocks for focused practice, scoped to the learner’s active program. These are distinct from full mocks; exact settings such as question counts and durations are not specified.
- Deterministic backend scoring and enforcement of the active program’s configured exam rules, including applicable negative marking. AI must not replace these calculations.
- Mistake book and revision scheduling for the active program.
- Student dashboard with understandable preparation progress and insights for the active program.
- Initial assessment and study plan for the active program, subject to approved content availability where relevant. Student setup and configuration should be streamlined by reducing unnecessary steps while preserving required choices and setup; no specific flow changes are defined.
- Authenticated AI Coach, limited to exam-preparation support. It must use only the active program and authorized learner context, ground factual exam answers in approved knowledge, respect approved language availability, and make limitations clear when supporting knowledge is unavailable. Provider access and secrets remain server-side; student clients must not call AI-provider APIs directly.
- RAG knowledge base over approved content, with retrieval constrained by the active program, tenant, approval status, and language where applicable.
- AI question generation with validation and admin review before approval or publication.
- Mock-test analysis, when the relevant data exists, covering score and correct/wrong/unanswered responses; subject- and topic-level performance; recurring mistakes; time management; and suggested next practice or revision steps. Backend code computes scoring and deterministic metrics; AI may explain results and suggest next steps but must not replace those calculations or promise exam success.
- Admin portal capabilities to manage tenant-scoped exam programs, subjects, topics, exam patterns and rules; questions; approved knowledge and metadata; mock tests and their program-specific configuration; student feedback workflows; authorized student performance and analytics; AI providers, models, prompts and task routing; roles and permissions; and relevant audit logs.
- Tenant isolation enforced in backend authorization, data access, and AI knowledge retrieval—not only through client-side filtering. Admin access must be limited to authorized tenants and resources.
- Optional student feedback about the app, content, explanations, or suggestions. Provide a dedicated, easy-to-find area in the student application that learners can open to submit feedback.
- AI configuration, usage and audit logging, with evaluation and cost tracking as required by the AI platform design.

## Phase 2

- Adaptive learning and advanced mistake classification for the active program.
- AI-assisted daily planning and recommendations, using only the active program and authorized learner context.
- Additional progress metrics and advanced analytics, presented in understandable terms and based on available data.
- Current affairs, notifications, or reminders only where approved sources/content and product configuration support them.

## Phase 3 / Future Consideration

- Voice tutor.
- Multi-model collective validation.
- Support for additional exam families beyond the incremental TNPSC program scope.
- Advanced offline support.
- Mentor features.

These are future considerations, not confirmed availability or launch commitments.

## Pending and Unverified

- **Inactive-program progress retention:** Whether and how to retain progress after a learner switches programs is undecided. Any retained progress must remain separate from active-program progress.
- **Competitor findings:** Superprep, Testbook, and Adda247 are a review shortlist only. Their specific features, current availability, and comparative findings remain unverified until researched; do not treat them as established product requirements or facts.
- **Content and language availability:** Availability depends on approved content. Do not promise a language or content coverage before it is confirmed.
- **Setup and mock details:** Setup should be streamlined only by reducing unnecessary steps while preserving required choices; specific flow changes are undecided. Full mocks follow the active program’s configured rules and resemble the real exam. Exact settings for short subject-wise or topic-wise mocks, such as question counts and durations, are unspecified.
- **Feedback area details:** Placement, presentation, and submission flow for the dedicated feedback area are undecided beyond being easy to find and usable for optional feedback submission.

## Functional Priority

- **P0:** Required for the first usable product.
- **P1:** Important after the MVP.
- **P2:** Future enhancement.

These priority labels do not confirm that a feature is available or that its detailed scope has been finalized; pending decisions and content availability remain subject to confirmation.