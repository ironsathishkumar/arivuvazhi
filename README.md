# ArivuVazhi (அறிவுவழி)

AI-powered government exam preparation platform. Product and architecture docs live in [`ArivuVazhi-Documents/`](ArivuVazhi-Documents/README.md).

## Repository layout

| Path | What it is |
|---|---|
| `apps/api` | Node.js + Express 5 + TypeScript backend (modular monolith, MongoDB via Mongoose) |
| `packages/shared` | Roles/permissions and Zod schemas shared by the API, admin portal and mobile app |
| `apps/admin` | Next.js admin portal — *not started yet* |
| `apps/mobile` | React Native (Expo) student app — *not started yet* |

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # then set MONGODB_URI and JWT_ACCESS_SECRET
pnpm seed                                # super admin + TNPSC Group 4 structure + sample questions
pnpm dev:api                             # http://localhost:4000/api/v1
```

For a local database instead of Atlas: `docker compose up -d mongodb` and use
`MONGODB_URI=mongodb://localhost:27017/arivuvazhi?directConnection=true`.
`docker compose --profile ai up -d ollama` starts Ollama for the AI layer.

## Scripts

- `pnpm test` — unit + integration tests (in-memory MongoDB; never touches your real database)
- `pnpm typecheck` — TypeScript 7 type-check across packages
- `pnpm build` — compile shared + API to `dist/`

## API overview (`/api/v1`)

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` |
| Users (staff) | `GET/POST /users`, `PATCH /users/:id` |
| Student | `PATCH /students/me/profile` |
| Exams | `GET/POST /exams`, `GET/PATCH /exams/:id`, `GET /exams/:id/tree` |
| Hierarchy | `GET/POST /subjects`, `/topics`, `/sub-topics` (+ `PATCH /:id`) |
| Questions | `GET/POST /questions`, `GET/PATCH /questions/:id`, `POST /questions/:id/status` |
| Practice | `GET/POST /practice/sessions`, `GET /practice/sessions/:id`, `POST .../answers`, `POST .../complete` |
| Audit | `GET /audit-logs` |

Responses use `{ data, meta? }` on success and `{ error: { code, message, details?, requestId } }` on failure.
