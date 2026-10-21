# Backend prompt: Waitlist feature

> Paste this into the opencode session running in `/home/yash/Code/Designer's-Room/backend`.
> The frontend at `/home/yash/Code/designer-room-frontend` is already done and waiting on this API.

---

## Task

Implement a public **waitlist signup** endpoint plus an **admin listing** endpoint, following the repo's existing module conventions exactly. The frontend calls it from a `/waitlist` page that collects an email and, on success, reveals a WhatsApp community invite link (the link lives in the frontend env — the backend never sees or serves it).

## Stack facts (already in this repo — do not add or change these)

- NestJS 12, **ESM** (`"type": "module"` — relative imports need `.js` extensions)
- Prisma 7 with `@prisma/adapter-pg`, client generated to `generated/prisma/`, accessed only through a repository class that injects `PrismaService`
- Validation: global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` + **class-validator DTOs** (not zod)
- Auth: global `JwtAuthGuard` + `RolesGuard` APP_GUARDs; public routes opt out with `@Public()` from `src/auth/decorators/public.decorator.ts`; admin routes use `@Roles(Role.ADMIN)`
- Rate limiting: global `ThrottlerModule` (100/min); tighten per-route with `@Throttle({ default: { ttl: 60_000, limit: N } })` — see `AuthController`
- Global `AllExceptionsFilter` maps Prisma `P2002` → 409 and `P2025` → 404 (we will avoid relying on that for this feature; see idempotency below)
- Env validated with Joi in `src/config/env.validation.ts`; consumed via `ConfigService`
- Tests: **Vitest** — unit specs are `src/**/*.spec.ts` and instantiate services plainly with a hand-mocked repository (see `src/users/users.service.spec.ts`); e2e specs in `test/` run via `vitest.config.e2e.ts`
- Lint: `oxlint --type-aware`

## 1. Database — Prisma model

Add to `prisma/schema.prisma`, matching existing naming conventions (cuid id, camelCase fields, explicit indexes):

```prisma
model WaitlistEntry {
  id        String   @id @default(cuid())
  email     String   @unique
  source    String?
  createdAt DateTime @default(now())

  @@index([createdAt, id])
}
```

- Emails are stored **lowercased and trimmed** (normalized in the service layer, not by the DB).
- No relations to `User` — waitlist signups are anonymous pre-signups.
- Create the migration with `npm run prisma:migrate` (uses `prisma7.config.ts`; name it something like `add_waitlist`). Do not edit files under `prisma/migrations/` by hand.

## 2. New module — `src/waitlist/`

Mirror the structure of `src/roadmaps/`:

```
src/waitlist/
├── waitlist.module.ts        # imports DatabaseModule; controllers [WaitlistController]; providers [WaitlistService, WaitlistRepository]
├── waitlist.controller.ts
├── waitlist.service.ts
├── waitlist.repository.ts
└── dto/
    └── join-waitlist.dto.ts
