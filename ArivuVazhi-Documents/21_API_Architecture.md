# API Architecture

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Base
`/api/v1`

## Modules
- /auth
- /users
- /exams
- /subjects
- /topics
- /questions
- /practice
- /mock-tests
- /attempts
- /mistakes
- /revision
- /study-plans
- /performance
- /knowledge
- /ai
- /students
- /admin
- /analytics
- /notifications

## AI Endpoints
- POST /ai/tutor
- POST /ai/generate-question
- POST /ai/analyze-mistake
- POST /ai/study-plan
- POST /ai/revision-plan

Student clients never call AI providers directly.
