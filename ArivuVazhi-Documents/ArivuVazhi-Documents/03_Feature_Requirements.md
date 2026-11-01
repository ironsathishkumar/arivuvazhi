# Feature Requirements

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform
>
> **Student-app design principle:** “Less distraction. More concentration. Better preparation.”

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

## Student Mobile-App Behavior and UX

The student application must provide a calm, modern, minimal, premium, light-first experience. Keep screens focused on a clear purpose and make the next useful action easy to identify. Avoid clutter, unnecessary banners, popups, animations, promotions, excessive gamification, and excessive or repetitive metrics. Preserve valid learning features while presenting only the information relevant to the current task.

### Welcome and onboarding

- Provide a branded welcome and concise introduction to ArivuVazhi and its benefits, with clear **Get Started** and **Login** actions.
- Guide first-time learners through the required choices and setup, including App Language, Exam/Study Language, one active exam program, target date, study availability, and initial assessment, with clear explanations.
- Keep onboarding concise and avoid unnecessary steps, but do not remove or change required choices or prescribe a specific flow that has not been decided.
- Offer only supported programs and do not imply content availability in a language unless approved content is available.

### Dashboard

- Show a personalized greeting and make the learner’s active exam program clear.
- Prioritize understandable preparation progress, today’s goal, and the next learning action, including a clear **Continue Learning** path where relevant.
- Provide quick access to Practice and Mock Tests, and accessible shortcuts to AI Tutor and Study Planner.
- Show relevant reminders where enabled and configured. Avoid presenting every feature or an excessive set of cards at once; keep the next learning activity prominent.
- Dashboard content and progress must be scoped to the learner’s active program.

### Learning

- Support discovery by active-program syllabus, subject, and topic, with topic progress and completed/pending status where data exists.
- Present approved study materials and notes in a readable way. Provide notes, bookmarks, and video resources where available.
- Respect approved content and selected Exam/Study Language availability; do not show unavailable materials as available.

### Practice

- Support subject- and topic-based MCQ practice for the active program, with Easy, Medium, Hard, and Very Hard difficulty modes. Question selection or generation must use the selected difficulty.
- Provide a focused question-and-answer experience with answer selection, question navigation, immediate feedback, explanations, and practice history where available.
- Keep explanations and practice content within approved language availability and active-program scope.

### Full and focused mocks

- Clearly distinguish **full-length exam mocks** from **subject-wise, topic-wise, or custom focused practice** before the learner starts.
- Full mocks must use the active program’s configured real-exam timing, marks, question pattern and distribution, scoring, and applicable negative marking.
- Focused mocks support practice within the active program. Their exact settings, including question counts and durations, remain unspecified unless configured.
- Provide applicable instructions, timer, question navigation, mark-for-review, and submit confirmation. While a mock is active, use a focused examination interface and hide unnecessary navigation and distracting UI.
- Present results and available analysis after submission. Scoring and exam-rule enforcement remain deterministic backend responsibilities.

### AI Tutor

- Provide an easy-to-find, simple interface accessible from the dashboard and relevant learning or practice contexts. It must remain accessible outside the primary bottom navigation; do not add it as a bottom-navigation tab.
- Support exam-preparation questions and readable, structured explanations, examples, key points, follow-up questions, and related resources where approved and available.
- Respect the active exam program, authorized learner context, selected language, and approved content availability. Ground factual exam answers in approved knowledge and clearly state limitations when supporting knowledge is unavailable.
- AI Coach access requires authentication. The student client must not call AI-provider APIs directly, and the student experience must not expose provider or model complexity.

### Performance and analytics

- Show understandable overall and subject/topic performance, strengths and areas needing practice, and test history, accuracy, and trends when relevant data exists.
- Avoid metric overload. Use clear visual indicators and plain-language explanations rather than requiring learners to interpret raw metrics.
- Provide actionable next practice or revision recommendations based on available active-program data. Backend code computes scoring and deterministic metrics; AI may explain results or suggest next steps but must not replace calculations or promise exam success.

### Study Planner

- Provide simple daily and weekly planning with study goals, schedules, subject-wise tasks, completion status, reminders where enabled, and syllabus tracking where data exists.
- Make the Planner accessible from the dashboard and relevant contextual actions, outside the primary bottom navigation. Do not add it as a bottom-navigation tab.
- Planner tasks and recommendations must use only the learner’s active program. AI-assisted planning remains subject to its existing phase and authorization requirements.

### Profile and settings

- Provide access to student profile and account settings, active exam selection/switching, App Language and Exam/Study Language preferences, theme, notification preferences, and help/support.
- Switching the active program replaces the prior program as the context for learner-facing features. Do not mix inactive-program context into active-program features.
- Do not imply language or content availability beyond approved availability.

### Primary navigation and visual direction

- Use primary bottom navigation: **Home, Learn, Practice, Progress, Profile**.
- Keep AI Tutor and Study Planner accessible through dashboard and contextual actions rather than adding bottom-navigation items.
- Finalized student-app brand palette: Midnight Navy `#101D36`, Electric Cyan `#35C6E8`, Deep Teal `#0D8EA8`, Ice Blue `#E8F8FC`, Cool Gray `#F0F4F8`, White `#FFFFFF`, and Slate `#64748B`. Semantic colors: Success `#16A36A`, Warning `#E9A23B`, Error `#DC4C4C`, Information `#2786C7`.
- Centralize reusable color tokens rather than hardcoding colors across screens. Light mode is the default; dark mode is optional. Apply color and visual emphasis selectively to retain readable contrast and a calm, focused experience.

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