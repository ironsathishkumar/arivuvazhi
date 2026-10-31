# Database Design

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Core Collections
- users
- roles
- exams
- subjects
- topics
- subTopics
- questions
- mockTests
- mockTestQuestions
- testAttempts
- attemptAnswers
- mistakes
- revisionSchedules
- studyPlans
- studySessions
- studentLearningProfiles
- topicPerformance
- subjectPerformance
- achievements
- userAchievements
- knowledgeDocuments
- knowledgeChunks
- aiModels
- aiTasks
- aiPrompts
- aiRequests
- aiResponses
- aiEvaluations
- currentAffairs
- notifications
- auditLogs

## Learner Program and Language Requirements
- Associate each learner with exactly one active exam program at a time. The learner may switch to another supported program; the newly selected program becomes the active program.
- Learner-facing records and queries—including plans, practice, mock tests, analytics, recommendations, revisions, and AI Coach context—must be scoped to the learner's tenant and current active program. Do not combine inactive-program context with active-program results.
- Support learner preferences for both App Language and Exam/Study Language. Learners can change these preferences later.
- Exam content and AI responses must respect the selected Exam/Study Language and the availability of approved content in that language. Do not imply that unavailable or unapproved language content exists.
- Tenant boundaries must be enforced in backend data access and authorization, not only through client-side filtering.
- **Pending decision:** Whether and how to retain progress for inactive programs has not been confirmed. Do not assume a retention policy or prescribe a schema for it here.

## Design Principles
- Use references where entities are shared.
- Version exam rules and knowledge.
- Keep high-volume attempt data queryable.
- Index exam/topic/status fields.
- Avoid storing unnecessary duplicated AI context.
- Ensure learner-facing records and queries can be scoped by tenant and active program.
