#!/usr/bin/env bash
set -euo pipefail

# start-platform.sh
# Start the development platform (backend + frontend + optional frpc).
# Must be run from the repo root.
# Does NOT start any lab.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

log() { echo "[start-platform] $*"; }
warn() { echo "[start-platform] WARN: $*" >&2; }

# ------------------------------------------------------------------
# Preconditions
# ------------------------------------------------------------------
if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is not installed. Please run: corepack enable && corepack prepare pnpm@latest --activate" >&2
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules not found. Please run: pnpm install" >&2
  exit 1
fi

# ------------------------------------------------------------------
# Prepare directories
# ------------------------------------------------------------------
mkdir -p "${REPO_ROOT}/logs"
mkdir -p "${REPO_ROOT}/data/pids"

PID_DIR="${REPO_ROOT}/data/pids"
LOG_DIR="${REPO_ROOT}/logs"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

# ------------------------------------------------------------------
# Helper: start background process with nohup
# ------------------------------------------------------------------
start_bg() {
  local name="$1"
  shift
  local pidfile="${PID_DIR}/${name}.pid"
  local logfile="${LOG_DIR}/${name}.log"

  if [ -f "${pidfile}" ] && kill -0 "$(cat "${pidfile}")" 2>/dev/null; then
    warn "${name} already running (pid $(cat "${pidfile}")). Skipping."
    return 0
  fi

  log "Starting ${name}..."
  if command -v setsid >/dev/null 2>&1; then
    setsid "$@" >>"${logfile}" 2>&1 &
  else
    nohup "$@" >>"${logfile}" 2>&1 &
  fi
  local pid=$!
  echo "${pid}" > "${pidfile}"
  log "${name} started as pid ${pid}, log: ${logfile}"
}

# ------------------------------------------------------------------
# Backend dev (default 127.0.0.1:3001)
# ------------------------------------------------------------------
start_bg "backend" pnpm --filter @mikrotik-labs/backend dev

# ------------------------------------------------------------------
# Frontend dev (default 0.0.0.0:5173 via Vite)
# ------------------------------------------------------------------
start_bg "frontend" pnpm --filter @mikrotik-labs/frontend exec vite --host "${FRONTEND_HOST}" --port "${FRONTEND_PORT}"

# ------------------------------------------------------------------
# FRP client (optional)
# ------------------------------------------------------------------
FRPC_BIN="/usr/local/bin/frpc"
FRPC_CONFIG="${REPO_ROOT}/config/frpc.toml"

if [ -f "${FRPC_CONFIG}" ] && [ -x "${FRPC_BIN}" ]; then
  start_bg "frpc" "${FRPC_BIN}" -c "${FRPC_CONFIG}"
else
  if [ ! -f "${FRPC_CONFIG}" ]; then
    warn "config/frpc.toml not found; skipping frpc."
  fi
  if [ ! -x "${FRPC_BIN}" ]; then
    warn "frpc not found at ${FRPC_BIN}; skipping frpc."
  fi
fi

log "Platform started."
log "  Backend:  http://127.0.0.1:3001"
log "  Frontend: http://${FRONTEND_HOST}:${FRONTEND_PORT}"
if [ -f "${FRPC_CONFIG}" ] && [ -x "${FRPC_BIN}" ]; then
  log "  frpc:     running with ${FRPC_CONFIG}"
fi
log "Logs: ${LOG_DIR}"
log "PIDs:  ${PID_DIR}"
