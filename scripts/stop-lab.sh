#!/usr/bin/env bash
set -euo pipefail

# stop-lab.sh
# Manual debug wrapper to destroy a Containerlab lab by ID.
# Usage: ./scripts/stop-lab.sh <lab-id>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

log() { echo "[stop-lab] $*"; }
warn() { echo "[stop-lab] WARN: $*" >&2; }

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <lab-id>" >&2
  exit 1
fi

LAB_ID="$1"
LAB_DIR="${REPO_ROOT}/labs/${LAB_ID}"
TOPO="${LAB_DIR}/topology.clab.yml"

if [ ! -d "${LAB_DIR}" ]; then
  echo "ERROR: Lab directory not found: ${LAB_DIR}" >&2
  exit 1
fi

if [ ! -f "${TOPO}" ]; then
  echo "ERROR: Topology file not found: ${TOPO}" >&2
  exit 1
fi

# ------------------------------------------------------------------
# Destroy
# ------------------------------------------------------------------
if ! command -v containerlab >/dev/null 2>&1; then
  echo "ERROR: containerlab is not installed." >&2
  exit 1
fi

log "Destroying lab '${LAB_ID}'..."
containerlab destroy --topo "${TOPO}" --cleanup

# ------------------------------------------------------------------
# Clear active-lab tracker if it matches
# ------------------------------------------------------------------
ACTIVE_LAB_FILE="${REPO_ROOT}/data/active-lab"
if [ -f "${ACTIVE_LAB_FILE}" ] && [ "$(cat "${ACTIVE_LAB_FILE}")" = "${LAB_ID}" ]; then
  rm -f "${ACTIVE_LAB_FILE}"
  log "Cleared active-lab tracker."
fi

log "Done."
