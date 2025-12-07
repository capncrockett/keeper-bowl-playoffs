#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# Allow builds only for:
# - main (production)
# - any branch starting with "release/"
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == release/* ]]; then
  echo "✅ Build allowed for branch: $VERCEL_GIT_COMMIT_REF"
  exit 1      # proceed with build
fi

echo "⏭️  Skipping build for branch: $VERCEL_GIT_COMMIT_REF"
exit 0        # skip build
