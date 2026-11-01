# Student Mobile App

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform  
> **Brand tagline:** LEARN • PRACTICE • ANALYZE • ACHIEVE  
> **Design philosophy:** Less distraction. More concentration. Better preparation.

## 1. Scope and Product Constraints

This document specifies the student mobile application. It does not redesign the web admin portal or replace existing backend architecture. Preserve valid functionality while applying the finalized student-app identity and mobile direction.

- Support TNPSC exam programs incrementally; do not imply every program is available at launch.
- Each learner has exactly one active exam program at a time. Switching programs replaces the active context. Plans, learning, practice, mocks, progress, recommendations, revisions, and AI Tutor must use only the current active program; do not mix inactive-program context into active features.
- Whether and how progress is retained for inactive programs remains undecided. Any retained progress must remain separate from active-program progress.
- Respect the selected Exam/Study Language and approved content availability. Do not imply that content, videos, or AI support in a language is available unless confirmed for that content.
- Full mocks follow the active program’s configured real-exam rules, including timing, marks, question pattern and distribution, scoring, and applicable negative marking. Short subject-wise or topic-wise mocks are focused practice and must be clearly distinguished from full mocks. Exact short-mock settings are undecided.
- Scoring and exam-rule enforcement are deterministic backend responsibilities. AI may explain results, but must not replace these calculations.
- AI Tutor (also referred to as AI Coach) is available only to authenticated learners, is limited to exam-preparation support, uses approved knowledge and authorized learner context for the active program, and must make limitations clear when supporting knowledge is unavailable. Do not expose AI provider or model complexity to students. Provider calls and secrets remain server-side.
- Student feedback is optional and must remain accessible through a dedicated, easy-to-find entry. Feedback handling details are undecided.

## 2. Technology and Application Architecture

### Confirmed technology

- Mobile application: React Native + TypeScript.
- Existing backend: Node.js + Express.js + TypeScript.
- AI backend: Python + FastAPI.
- Database: MongoDB Atlas.
- Authentication: JWT.
- API documentation: Swagger / OpenAPI.

Do not introduce Flutter or use Material UI (MUI) in React Native. Do not unnecessarily change the backend or web application architecture.

### Mobile architecture

Organize the application by feature, with shared foundations and typed boundaries. A suitable structure is:

```text
src/
  app/                 # app entry, navigation, providers
  features/
    onboarding/
    home/
    learning/
    practice/
    mocks/
    progress/
    tutor/
    planner/
    profile/
    feedback/
  components/          # reusable, domain-neutral UI
  design-system/       # tokens, themes, primitives
  services/            # typed API clients and adapters
  state/               # app/session and feature state
  hooks/
  types/
  utils/
```

Use screen components for composition, feature components for domain-specific interactions, and shared design-system components for consistent presentation. Keep business rules and scoring on the backend; the client may validate inputs and present server results but must not calculate authoritative exam scores.

### API integration

- Integrate with the existing Node.js/Express APIs using typed request and response models aligned with Swagger/OpenAPI contracts. Route AI Tutor requests through the authorized server-side AI service; the mobile client must never call an AI provider directly.
- Centralize API base configuration, request handling, authentication headers, serialization, timeout/error mapping, and safe retry policy in a shared API layer rather than screen components.
- Attach the authenticated session and tenant context through the authorized backend flow; never rely on client-side filtering for authorization or tenant isolation.
- Handle loading, empty, offline/network failure, authorization failure, validation failure, and retry states explicitly. Avoid exposing secrets or internal provider/model errors in user-facing messages.
- Keep API contracts and active-program scope explicit for learning content, attempts, results, analytics, planner data, feedback, and AI context.

### State management

Separate concerns into:

- **Session state:** authentication status, current user, and authorized session lifecycle.
- **Preferences:** app language, Exam/Study Language, theme, and notification preferences.
- **Active program:** the single current exam program; switching it must refresh or invalidate program-scoped screens and data so stale content cannot appear.
- **Server state:** fetched content, progress, attempts, plans, and results, with appropriate loading/error/refresh handling.
- **Local UI state:** transient form values, selected tab, open dialogs, and question navigation.

Use a consistent typed state/query approach selected by implementation; do not duplicate server state unnecessarily or persist sensitive data in unsecured storage. Persist only preferences/session material using platform-appropriate secure storage where applicable. Exact library choices are not specified here.

### Authentication and theme management

- Gate learner features, including AI Tutor, behind authentication. Provide clear sign-in and sign-out/session-expiry handling; protect authenticated routes and return users to an appropriate entry point after session expiry.
- Store and manage JWT/session credentials securely using platform-appropriate secure storage. Do not put credentials in logs or ordinary unprotected preference storage.
- Default to Light theme. Offer Dark theme as an optional user preference and apply it consistently across all screens and shared components. Theme choice must not alter product content or exam behavior.
- App Language and Exam/Study Language are distinct preferences. Keep content and AI responses within approved availability for the selected Exam/Study Language.