```

Register `WaitlistModule` in `src/app.module.ts` imports.

### DTO — `dto/join-waitlist.dto.ts`

```ts
export class JoinWaitlistDto {
  @ApiProperty({ example: 'you@example.com' })
  @IsEmail()
  @MaxLength(254)
  email!: string
}
```

(Follow the existing DTO field-decoration style; the global pipe already strips anything undeclared and 400s on non-whitelisted keys.)

### Controller contract (must match the frontend exactly)

**`POST /waitlist`** — public

- `@Public()` (global JWT guard would otherwise reject anonymous callers; the frontend sends no token)
- `@Throttle({ default: { ttl: 60_000, limit: 5 } })` — 5 signups/min/IP, mirroring the auth controller's tightening
- Body: `{ email: string }` validated by `JoinWaitlistDto`
- **Response: `201` with body `{ ok: true }`**
- **Idempotent:** submitting an email that is already on the list must return the *same* `201 { ok: true }` — never a 409, never reveal whether the email existed (no enumeration). Implement via `upsert` in the repository (`update: {}` no-op) or by catching `P2002` inside the service; do not let it bubble to the global filter.
- Service normalizes: `email.trim().toLowerCase()` before persistence.
- `source` is optional metadata — accept an optional `source` field in the DTO (`@IsOptional() @IsString() @MaxLength(50)`) defaulting to `'waitlist-page'` so the origin can be tracked later; do not require the frontend to send it.

**`GET /admin/waitlist`** — admin only

- Behind the default auth guards + `@Roles(Role.ADMIN)` (follow the existing admin controller convention in this repo)
- Cursor pagination identical in shape to `PaginateRoadmapsDto` (`cursor?`, `limit?` default 20 max 100), returning `{ items, nextCursor }`
- Item shape: `{ id, email, source, createdAt }` — select only those fields in the repository

### Service / repository

- `WaitlistService` throws Nest HTTP exceptions (`NotFoundException`, `BadRequestException`, etc.) and stays thin; all Prisma access lives in `WaitlistRepository` (injects `PrismaService`, uses `this.prisma.client.waitlistEntry.…` with explicit `select`).
- Repository methods: `create(email, source)` / `upsertIfAbsent(email, source)`, `findByCursor({ cursor, limit })` (use the `take = limit + 1` pattern from `RoadmapsRepository` to compute `nextCursor`).

### Swagger

`@ApiTags('waitlist')` on the controller; `@ApiCreatedResponse` on the join route documenting `{ ok: true }`; `@ApiBadRequestResponse` for invalid email; `@ApiUnauthorizedResponse`/`@ApiForbiddenResponse` on the admin route. Do not add `@ApiBearerAuth` decorations that don't already exist elsewhere in the repo — copy whatever the existing admin controllers do.

## 3. CORS / env

- **No new env vars are required** — the WhatsApp invite link is a frontend concern (`VITE_WHATSAPP_LINK`).
- Verify `main.ts` CORS config allows the frontend dev origin with `credentials: true` (the frontend axios instance runs `withCredentials: true`). If origins are env-driven, confirm the frontend origin is already covered; if not, note it in your summary rather than inventing new env names — follow whatever pattern `env.validation.ts` already uses if a var must be added.

## 4. Tests (required)

- `src/waitlist/waitlist.service.spec.ts` — Vitest, plain instantiation with a hand-mocked `WaitlistRepository` (match `users.service.spec.ts` style). Cover:
  - normalizes email (trim + lowercase) before delegating to the repository
  - returns `{ ok: true }` on first join
  - returns `{ ok: true }` when the repository indicates the email already existed (idempotent path)
- Optional but welcome: an e2e spec in `test/` exercising `POST /waitlist` (valid email → 201; duplicate → 201; malformed body → 400; >5 rapid calls → 429).
- Run: `npm test` (and `npm run test:e2e` if you add e2e). Also run the type check/build script the repo defines and `npm run lint` if present.

## 5. Acceptance criteria

- [ ] `POST /waitlist` with `{ "email": "Foo@Example.com " }` → `201 { "ok": true }`, stores `foo@example.com`
- [ ] Repeating the same request → still `201 { "ok": true }`, exactly one row
- [ ] `POST /waitlist` with `{ "email": "nope" }` → `400` (global ValidationPipe)
- [ ] `POST /waitlist` with an extra undeclared field → `400` (`forbidNonWhitelisted`)
- [ ] Anonymous `POST /waitlist` works (route is `@Public()`)
- [ ] More than 5 posts from the same IP within a minute → `429`
- [ ] `GET /admin/waitlist` requires a valid JWT **and** `ADMIN` role; returns cursor-paginated `{ items, nextCursor }`
- [ ] Migration applies cleanly; `prisma generate` output compiles
- [ ] Unit tests pass; no lint or type errors

## Constraints

- Do not touch anything under `src/auth/`, `src/users/`, or existing models/migrations.
- Do not add dependencies.
- Match the repo's code style (decorators, repository isolation, exception types, Swagger usage) — when in doubt, copy the nearest existing example rather than inventing a pattern.
