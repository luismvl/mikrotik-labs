#!/usr/bin/env bash
set -euo pipefail

# stop-platform.sh
# Stop the development platform (backend + frontend + optional frpc).
# Optionally destroy labs with --destroy-lab.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

log() { echo "[stop-platform] $*"; }
warn() { echo "[stop-platform] WARN: $*" >&2; }

DESTROY_LAB=0
for arg in "$@"; do
  case "${arg}" in
    --destroy-lab) DESTROY_LAB=1 ;;
    *) warn "Unknown argument: ${arg}" ;;
  esac
done

PID_DIR="${REPO_ROOT}/data/pids"

# ------------------------------------------------------------------
# Helper: stop by PID file
# ------------------------------------------------------------------
stop_by_pidfile() {
  local name="$1"
  local pidfile="${PID_DIR}/${name}.pid"
  if [ -f "${pidfile}" ]; then
    local pid
    pid="$(cat "${pidfile}")"
    if kill -0 "${pid}" 2>/dev/null; then
      log "Stopping ${name} (pid ${pid})..."
      kill "${pid}" || true
      sleep 1
      if kill -0 "${pid}" 2>/dev/null; then
        warn "${name} did not exit gracefully; sending SIGKILL..."
        kill -9 "${pid}" || true
      fi
    else
      log "${name} pid ${pid} is not running."
    fi
    rm -f "${pidfile}"
  else
    log "No PID file for ${name}; skipping."
  fi
}

# ------------------------------------------------------------------
# Stop processes
# ------------------------------------------------------------------
stop_by_pidfile "backend"
stop_by_pidfile "frontend"
stop_by_pidfile "frpc"

# ------------------------------------------------------------------
# Optional lab destroy
# ------------------------------------------------------------------
if [ "${DESTROY_LAB}" -eq 1 ]; then
  log "--destroy-lab passed. Calling cleanup-labs.sh..."
  if [ -x "${SCRIPT_DIR}/cleanup-labs.sh" ]; then
    "${SCRIPT_DIR}/cleanup-labs.sh"
  else
    warn "cleanup-labs.sh not found or not executable."
  fi
else
  log "Active labs were NOT destroyed (pass --destroy-lab if desired)."
fi

log "Platform stopped."