## 3. Brand and Reusable Design System

### Brand identity

- Brand: **ArivuVazhi**.
- Tagline: **LEARN • PRACTICE • ANALYZE • ACHIEVE**.
- Personality: intelligent, trustworthy, modern, professional, calm, student-friendly, and motivating.
- Direction: modern, minimal, premium, light-first, and distraction-free. Use restrained color, consistent alignment, subtle borders and elevation, and minimal motion. Avoid unnecessary banners, popups, promotions, decorative gradients, excessive gamification, repetitive information, and metric overload.

### Centralized color tokens

Define colors centrally in typed theme tokens. Components must consume semantic tokens rather than hardcoded hex values. The following palette is the approved brand palette; dark-theme mappings should preserve readable contrast and the brand character without changing the approved source values.

| Token | Hex | Intended use |
|---|---|---|
| Midnight Navy | `#101D36` | Primary brand color, headings, important text and navigation |
| Electric Cyan | `#35C6E8` | Selective primary accent, key action and active-state emphasis |
| Deep Teal | `#0D8EA8` | Secondary accent |
| Ice Blue | `#E8F8FC` | Highlight and supporting backgrounds |
| Cool Gray | `#F0F4F8` | Light application background |
| White | `#FFFFFF` | Cards and surfaces |
| Slate | `#64748B` | Secondary text |
| Success | `#16A36A` | Success feedback/status |
| Warning | `#E9A23B` | Warning feedback/status |
| Error | `#DC4C4C` | Error feedback/status |
| Information | `#2786C7` | Informational feedback/status |

Create semantic theme roles (for example, background, surface, text-primary, text-secondary, border, accent, success, warning, error, and information) that map to the brand palette in Light and Dark themes. Check text/background contrast in both themes; do not use accent colors as small text unless contrast is sufficient.

### Tokens and reusable primitives

Centralize and document:

- **Typography:** font families/fallbacks, sizes, weights, line heights, and semantic styles.
- **Spacing:** a consistent spacing scale used for screen insets, sections, cards, and controls.
- **Radius:** consistent corner-radius tokens for cards, controls, chips, and sheets.
- **Elevation:** restrained platform-appropriate shadow/elevation tokens; favor subtle borders over heavy shadows.
- **Color:** semantic Light and Dark theme mappings described above.

Provide reusable React Native components for:

- Primary, secondary, tertiary, and destructive buttons, with disabled and loading states.
- Text inputs, search, selection controls, and accessible form validation.
- Cards and section headers.
- Navigation bar, tabs, and active/inactive tab states.
- Progress indicators, charts/metric summaries, chips, and badges.
- Dialogs and bottom sheets, including clear cancel/confirm actions.
- Loading/skeleton, empty, error/retry, offline, and success states.
- Question/answer options, explanation blocks, and exam question navigation where appropriate.

Components must use the shared tokens, accept accessible labels/states, and avoid embedding business rules. Screen-specific compositions should not create competing visual conventions.

### Typography: English and Tamil

Use readable typography with a font stack that supports both English and Tamil. Verify actual Tamil glyph coverage and platform fallback behavior; the app must not clip, overlap, truncate, or misalign Tamil characters or combining marks. Use language-appropriate line height and allow text to wrap naturally. Test mixed Tamil/English text, numbers, punctuation, longer labels, and scaling on supported iOS and Android devices. Do not promise a particular content language unless approved content is available.

### Accessibility and responsive behavior

- Use comfortable touch targets and readable default font sizes; support system text scaling without clipping or hiding essential controls.
- Provide screen-reader labels, roles, focus order, and state announcements for interactive controls, navigation, progress, validation, and mock-test actions.
- Maintain sufficient contrast in both themes; do not communicate status through color alone.
- Respect reduced-motion preferences and keep transitions subtle and nonessential.
- Adapt to supported screen sizes, safe areas, orientation/layout constraints, and keyboard appearance. Ensure forms and question controls remain usable on smaller screens.

## 4. Navigation and Student Flows

### Primary navigation

Use a persistent five-tab bottom navigation for normal authenticated study use:

1. **Home**
2. **Learn**
3. **Practice**
4. **Progress**
5. **Profile**

Keep labels clear and consistent. AI Tutor and Study Planner are accessible from Home and relevant contextual actions, not additional bottom tabs. Preserve the dedicated feedback entry in an easy-to-find location, such as Profile/Help and Support, without making feedback a sixth primary tab. Do not add extra primary tabs.

During an active mock, hide or suppress unrelated navigation and distractions while retaining required exam question navigation and submission controls. Confirm navigation behavior before discarding an in-progress attempt.

### Welcome and onboarding

Provide a concise branded introduction, platform benefits, and clear Get Started and Login actions. Guide first-time learners through required choices without lengthy or unnecessary steps. Preserve the required setup choices: App Language, Exam/Study Language, active exam program, target date, study availability, and initial assessment. Explain choices in plain language and show only supported program/content options. The exact setup sequence and any changes to it remain undecided; do not remove or combine required choices by assumption.

