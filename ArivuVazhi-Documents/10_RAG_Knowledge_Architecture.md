# RAG Knowledge Architecture

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Knowledge Lifecycle
Upload
→ Extract
→ Clean
→ Chunk
→ Metadata
→ Embed
→ Index
→ Validate
→ Publish
→ Retrieve

## Metadata
- tenantId
- examId
- subjectId
- topicId
- subTopicId
- language
- source
- sourceDate
- version
- contentType
- approvalStatus

## Retrieval Rules
1. Enforce tenant authorization on every retrieval; retrieve only knowledge the requesting user or task is authorized to access. Tenant boundaries must be enforced by the backend, not only by client-side filtering.
2. For learner-facing retrieval, use only the learner's current active TNPSC exam program. Do not mix in knowledge for inactive programs. When the learner switches programs, use the newly selected program as the active retrieval scope.
3. Require the learner's selected Exam/Study Language for learner-facing factual exam content. Retrieve only content in that language that is approved and available for the active program.
4. Preserve approval and version checks: retrieve only approved content from an active/approved version. Do not use unapproved, superseded, or otherwise inactive versions as supporting knowledge.
5. Retrieve relevant chunks from the authorized tenant, active program, selected language, and approved version scope; provide source references to the AI.
6. If suitable approved content is unavailable for the requested program or selected language, do not imply that such content is available or present unsupported factual claims. Make the limitation clear to the learner.
7. Reject unsupported factual claims where possible.

## Knowledge Types
- Official syllabus
- Approved study material
- Previous-year questions
- Official answer keys
- Approved explanations
- Exam notifications
- Approved current-affairs sources
- Admin-authored content
