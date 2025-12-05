# Linting TODO

Context: ESLint is now running with `typescript-eslint` strict type-checked configs (project-based). Remaining work to reach a clean lint run:

- **Template literal inputs**: Explicitly stringify numbers (and other non-strings) before interpolation in API/client code (e.g., `frontend/src/api/espn.ts`, `frontend/src/api/sleeper.ts`, `frontend/src/components/bracket/*`, `frontend/src/pages/*`, `frontend/src/utils/**`).
- **Arrow shorthand returning void**: Expand arrow functions that currently return `console`/void expressions in components/pages to block bodies (several occurrences in `frontend/src/components`, `frontend/src/pages`).
- **Optionality checks**: Remove or refactor unnecessary null/undefined checks and optional chains where types are non-nullish; tighten types instead when needed (`frontend/src/components/common/TeamAvatars.tsx`, `frontend/src/utils/sleeperTransforms.ts`, `frontend/src/utils/applyMatchupScores.ts`, etc.).
- **Union clean-up**: Fix redundant string literal unions and related type issues in `frontend/src/api/sleeper.ts`.
- **Redundant conversions/assertions**: Remove no-op `Number()` calls and unnecessary type assertions in `frontend/src/utils/sleeperTransforms.ts`.
- **Remaining bracket formatting**: Ensure bracket components/tests format IDs/labels without violating `restrict-template-expressions`.

Testing-related lint issues in the test suite and setup have been addressed on this branch; remaining items are in production code paths above.
