# Admin Portal

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Stack
Next.js App Router + TypeScript + MUI

## Navigation
- Dashboard
- Exam Management
- Question Management
- Knowledge Management
- AI Management
- Learning Management
- Mock Tests
- Students
- Analytics
- Settings
- Administration
- Audit Logs
- Student Feedback Review (optional)

## Administration Scope
- Introduce supported TNPSC exam programs incrementally across releases; do not imply that every program is available at launch.
- Manage exam programs and their configured syllabus, scoring, negative marking, and other exam rules within the admin's authorized tenant scope.
- Authorized admins manage each program's exam-rule configuration used by full mocks, including timing, marks, question pattern and distribution, scoring, and applicable negative marking.
- Admins may manage only tenants and resources their roles authorize. Enforce tenant isolation in backend authorization and data access; client-side filtering alone is insufficient.
- Keep program-specific configuration and content associated with the relevant program and tenant.

## Content and Language Management
- Manage approved knowledge documents, questions, and other learning content with their program, language, source, version, and approval status where applicable.
- Make content availability and approval clear by language. Do not present content as available in a language unless it is approved and available in that language.
- Ensure content management and AI knowledge retrieval respect tenant and program boundaries.

## AI Management
- Providers
- Models
- Task routing
- Prompts
- Evaluations
- Usage
- Cost
- Health

## Knowledge Management
- Documents
- Processing status
- Metadata
- Versions
- Source
- Approval
- Reprocess/archive

## Question Review
Admin can inspect AI-generated question, source, validation results and edit/approve/reject.

## Mock Test Management
- Manage full mocks configured for the relevant TNPSC program. Their configuration must follow that program's exam rules and make the mock resemble the actual exam as closely as practical, including timing, marks, question pattern and distribution, scoring, and applicable negative marking.
- Manage program-scoped subject-wise and topic-wise focused mocks for practice on selected subjects or topics. These are distinct from full mocks; exact settings are not specified here.
- Keep mock-test configurations within the admin's authorized tenant and program scope.

## Learner Analytics
- Provide student performance and analytics only within the admin's authorized tenant and learner scope.
- Keep learner-facing analytics and related insights scoped to the learner's active exam program; do not mix inactive-program context into active-program features.
- Apply role-based authorization to learner records and analytics.

## Student Feedback Review
Students may optionally submit feedback through the student-facing feedback area. Authorized admins may review submitted feedback and manage related workflows; feedback submission is not mandatory.
