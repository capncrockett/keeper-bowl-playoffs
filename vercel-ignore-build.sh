#!/bin/bash
set -euo pipefail

echo "VERCEL_ENV: ${VERCEL_ENV:-<unset>}"
echo "VERCEL_GIT_COMMIT_REF: ${VERCEL_GIT_COMMIT_REF:-<unset>}"

# Safety rails:
# - Never skip production builds (prevents "main merged but prod didn't update" surprises).
# - If VERCEL_GIT_COMMIT_REF is missing for any reason, do NOT skip (proceed with build).
if [[ "${VERCEL_ENV:-}" == "production" ]]; then
  echo "✅ Production build: always allowed"
  exit 1  # proceed with build
fi

if [[ -z "${VERCEL_GIT_COMMIT_REF:-}" ]]; then
  echo "✅ Commit ref missing: defaulting to build"
  exit 1  # proceed with build
fi

# Allow builds only for:
# - main
# - any branch starting with "release/"
if [[ "${VERCEL_GIT_COMMIT_REF}" == "main" || "${VERCEL_GIT_COMMIT_REF}" == release/* ]]; then
  echo "✅ Build allowed for branch: ${VERCEL_GIT_COMMIT_REF}"
  exit 1  # proceed with build
fi

echo "⏭️  Skipping build for branch: ${VERCEL_GIT_COMMIT_REF}"
exit 0      # skip build
