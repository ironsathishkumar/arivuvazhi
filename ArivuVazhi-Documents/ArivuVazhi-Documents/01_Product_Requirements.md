# Product Requirements

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform
>
> **Brand tagline:** LEARN • PRACTICE • ANALYZE • ACHIEVE
>
> **Student-app philosophy:** “Less distraction. More concentration. Better preparation.”

## 1. Product Scope and Status

ArivuVazhi will support all TNPSC exam programs, introducing programs incrementally across releases. Each learner has exactly one active exam program at a time and may switch to another supported program.

All learner-facing study plans, practice questions, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context must use only that learner's current active program. Inactive-program context must not be mixed into active-program features.

For example, if User A switches from Group 4 to Group 2, Group 2 alone becomes User A's active program and the context for those learner-facing features. If User B switches from Group 1 to Group 4, Group 4 alone becomes User B's active program and context. In each case, the newly selected program replaces the previous one as the active context.

**Pending decision:** Whether and how to retain a learner's progress for inactive programs has not been confirmed. If retained, it must remain separate from active-program progress.

## 2. User Roles
- Super Admin
- Admin
- Content Manager
- AI Manager
- Student

## 3. Student Requirements

### Account, program, and language
1. Register and log in.
2. At first login, choose an App Language and an Exam/Study Language. Both preferences can later be changed in settings.
3. Select one active TNPSC exam program. The learner may switch to another supported program; all learner-facing study features must use only the currently active program.
4. Set a target date and study availability for the active program.
5. Complete an initial assessment for the active program.
6. Exam content and AI responses must respect the selected Exam/Study Language and the availability of approved content in that language. Do not imply that content is available in a language when it is not approved or available.

### Learning loop
7. View a personalized daily plan and a clear next action for the active program.
8. Set up practice using one of four difficulty modes: Easy, Medium, Hard, or Very Hard. Question selection or generation must use the selected difficulty. The active TNPSC program's configuration governs syllabus, scoring, negative marking, and other exam rules.
9. Practice questions and receive immediate feedback and explanations.
10. Take full mock exams that resemble the real exam and follow the active TNPSC program's configured rules, explicitly including timing, marks, question pattern and distribution, scoring, and applicable negative marking. Also take short subject-wise or topic-wise mocks for focused practice, scoped to the active program. Review results and performance analysis. The exact settings for short mocks, such as question counts or durations, are undecided.
11. Review mistakes and explanations, maintain a mistake book, and complete scheduled revisions for the active program.
12. View understandable progress insights and preparation metrics for the active program.
13. Receive notifications or reminders where enabled.
14. Open a dedicated, easy-to-find feedback area to submit feedback about the app, content, explanations, or suggestions. Submission is optional. **Pending decision:** Feedback handling details have not been defined.

### AI Coach
15. Use the AI Coach only when authenticated. It is limited to exam-preparation support.
16. The Coach must use the learner's active program and authorized learning context. It must not mix in other exam-program content or unauthorized learner data. When the learner switches programs, the newly selected program alone becomes the active Coach context.
17. Factual exam answers must be grounded in approved knowledge. The Coach must avoid unsupported claims and make limitations clear when approved supporting knowledge is unavailable.
18. The student client must not call AI-provider APIs directly. Provider access and secrets remain server-side; the student experience must not expose provider or model complexity.

## 4. Mock-Test Analysis
For a mock test, provide analysis of the following when the relevant data exists:
- Score and correct, wrong, and unanswered answers.
- Subject- and topic-level performance.
- Recurring mistakes.
- Time management.
- Suggested next steps for practice or revision.

The backend computes scoring and deterministic metrics according to the active program's configured exam rules. AI may explain these results in learner-friendly language and suggest next steps, but must not replace deterministic calculations. Do not promise exam success or predict an outcome as guaranteed.

## 5. Admin Requirements
1. Manage tenant-scoped exam programs, subjects, topics, exam patterns, and exam rules; introduce TNPSC programs incrementally across releases.
2. Manage questions and their lifecycle, including review of AI-generated questions.
3. Upload and manage approved knowledge documents and their supporting metadata.
4. Manage mock tests and their program-specific configuration.
5. Review student feedback and manage feedback-related workflows.
6. View student performance and analytics within authorized scope.
7. Configure AI providers, models, prompts, and task-to-model routing; review AI evaluations, failures, usage, and cost.
8. Manage roles and permissions.
9. View audit logs for administrative and relevant system actions.
10. Keep AI-provider secrets server-side and protect them from student clients.

