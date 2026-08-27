# 04 — Backlog

Status: `TODO` · `WIP` · `DONE` · `BLOCKED`

## Fase 0 — Baseline verde

| ID | Status | Task | Aceite |
|---|---|---|---|
| T0.1 | TODO | Restaurar `src/app.js` para estado que carrega (remover `app.route/app.user`, `createAlunoController`, imports mortos) | `node -e "require('./src/app')"` sem erro |
| T0.2 | TODO | Confirmar `npm test` verde com a suíte atual (`health.test.js`) | 3 testes passando |
| T0.3 | TODO | `git add` de `package.json`/`package-lock.json` (zod) — decidir se commita agora | working tree limpo ou stage coerente |

## Fase 1 — Fundação

| ID | Status | Task | Aceite |
|---|---|---|---|
| T1.1 | TODO | `src/errors/AppError.js` (`status`, `code`, `message`, `details`) | instanciável; `instanceof Error` |
| T1.2 | TODO | `src/middlewares/errorHandler.js` + `notFound.js` (envelope, trata `ZodError`) | 404 e 500 saem no envelope novo |
| T1.3 | TODO | `src/config/database.js` (`connect`/`disconnect`) e refatorar `server.js`/`seed.js` para usar | `npm run seed` e `npm run dev` funcionam |
| T1.4 | TODO | `src/routes/index.js` como Router raiz; `app.js` monta `app.use(routes)` + middlewares | rotas atuais seguem respondendo |
| T1.5 | TODO | Mover `/health` e `/courses` para `controllers/` + `routes/` | testes atuais continuam verdes |

## Fase 2 — Domínio puro + testes unitários

| ID | Status | Task | Aceite |
|---|---|---|---|
| T2.1 | TODO | `src/domain/scholarship.js` (export `scholarship`) | — |
| T2.2 | TODO | `tests/unit/scholarship.test.js` — fronteiras `0`, `2824.00`, `2824.01`, `5648.00`, `5648.01` | verde |
| T2.3 | TODO | `src/domain/age.js` (export `ageOn`) | — |
| T2.4 | TODO | `tests/unit/age.test.js` — véspera / dia / pós aniversário; 29/02 | verde |

## Fase 3 — Students

| ID | Status | Task | Aceite |
|---|---|---|---|
| T3.1 | TODO | Criar `src/models/Student.js` (coleção `students`; `required` no email, `min:0` renda, `dataNascimento` String, índices unique, lowercase) e remover `src/models/Aluno.js` do WIP | `Student.init()` cria índices |
| T3.2 | TODO | `src/validation/studentSchema.js` (zod): obrigatórios, sem string vazia, CPF→11 dígitos, email formato+trim+lower, data `YYYY-MM-DD` não-futura, renda `>=0` 2 casas | schema rejeita casos inválidos |
| T3.3 | TODO | `repositories/studentRepository.js` (`create`, `findById`, `findByCpf`, `findByEmail`, `list`) | — |
| T3.4 | TODO | `services/studentService.js` (normaliza, checa unicidade → `AppError` 409, trata `E11000`) | — |
| T3.5 | TODO | `controllers/studentController.js` + `routes/studentRoutes.js` (`POST /students` 201, `GET /students` 200) | — |
| T3.6 | TODO | `tests/integration/students.test.js` — válido 201; CPF dup 409; email dup (case/space) 409; inválido 400 | verde |

## Fase 4 — Matrículas

| ID | Status | Task | Aceite |
|---|---|---|---|
| T4.1 | TODO | `src/models/Enrollment.js` — schema, enum, snapshot, índice único parcial, índice de fila | `Enrollment.init()` cria índices |
| T4.2 | TODO | `repositories/enrollmentRepository.js` — `create`, `findById`, `existsActive`, `list(filtros)`, `cancelIfActive`, `promoteFirstInQueue` | — |
| T4.3 | TODO | `repositories/courseRepository.js` — `findById`, `claimSeat`, `releaseSeat` (updates atômicos do [03-plan.md](03-plan.md)) | — |
| T4.4 | TODO | `validation/enrollmentSchema.js` — body (`alunoId`,`cursoId`) + query (`cursoId`,`alunoId`,`status`) | ObjectId malformado → 400 |
| T4.5 | TODO | `services/enrollmentService.js` — sequência de 10 passos do plano (400/404/422/409, bolsa, claimSeat, compensação) | — |
| T4.6 | TODO | `controllers/enrollmentController.js` + `routes/enrollmentRoutes.js` — `POST /enrollments` 201, `GET /enrollments` 200 | — |
| T4.7 | TODO | `tests/integration/enrollments.test.js` — confirmada; fila; 422 idade; 422 curso encerrado; 404 aluno/curso; 400 objectid; 409 duplicada; matrícula pós-cancelamento | verde |

## Fase 5 — Cancelamento e repescagem

| ID | Status | Task | Aceite |
|---|---|---|---|
| T5.1 | TODO | `services/enrollmentService.js#cancel` — sequência do plano (porta única `cancelIfActive`, promoção FIFO, `releaseSeat`) | — |
| T5.2 | TODO | `PATCH /enrollments/:id/cancel` no controller/route — 200/400/404 | — |
| T5.3 | TODO | `tests/integration/cancel.test.js` — confirmada+fila→promove e `vagasOcupadas` estável; confirmada sem fila→`-1`; fila→sem efeito; já cancelada→200 sem efeito; 404 | verde |

## Fase 6 — Concorrência (diferencial)

| ID | Status | Task | Aceite |
|---|---|---|---|
| T6.1 | TODO | `tests/integration/concurrency.test.js` — 1 vaga + 2 `POST` simultâneos → 1 `CONFIRMADA` / 1 `FILA_ESPERA` / contador == capacidade (INV-4) | verde |
| T6.2 | TODO | mesmo arquivo — 2 `cancel` simultâneos na mesma confirmada → 1 decremento / 1 promoção (INV-5) | verde |

## Fase 7 — Documentação

| ID | Status | Task | Aceite |
|---|---|---|---|
| T7.1 | TODO | Seção "Decisões" no `README.md`: (1) responsabilidades e por quê; (2) proteção de capacidade concorrente; (3) prevenção de duplicidade ativa; (4) limitações/trade-offs; (5) o que faria diferente em produção | seção presente, referencia `specs/` |
| T7.2 | TODO | Nota no README sobre a decisão do `cancel` idempotente (`200` em já cancelada) | presente |

## Rastreio de invariantes → testes

| Invariante | Coberta por |
|---|---|
| INV-1 / INV-2 | T4.7, T5.3, T6.1 |
| INV-3 | T4.7 (409 duplicada), T6.1 |
| INV-4 | T6.1 |
| INV-5 | T6.2 |
| INV-6 | T5.3 (promoção FIFO) |
| INV-7 | T4.7 (snapshot no corpo da resposta) |
| INV-8 | T2.4 |

## Ordem de execução sugerida

`Fase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7`. Fases 2 e 3 são paralelizáveis. Não avançar de fase com a suíte vermelha.
