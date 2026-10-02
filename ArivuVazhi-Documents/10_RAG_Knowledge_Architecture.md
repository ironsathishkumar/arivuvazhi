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
1. Filter by exam.
2. Filter by language where applicable.
3. Filter by active/approved version.
4. Retrieve relevant chunks.
5. Provide source references to the AI.
6. Reject unsupported factual claims where possible.

## Knowledge Types
- Official syllabus
- Approved study material
- Previous-year questions
- Official answer keys
- Approved explanations
- Exam notifications
- Approved current-affairs sources
- Admin-authored content