## 6. Tenant Requirements
- The initial tenant is ArivuVazhi. The product should allow for future multi-tenant support.
- Enforce tenant isolation in backend authorization, data access, and AI knowledge retrieval. Tenant boundaries must not depend only on client-side filtering.
- Admins may manage only the tenants and resources authorized for their roles.

## 7. AI Requirements
- AI provider abstraction, with local-model and external-provider support.
- Retrieval-augmented generation (RAG) over approved knowledge for factual exam content.
- Structured generation and output validation.
- Configurable fallback models, prompt versioning, and task-to-model routing.
- AI audit logs, evaluation datasets, and cost tracking.
- AI tasks must respect the learner's active exam program, authorized learning context, tenant boundaries, and selected language where approved content is available.
- Keep deterministic responsibilities—such as scoring and exam-rule enforcement—in backend code rather than delegating them to AI.

## 8. Student Mobile Experience and UX Requirements

### 8.1 Experience principles and brand
- The student mobile experience is modern, minimal, premium, calm, and distraction-free, guided by: **“Less distraction. More concentration. Better preparation.”**
- Use the ArivuVazhi brand and tagline: **LEARN • PRACTICE • ANALYZE • ACHIEVE**.
- Light mode is the default; dark mode is an optional user-selectable theme.
- Centralize reusable color tokens and use them consistently rather than hardcoding colors screen by screen.
- Brand palette:

| Token / color | Hex | Intended use |
|---|---|---|
| Midnight Navy | `#101D36` | Primary brand color, important text and navigation |
| Electric Cyan | `#35C6E8` | Selective primary accent and active states |
| Deep Teal | `#0D8EA8` | Secondary accent |
| Ice Blue | `#E8F8FC` | Highlight backgrounds |
| Cool Gray | `#F0F4F8` | Light application background |
| White | `#FFFFFF` | Cards and surfaces |
| Slate | `#64748B` | Secondary text |
| Success | `#16A36A` | Success state |
| Warning | `#E9A23B` | Warning state |
| Error | `#DC4C4C` | Error state |
| Information | `#2786C7` | Informational state |

- Use comfortable light surfaces, readable text, consistent spacing and alignment, subtle borders and shadows, and restrained rounded components. Avoid excessive gradients and decorative elements.
- Avoid unnecessary banners, popups, intrusive notifications, animations, gamification, promotional sections, repetitive information, excessive metrics, and overuse of bright colors. Retain valid learning functionality without presenting every feature at once.
- Give each screen a clear purpose and primary action. Make the next useful study action easy to identify; keep screens and navigation understandable to first-time users.
- Use minimal motion and respect the device's reduced-motion preference.

### 8.2 Onboarding and setup
- Provide a branded welcome/onboarding experience with a concise introduction, key benefits, clear Get Started and Login actions, and guided choices for exam program and language preferences.
- Retain the required App Language, Exam/Study Language, active exam program, target date, study availability, and initial assessment requirements. Explain choices clearly and avoid unnecessary steps without presuming which required choices or setup tasks can be removed, combined, or deferred.
- Only offer supported exam programs and languages/content that are actually available and approved. Do not imply unconfigured exam or content availability.
- **Pending decision:** The exact onboarding/setup flow and its step order have not been defined.

### 8.3 Primary navigation and dashboard
- Use five primary bottom-navigation items: **Home, Learn, Practice, Progress, Profile**.
- AI Tutor and Study Planner must be accessible from the dashboard and relevant contextual actions; they are not additional bottom-navigation tabs.
- Home must answer “What should I do today?” with a focused view that can include a greeting, active exam program, preparation progress, today's goal, clear next learning action, Continue Learning, Practice, Mock Tests, AI Tutor, Study Planner, and relevant reminders. Prioritize the next action and avoid showing every feature or excessive metrics simultaneously.
- Keep the active exam program clear throughout the student experience. All dashboard information and actions must remain scoped to that active program.

