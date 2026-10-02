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

## Design Principles
- Use references where entities are shared.
- Version exam rules and knowledge.
- Keep high-volume attempt data queryable.
- Index exam/topic/status fields.
- Avoid storing unnecessary duplicated AI context.
