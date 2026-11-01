# User Journey

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform
>
> **Student experience:** Light-first, calm, minimal and focused. “Less distraction. More concentration. Better preparation.”

## Student Journey

### First-time setup

Welcome and concise introduction to ArivuVazhi, its benefits, and the next steps
→ Choose App Language and Exam/Study Language, with a clear explanation of each
→ Select one active supported TNPSC program, with a clear explanation that learner-facing study features use this program
→ Set Goal (target date and study availability for the active program)
→ Initial Assessment for the active program
→ Learning Profile for the active program
→ Personalized Plan for the active program
→ Arrive at Home with the active exam, preparation progress, today’s goal, and a clear next learning action

Provide clear first-time guidance without overwhelming the learner or adding unnecessary steps. Preserve all required setup choices and steps above. Which steps, if any, can be skipped, combined, deferred, or otherwise simplified is undecided; do not assume specific changes.

### Ongoing study loop

Home shows the active exam, relevant preparation progress, today’s goal, and the next recommended learning action
→ Continue the next learning activity, or choose a relevant contextual action such as Practice, Mock Tests, AI Tutor, or Study Planner
→ Practice using a selected difficulty mode (Easy, Medium, Hard, or Very Hard)
→ Review immediate results and explanations
→ Review mistakes and complete scheduled revision for the active program
→ Take a focused short mock for a subject or topic in the active program, when useful
→ Review results and performance analysis for the active program
→ Take a full mock exam configured for the active program, resembling the real exam and following its configured timing, marks, question pattern and distribution, scoring, and applicable negative marking
→ Review performance analysis for the active program
→ Continue with an updated plan for the active program
→ Repeat

Use five primary bottom-navigation destinations: **Home, Learn, Practice, Progress, Profile**. AI Tutor and Study Planner are contextual/dashboard actions, not additional bottom tabs. Keep the dashboard focused on the next learning action; do not display every feature at once. Present only relevant reminders without intrusive or unnecessary prompts.

### Learning and progress

Home or Learn
→ Browse the active program’s syllabus by subject and topic
→ Open available approved learning materials and resources
→ Track completed and pending topics and use notes or bookmarks where available
→ Continue learning and return to the next relevant action

Progress
→ Review understandable overall, subject- and topic-level performance, strengths, areas for more practice, and trends when supported by available data
→ Choose an actionable practice or revision recommendation for the active program

Keep information understandable and focused; avoid overwhelming the learner with excessive metrics.

### AI Tutor

Open AI Tutor from Home or a relevant contextual learning action
→ Ask an exam-preparation question
→ Intent detection
→ Permission/context check
→ Knowledge retrieval
→ Context construction
→ Model routing
→ AI response
→ Grounding/format validation
→ Final response
→ Audit log

The AI Tutor requires authentication and is limited to exam-preparation support. It uses the learner’s active program and authorized learning context, grounds factual exam answers in approved knowledge, and respects the selected Exam/Study Language and approved content availability. Make limitations clear when supporting knowledge is unavailable. Present explanations in a readable structure; do not imply that content is available in a language unless it is approved and available. Do not expose provider or model complexity to students.

### Study Planner

Open Study Planner from Home or a relevant contextual action
→ View or manage the daily or weekly plan for the active program
→ Review scheduled learning, practice, or revision tasks
→ Mark tasks complete and follow the next relevant action

Planner content and recommendations use only the active program. Specific planning behavior beyond the approved requirements is not defined here.

### Mock tests

Choose between clearly labeled mock types before starting:

- **Full exam mock:** follows the active program’s configured real-exam rules, including timing, marks, question pattern and distribution, scoring, and applicable negative marking; should resemble the real exam as closely as practical.
- **Focused short mock:** subject-wise or topic-wise practice within the active program; distinct from a full exam mock.

Complete the selected mock
→ Review results and analysis for the active program

Backend logic computes scoring and deterministic metrics according to configured exam rules; AI may explain results and suggest next steps but does not replace those calculations.

Exact settings for short mocks—including question counts, durations, and other settings—are undecided. Do not assume or prescribe them.

### Feedback

Provide a dedicated, easy-to-find area that a student can open to optionally submit feedback about the app, content, explanations, or suggestions. Its placement, interaction details, and submission workflow are undecided; do not invent them.

### Settings and program switching

The learner may change App Language or Exam/Study Language in settings and may switch to another supported TNPSC program later. At any time, the learner has exactly one active program. Switching replaces the previous program as the active context. All learner-facing plans, practice, difficulty selection, mock tests, analytics, recommendations, revisions, and AI Tutor context must use only the current active program; content from inactive programs must not be mixed into those features. Content and AI responses must respect the selected Exam/Study Language and the availability of approved content in that language.

**Pending decision:** Whether and how to retain a learner's progress for inactive programs has not been confirmed. If retained, it must remain separate from active-program progress.

**Undecided:** Specific setup-flow changes and exact settings for short subject-wise or topic-wise mocks have not been specified. Do not assume specific setup steps to skip or change, or short-mock question counts, durations, or other settings.

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