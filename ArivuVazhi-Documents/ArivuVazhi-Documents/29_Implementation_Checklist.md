# Implementation Checklist

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform
>
> **Status convention:** All unchecked items are pending until implementation has been directly verified. Do not mark an item complete based on a proposal, specification, or unverified prototype. Record verification evidence before checking an item.

## Product
- [ ] Confirm initial exam
- [ ] Confirm syllabus source
- [ ] Confirm approved knowledge sources
- [ ] Lock MVP scope

## Backend
- [ ] Initialize TypeScript project
- [ ] Configure MongoDB
- [ ] Authentication
- [ ] Roles/permissions
- [ ] Exam APIs
- [ ] Question APIs
- [ ] Practice APIs
- [ ] Mock APIs
- [ ] Learning APIs
- [ ] AI APIs
- [ ] Audit logging

## AI
- [ ] Define AIProvider interface
- [ ] Add Ollama provider
- [ ] Add first external provider
- [ ] Build model router
- [ ] Build prompt manager
- [ ] Build RAG
- [ ] Build validation
- [ ] Build AI audit
- [ ] Build evaluation dataset
- [ ] Build cost tracking

## Admin
- [ ] Dashboard
- [ ] Exam management
- [ ] Question management
- [ ] Knowledge management
- [ ] AI management
- [ ] Student management
- [ ] Analytics
- [ ] Audit logs

## Mobile

### Foundation and design system
- [ ] Verify the existing mobile prototype and its working functionality before changes; record the inspected screens and interactions.
- [ ] Confirm the mobile implementation uses React Native and TypeScript; do not introduce Flutter or MUI into the React Native app.
- [ ] Implement reusable, centralized color tokens for the finalized brand palette: Midnight Navy `#101D36`, Electric Cyan `#35C6E8`, Deep Teal `#0D8EA8`, Ice Blue `#E8F8FC`, Cool Gray `#F0F4F8`, White `#FFFFFF`, Slate `#64748B`; semantic Success `#16A36A`, Warning `#E9A23B`, Error `#DC4C4C`, Information `#2786C7`.
- [ ] Implement and verify light mode as the default and dark mode as an optional theme; check contrast and component legibility in both.
- [ ] Implement reusable typography, spacing, radius, elevation/shadow, and theme tokens; avoid independently hardcoded screen colors and inconsistent styling.
- [ ] Implement and verify reusable components: buttons and variants, inputs, cards, navigation, tabs, progress indicators, chips/badges, dialogs, bottom sheets, and loading, empty, error, and success states.
- [ ] Verify component behavior, layout, and theme switching across supported mobile screen sizes.
- [ ] Verify Tamil and English typography, font fallback, line wrapping, and glyph rendering without clipping or overlap.
- [ ] Verify accessibility: readable text sizes, comfortable touch targets, screen-reader labels, sufficient contrast, reduced-motion support, and responsive layouts.
- [ ] Verify calm, minimal, light-first presentation; avoid unnecessary banners, popups, animation, gamification, promotions, clutter, and excessive metrics.

### Navigation and screens
- [ ] Implement and verify the five primary bottom-navigation tabs, in order: Home, Learn, Practice, Progress, Profile.
- [ ] Verify AI Tutor and Study Planner are reachable from the dashboard and relevant contextual actions, not added as extra bottom tabs.
- [ ] Welcome/onboarding: verify concise branded introduction and benefits, exam and language choices, and Get Started and Login actions; retain required setup choices and do not assume unresolved setup-flow changes.
- [ ] Home/dashboard: verify greeting, exactly one active exam program, preparation progress, today’s goal, next learning action, Continue Learning, Practice, Mock Tests, AI Tutor and Study Planner access, and relevant reminders; prioritize the next action without presenting every feature at once.
- [ ] Learn: verify exam/subject/topic syllabus navigation, topic progress and completion status, available study materials and videos, notes, and bookmarks.
- [ ] Practice: verify subject/topic MCQs, the four difficulty modes (Easy, Medium, Hard, Very Hard), question navigation, answer selection, explanations, and practice history.
- [ ] Mock tests: verify distinct full-length, subject-wise, and custom/focused practice entry points; instructions, timer, question navigation, mark for review, submit confirmation, and result summary. Do not invent undecided short-mock settings.
- [ ] Active mock: verify focused exam presentation hides unnecessary app navigation and distractions while preserving required test controls.
- [ ] AI Tutor: verify authenticated exam-preparation support with readable structured responses, Tamil/English support where approved content is available, explanations, examples, key points, follow-ups, and related resources; do not expose provider/model complexity.
- [ ] Progress: verify understandable overall, subject/topic performance, strengths and weaknesses, test history, accuracy, trends, and actionable recommendations without overwhelming learners with metrics.
- [ ] Study Planner: verify daily/weekly goals, schedules, subject tasks, completion, reminders, and syllabus tracking where supported.
- [ ] Profile/settings: verify profile, active exam, language preferences, theme, notification preferences, account settings, and help/support.
- [ ] Verify screens and actions preserve existing valid functionality and use clear labels and a consistent visual hierarchy.

