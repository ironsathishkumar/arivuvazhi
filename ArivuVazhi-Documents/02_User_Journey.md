# User Journey

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Student Journey

### First-time setup and transition to Home

Registration
→ Welcome and brief guidance explaining how the app supports TNPSC preparation
→ Choose App Language and Exam/Study Language, with a clear explanation of what each language preference controls
→ Select one active supported TNPSC program, with an explanation that the selected program guides the learner’s study experience
→ Set Goal for the active program
→ Complete Initial Assessment for the active program, with a brief explanation of how it helps understand the learner’s starting point
→ Set Learning Profile for the active program, with a brief explanation of how it informs the study plan
→ View Personalized Plan for the active program
→ Transition to Home with a clear indication of what to do today

Keep the first-time experience guided and understandable for people new to the app. Explain setup choices in plain language, retain the required choices and steps above, and reduce unnecessary friction without assuming that any particular step should be removed, skipped, combined, or deferred.

### Ongoing learning

Home: See what to do today through the daily plan, a clear next action, and understandable progress for the active program
→ Practice using a selected difficulty mode (Easy, Medium, Hard, or Very Hard)
→ Choose either a short subject- or topic-focused mock for focused practice, or a full exam mock for exam-style practice
→ Review immediate results and mistake analysis
→ Complete revision for the active program
→ Take a full mock exam configured for the active program, resembling the real exam and following its configured timing, marks, question pattern and distribution, scoring, and applicable negative marking
→ Review performance analysis for the active program
→ View the updated plan on Home
→ Repeat

Clearly distinguish **full exam mocks**, which follow the active program’s configured real-exam rules, from **short subject- or topic-focused mocks**, which support focused practice. Exact settings for short mocks, such as question counts and durations, remain unspecified.

Use simple navigation, clear labels, and a clear screen hierarchy to help learners understand where to go and what to do. Where practical, keep one primary task per screen. The proposed visual direction is a deep navy/indigo primary, selective warm saffron accents for key actions or highlights, light cream/off-white backgrounds, and readable dark text. This is a proposal only, not a finalized design decision.

Provide a dedicated, easy-to-find feedback area that a student can open to optionally submit feedback about the app, content, explanations, or suggestions. Its placement, interaction details, and submission workflow are undecided.

The learner may change App Language or Exam/Study Language in settings and may switch to another supported TNPSC program later. At any time, the learner has exactly one active program. All learner-facing plans, practice, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Coach context must use only the current active program; content from inactive programs must not be mixed into those features. Content and AI responses must respect the selected Exam/Study Language and the availability of approved content in that language. Do not imply that content is available in a language unless it is approved and available.

**Pending decision:** Whether and how to retain a learner's progress for inactive programs has not been confirmed. If retained, it must remain separate from active-program progress.

**Undecided:** Specific setup-flow changes and exact settings for short subject-wise or topic-wise mocks have not been specified. Do not assume specific setup steps to skip or change, or short-mock question counts, durations, or other settings.

## AI Tutor Journey
Student asks question
→ Intent detection
→ Permission/context check
→ Knowledge retrieval
→ Context construction
→ Model routing
→ AI response
→ Grounding/format validation
→ Final response
→ Audit log

## AI Question Journey
Task configuration
→ Retrieve approved knowledge
→ Generate question
→ Validate factual support
→ Validate answer uniqueness
→ Duplicate check
→ Difficulty check
→ Admin review
→ Approve/publish

## Admin Knowledge Journey
Upload document
→ Extract
→ Clean
→ Chunk
→ Add metadata
→ Embed/index
→ Quality check
→ Publish knowledge version