# Application Architecture

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

```text
                         Student
                            |
                    React Native App
                  TypeScript mobile client
                            |
                    HTTPS / JWT APIs
                            |
                            v
                    Node.js / Express API
                    TypeScript modular monolith
                            |
             Authentication and authorization
             Tenant and learner access checks
             Active-program scope and exam rules
                            |
       +--------------------+--------------------+
       |                    |                    |
       v                    v                    v
   Exam Engine        Learning Services       AI Platform
       |                    |                    |
       |                    |              Authenticated AI API
       |                    |                    |
       |                    |              Python / FastAPI
       |                    |              AI Orchestrator
       |                    |                    |
       +--------------------+          +---------+---------+
                                       |                   |
                                       v                   v
                                 Model Router       RAG / Approved
                                       |              Knowledge
                          +------------+------------+        |
                          |            |            |         v
                          v            v            v     MongoDB Atlas
                       Ollama        OpenAI     Gemini/Claude
                                                       (server-side)
                            |
                            v
                     MongoDB Atlas

       API contracts and documentation: Swagger / OpenAPI
```

## Architectural Principles
- Use a modular monolith initially.
- Support TNPSC exam programs incrementally across releases. Each learner has exactly one active exam program at a time.
- Enforce tenant isolation and authenticated learner authorization across APIs, backend services, data access, and AI knowledge retrieval. Client-side filtering alone is not sufficient.
- Scope learner-facing services—including plans, practice, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context—to the learner's current active program. Do not mix inactive-program content into these features.
- Enforce the active program's configured syllabus, scoring, negative marking, and other exam rules in backend code. For real-exam-like full mocks, backend mock execution must enforce the active program's configured timing, marks, question pattern and distribution, scoring, and applicable negative marking. Support short subject-wise and topic-wise focused mocks scoped to that active program; exact settings for these focused mocks are not prescribed here. Backend code also performs deterministic scoring and metrics; AI may explain results but must not replace these calculations.
- Keep AI isolated behind provider interfaces. The backend orchestrates provider access; the student app must not call AI-provider APIs directly. Provider credentials and secrets remain server-side.
- Use approved knowledge to ground factual AI responses. Content and AI outputs must respect approved content and its available language; do not imply that content is available in a language unless it is approved and available.
- Use AI for reasoning, explanation, generation, and personalization within authorized context and approved-knowledge limits. Make limitations clear when supporting approved knowledge is unavailable.
- New AI providers can be added without changing the student app.
- Minimize unnecessary student setup and configuration steps while retaining approved requirements. Specific setup-flow changes are undecided.
- Inactive-program progress retention is undecided; this architecture does not define whether or how that progress is retained.

## Mobile Client Architecture

- Build the student application with React Native and TypeScript. Use platform-appropriate React Native components and libraries; do not introduce Flutter or use web Material UI (MUI) as a React Native component system.
- Organize client code by feature and shared responsibility, keeping screens, reusable UI, navigation, API access, state, and theme/tokens separate. A suggested structure is:

```text
src/
  app/                 # app entry, providers, global setup
  navigation/          # authenticated and onboarding navigation
  features/             # home, learning, practice, mocks, tutor, progress, profile
  components/           # shared, accessible UI components
  design-system/        # tokens, themes, typography, component styles
  services/             # API client and feature service functions
  state/                # client/session/UI state
  types/                 # shared client-side TypeScript types
  utils/                 # formatting and non-business helpers
```