### API, authentication, and learner context
- [ ] Integrate mobile screens with the configured backend APIs; verify request/response handling, loading and failure behavior, and no direct AI-provider calls from the student client.
- [ ] Verify JWT authentication for protected learner features, including the AI Tutor, and appropriate unauthenticated/error handling.
- [ ] Verify learner-facing plans, learning, practice, difficulty selection, mocks, results, analytics, recommendations, revisions, and AI context use only the learner’s single current active exam program.
- [ ] Verify switching the active program replaces the previous program as context and does not mix inactive-program data into active-program features.
- [ ] Verify Exam/Study Language selection is respected and the interface does not imply unapproved or unavailable content in either language.
- [ ] Verify tenant and learner authorization boundaries are enforced by backend/API access, not only by client-side filtering.

### Prototype content and interaction verification
- [ ] Verify the existing mobile prototype only; do not claim prototype changes or completed functionality without direct implementation and verification.
- [ ] Verify realistic TNPSC sample content in both Tamil and English, including representative subjects, topics, questions, answers, and explanations; confirm Tamil rendering on the relevant screens.
- [ ] Verify supported interactions end to end: onboarding choices, navigation, practice answers and explanations, notes/bookmarks where implemented, theme/language preferences, and accessible dashboard actions.
- [ ] Verify mock navigation between questions, answer state, mark-for-review behavior, timer presentation, submit confirmation, and result navigation.
- [ ] Verify full-length mocks are clearly distinguished from subject-wise/topic-wise or custom focused practice and that only full mocks claim to follow configured real-exam rules.
- [ ] Verify result presentation uses backend deterministic scoring and configured exam rules, including applicable negative marking; AI may explain results but must not calculate or replace scoring.
- [ ] Verify loading, empty, error, and success states on relevant screens using realistic scenarios.

## Quality
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] AI evaluation
- [ ] Security testing
- [ ] Performance testing
- [ ] Verify tests cover active-program isolation across learner-facing features, including after switching programs; confirm no inactive-program context leaks.
- [ ] Verify tests cover Exam/Study Language scoping, Tamil/English rendering, and unavailable or unapproved content handling.
- [ ] Verify tests distinguish full mocks from short subject/topic-focused mocks and enforce configured full-mock rules.
- [ ] Verify tests cover mock question navigation, answer state, mark for review, submit confirmation, and result flow.
- [ ] Verify tests confirm deterministic backend scoring and correct presentation of score, correct/wrong/unanswered counts, and applicable negative marking; test AI explanations separately from calculations.
- [ ] Verify critical onboarding-to-learning journey: welcome → required language and active-program choices → required setup/assessment as configured → dashboard → continue learning.
- [ ] Verify critical practice journey: dashboard → practice setup and difficulty → questions → answer/explanation → history or next action.
- [ ] Verify critical mock journey: dashboard/mock entry → mock-type selection and instructions → active test → review/submit confirmation → deterministic results and analysis.
- [ ] Verify authenticated AI Tutor journey, including active-program and approved-knowledge scoping and graceful handling when supporting knowledge is unavailable.
- [ ] Verify accessibility and theme checks, including screen-reader labels, touch targets, contrast, reduced motion, light/dark mode, and responsive layouts.
- [ ] Record prototype/device or emulator verification evidence before marking mobile checklist items complete.

## Production
- [ ] Environment configuration
- [ ] Secrets management
- [ ] Monitoring
- [ ] Backups
- [ ] App signing
- [ ] Store preparation