### Home dashboard

Answer “What should I do today?” with a focused hierarchy:

- Personalized greeting and clearly identified active exam program.
- Understandable preparation progress.
- Today’s goal and the next learning action, prioritized over secondary content.
- Continue Learning and clear shortcuts to Practice and Mock Tests.
- Contextual AI Tutor and Study Planner shortcuts.
- Relevant upcoming reminders where enabled.

Keep the screen focused; do not show every feature or every available metric at once. Streaks or other existing indicators may be shown only where supported and without turning the experience into excessive gamification.

### Learn

Support exam-wise syllabus navigation, subject and topic discovery, topic progress, approved study materials, notes and bookmarks, and available video resources. Distinguish completed and pending topics clearly. Show only material available for the active program and selected language; do not imply video or language coverage when unavailable.

### Practice

Support subject- and topic-based MCQ practice for the active program, with the four difficulty modes **Easy, Medium, Hard, and Very Hard**. The selected mode must govern question selection or generation. Provide question navigation, answer selection, immediate feedback, explanations, bookmarking/reporting where supported, and practice history. Keep each question view focused and readable.

### Mock tests

Present full-length exam mocks separately from short focused subject-wise or topic-wise mocks; do not imply that a focused mock is a full real-exam simulation. Support configured test instructions, timer, question navigation, mark for review, submit confirmation, and results. Full mocks must follow the active program’s configured real-exam timing, marks, question pattern and distribution, scoring, and applicable negative marking. The backend computes authoritative scoring and deterministic metrics. Exact short-mock counts, durations, and other settings remain undecided and must not be invented.

On completion, present available results clearly, including score and correct/wrong/unanswered responses and, where data exists, subject/topic performance, recurring mistakes, time management, and next practice/revision suggestions. AI may explain deterministic results but may not replace scoring or guarantee exam success.

### AI Tutor

Provide a simple, readable conversational interface for authenticated exam-preparation support. Offer Tamil/English interaction only according to approved language and knowledge availability. Present answers with clear structure where useful: explanation, examples, key points, follow-up prompts, and related approved learning resources. Ground factual exam answers in approved knowledge, use only the active program and authorized learning context, and state limitations when adequate supporting knowledge is unavailable. Do not expose providers, models, or routing details.

### Progress

Present understandable overall preparation progress, subject/topic performance, strengths and areas needing practice, test history, accuracy, and trends when the relevant data exists. Use restrained charts and plain-language indicators; prioritize actionable recommendations and avoid overwhelming the learner with raw or excessive metrics. Keep all insights scoped to the active program.

### Study Planner

Provide a simple daily/weekly view of study goals, schedules, subject-wise tasks, completion, reminders, and syllabus tracking for the active program. Make AI-assisted planning available only when supported and scoped to authorized active-program context. Detailed planning rules and reminder behavior remain subject to product configuration.

### Profile, settings, and feedback

Provide student profile and account settings, active exam selection/switching, App Language and Exam/Study Language preferences, Light/Dark theme, notification preferences, and help/support. Make optional student feedback easy to find and submit, covering the app, content, explanations, or suggestions. Do not invent feedback moderation or response workflows; those details remain undecided.

## 5. States, Errors, and Content Availability

Every data-backed screen must handle loading, empty, error, retry, and success states consistently. Use calm, plain-language messages and an obvious next action. Empty states must not imply unavailable content exists. For unavailable language/content, clearly indicate the limitation and avoid presenting unsupported material as approved. Handle network failures and expired authentication without exposing technical internals or losing unsaved work where avoidable.

## 6. Verification and Implementation Notes

Verify the design system and screens across supported devices and both themes, including Tamil rendering, English/Tamil mixed content, accessibility settings, reduced motion, touch targets, and screen-reader operation. Test that active-program switching refreshes program-scoped content and does not leak inactive-program context; that protected features require authentication; and that full mocks use backend-configured rules and deterministic scoring.

Implementation status, prototype status, exact component/library choices, and screen-by-screen completion are not established by this specification and must be verified against the existing repository and prototype before being reported as complete. Preserve working functionality during any implementation update.

## 7. Unresolved Decisions

- Whether and how inactive-program progress is retained.
- Exact onboarding sequence, while retaining all required setup choices.
- Availability of specific programs, languages, approved materials, videos, and AI knowledge.
- Exact short-mock settings, including question counts and durations.
- Feedback placement details beyond easy-to-find access, and feedback handling workflows.
- Exact planner scheduling/reminder behavior and any AI-planning rules.
- Specific state-management, navigation, charting, typography-library, and secure-storage packages; choose only after reviewing the existing implementation and architecture.
- Existing prototype coverage, working interactions, and remaining implementation gaps; inspect and verify before making claims.
