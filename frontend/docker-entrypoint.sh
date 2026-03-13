#!/bin/sh
set -eu

PORT="${PORT:-8080}"
API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8000}"

cat > /app/dist/env-config.js <<EOF
window.__ENV = {
  VITE_API_BASE_URL: "${API_BASE_URL}"
};
EOF

exec serve -s /app/dist -l "${PORT}"