This is a responsibility guide, not a requirement to adopt a particular state-management or navigation library.
- Centralize reusable design tokens rather than hardcoding styles per screen. The finalized brand palette is Midnight Navy `#101D36`, Electric Cyan `#35C6E8`, Deep Teal `#0D8EA8`, Ice Blue `#E8F8FC`, Cool Gray `#F0F4F8`, White `#FFFFFF`, Slate `#64748B`; semantic colors are Success `#16A36A`, Warning `#E9A23B`, Error `#DC4C4C`, and Information `#2786C7`. Light mode is the default; dark mode is optional. Define theme-aware semantic tokens so components use token names and appropriate contrast rather than embedding palette values.
- Provide shared components and patterns for typography, spacing, radius, elevation, buttons, inputs, cards, navigation, tabs, progress, chips/badges, dialogs, bottom sheets, and loading, empty, error, and success states. Keep presentation consistent and calm, with restrained effects and clear primary actions.
- Use a persistent primary bottom navigation for Home, Learn, Practice, Progress, and Profile. AI Tutor and Study Planner are reached through dashboard or contextual actions, not additional primary tabs. Onboarding and focused active-mock flows may use separate navigation; active mocks should hide unrelated navigation.
- Keep client state limited to presentation and user-session concerns. The client may hold transient UI state, form state, navigation state, and user preferences such as theme and language. Server-owned learning records, exam configuration, authorization, active-program scope, scoring, and exam rules remain authoritative on the backend. Do not treat client state or client-side filtering as a security or rule-enforcement boundary.
- Integrate with the Node.js/Express API through a shared typed API client and feature-level service functions. Use the Swagger/OpenAPI contract as the source for API request and response types where supported. Handle authentication headers, request failures, loading states, and safe session expiry consistently. Do not call MongoDB or AI-provider APIs from the mobile client.
- Use JWT authentication for protected APIs. Keep authenticated and unauthenticated navigation distinct, attach credentials through the API integration layer, and clear the client session and return to the unauthenticated flow when the session is ended or invalid. Token storage must use an appropriate secure platform facility; do not store secrets in source code or ordinary unprotected preferences.
- Theme management defaults to light mode and allows an optional dark mode in settings. Apply the selected theme consistently through centralized tokens and shared components; keep theme preference as a client preference, separate from authorization and exam data.
- Support readable Tamil and English text, with suitable font fallback and line-height so Tamil glyphs render without clipping or overlap. Use accessible labels, screen-reader support, sufficient contrast, comfortable touch targets and font sizes, reduced-motion behavior, and layouts that adapt to supported screen sizes. Do not imply that content exists in a language unless approved content is available.
- Preserve the mobile product philosophy: “Less distraction. More concentration. Better preparation.” Keep screens focused, avoid unnecessary banners, popups, animations, promotional content, and excessive metrics, while retaining required study functionality.

## Backend and Data Responsibilities

- The Node.js/Express.js and TypeScript backend exposes authenticated application APIs and coordinates exam, learning, and AI services. MongoDB Atlas is the database. API contracts are documented with Swagger/OpenAPI.
- Backend authentication and authorization establish the learner and permitted tenant/resource scope. Backend services derive and enforce the learner's single active exam program for learner-facing requests; they must not trust a program identifier or access scope supplied by the client without validating it.
- Tenant and learner access checks apply to data access and AI retrieval. The backend—not the mobile client—enforces tenant isolation, active-program scoping, configured exam rules, mock execution, and deterministic scoring and metrics.
- The existing web admin portal is outside this mobile-client architecture change; this document does not redesign it.

## AI Service

- The AI service uses Python and FastAPI behind the authenticated backend service boundary. The AI service is for authenticated learners and exam-preparation support only; it is not a general-purpose assistant.
- The backend supplies only authorized learner context and the current active program to AI tasks. Retrieval must be constrained by tenant, active program, approval status, and applicable language. The AI service must not mix inactive-program knowledge or unauthorized learner data into a response.
- Factual exam responses must be grounded in approved knowledge. If supporting approved knowledge is unavailable, the service must make that limitation clear and avoid presenting unsupported claims as facts. Respect approved language/content availability.
- Provider routing and credentials remain server-side. The mobile app does not expose model/provider complexity or call provider APIs directly. AI may explain deterministic backend results and suggest preparation actions, but does not compute or replace exam scoring, rule enforcement, or deterministic metrics.

## Mock Execution
- Full mocks must resemble the real exam and follow the active TNPSC program's configured rules, including timing, marks, question pattern and distribution, scoring, and applicable negative marking. Backend execution enforces these rules and computes deterministic results.
- Short subject-wise and topic-wise mocks support focused practice within the learner's active program. Their exact settings are not specified here.

## Student Feedback
The student application must provide a separate, easy-to-find area that students can open to submit optional feedback. Its placement and submission-flow details are not specified here.

## Open Decisions and Implementation Notes
- Inactive-program progress retention is undecided. Any future retention behavior must keep inactive-program progress separate from active-program progress.
- Exact onboarding/setup flow and short-mock settings remain undecided; this architecture does not prescribe changes to them.
- Specific navigation, state-management, secure-storage, and component-library packages are not selected by this document. Confirm package choices during implementation without changing the approved platform architecture.
- Verify API contract coverage, secure JWT storage and expiry behavior, Tamil font rendering, accessibility, theme coverage, and active-program/tenant enforcement through implementation and testing. These are implementation verification tasks, not claims that they are already complete.