### 8.4 Required student screens and capabilities
- **Learning:** Provide exam-, subject-, and topic-oriented syllabus navigation; topic progress; approved study materials; notes and bookmarks; videos where available; and completed/pending topic states. Availability must reflect configured, approved content.
- **Practice:** Support subject- and topic-based MCQs, the four difficulty modes, question navigation, answer selection, immediate feedback, explanations, and practice history. Use the active program's configuration and available approved content.
- **Mock tests:** Distinguish full-length exams from short subject-wise or topic-wise focused mocks before a learner starts. Full mocks must follow configured real-exam timing, marks, question pattern and distribution, scoring, and applicable negative marking. Subject-wise, topic-wise, or custom practice must remain within the active program; exact short/custom test settings are undecided. Provide instructions, timer, question navigation, mark-for-review, submit confirmation, and results as supported by the configured test. During an active mock, hide unnecessary navigation and distracting interface elements.
- **AI Tutor / AI Coach:** Provide an authenticated, exam-preparation-only interface for questions and explanations, with structured readable responses that may include simplified explanations, examples, key points, follow-up questions, and related resources when supported by approved knowledge. Support Tamil and English only as permitted by selected preferences and approved content availability. Ground factual answers in approved knowledge, make limitations clear when it is unavailable, and do not expose provider/model complexity.
- **Progress and performance:** Present understandable overall, subject- and topic-level performance, strengths and weaknesses, test history, accuracy and trends, and actionable practice/revision recommendations when relevant data exists. Keep the presentation readable and avoid overwhelming learners with raw or excessive metrics. Deterministic scoring and metrics remain backend responsibilities.
- **Study Planner:** Provide a simple daily/weekly plan, study goals and schedules, subject-wise tasks, completion, reminders where enabled, and active-program syllabus tracking. AI-assisted planning, if provided, must use only the active program and authorized learner context.
- **Profile and settings:** Provide profile, active exam program selection/switching, App Language and Exam/Study Language preferences, light/dark theme, notification preferences, account settings, and help/support. Switching programs replaces the active learner-facing context; inactive-program progress retention remains undecided.
- Preserve access to the dedicated, easy-to-find, optional feedback area required in section 3.

### 8.5 Readability, accessibility, and responsive behavior
- Ensure readable Tamil and English typography and correct Tamil rendering; prevent clipping, overlapping glyphs, or inconsistent line height. Use suitable fonts/fallbacks and allow for text expansion and wrapping.
- Provide comfortable touch targets, legible font sizes, adequate spacing, and clear focus/active states.
- Support screen readers with meaningful labels and reading order; do not rely on color alone to convey meaning.
- Maintain sufficient text/background contrast in both themes and support reduced motion.
- Adapt layouts to supported mobile screen sizes, orientations, and system text scaling without hiding essential content or actions.

### 8.6 Mobile implementation direction
- The student mobile application uses **React Native and TypeScript** with reusable mobile components and centralized design tokens. Do not use Flutter or use Material UI (MUI) directly in React Native.
- Keep the student client on authenticated application APIs; it must not call AI-provider APIs directly. Provider secrets and AI access remain server-side.
- This mobile direction does not require redesigning the web admin portal or unnecessarily changing the existing backend/web architecture. Related architecture and technology decisions should remain consistent with their separately maintained specifications.

## 9. Competitor Review
Review shortlist: **Superprep, Testbook, and Adda247**.

**Pending verification:** Specific competitor features, current availability, and comparative findings have not yet been verified. Do not treat unverified competitor details as established requirements or product facts.

## 10. Pending Decisions and Availability Constraints
- Whether and how to retain progress for inactive programs is undecided; any retained progress must remain separate from active-program progress.
- Exact onboarding/setup flow and step order are undecided; required choices and setup remain in force.
- Exact question counts, durations, and other settings for short or custom practice mocks are undecided.
- Feedback handling details have not been defined.
- Content, videos, languages, and exam programs must not be represented as available until configured and approved.
- Competitor findings remain unverified as stated in section 9.
- Implementation details beyond the mobile technology direction in section 8.6 belong in the corresponding separately maintained architecture and technology specifications.
