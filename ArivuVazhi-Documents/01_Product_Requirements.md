# Product Requirements

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

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
10. Take mock tests configured for the active program, designed to match the actual exam as closely as practical and governed by that active program's configured exam rules, and review results and performance analysis. **Pending decision:** The specific mock-exam fidelity details have not been defined.
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

## 8. UX Requirements
- Minimal navigation and a clear next action.
- Make the student application easy to use and simplify setup to reduce unnecessary configuration steps, without removing approved requirements such as program selection and App Language and Exam/Study Language preferences. **Pending decision:** The specific setup flow and steps have not been defined.
- Mobile-first student experience.
- Do not expose technical AI-provider or model complexity to students.
- Present progress and performance in understandable terms without requiring the learner to interpret raw metrics.
- Keep the learner's active exam program clear and avoid mixing inactive-program content into the active learning experience.
- Provide a dedicated, easy-to-find area students can open to submit feedback; submission remains optional. Feedback handling details are undecided.

## 9. Competitor Review
Review shortlist: **Superprep, Testbook, and Adda247**.

**Pending verification:** Specific competitor features, current availability, and comparative findings have not yet been verified. Do not treat unverified competitor details as established requirements or product facts.
