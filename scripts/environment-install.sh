#!/usr/bin/env bash
set -euo pipefail
cd /workspace/Digital-Girl
export XDG_CACHE_HOME=/workspace/.cache
export NUMBA_CACHE_DIR=/workspace/.cache/numba
export PIP_CACHE_DIR=/workspace/.cache/pip
mkdir -p "$XDG_CACHE_HOME" "$NUMBA_CACHE_DIR" "$PIP_CACHE_DIR"
command -v node >/dev/null
command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
test -x /usr/bin/chromium
if [ ! -x /workspace/.venv-digital-girl/bin/python ]; then
  python -m venv /workspace/.venv-digital-girl
fi
/workspace/.venv-digital-girl/bin/python -m pip install -r requirements.lock.txt
npm ci --cache=/workspace/.cache/npm
npm run analyze
npm run typecheck
node scripts/render.mjs frames 0.45 44.9 123 187.5
