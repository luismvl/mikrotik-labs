#!/usr/bin/env bash
set -euo pipefail

# start-lab.sh
# Manual debug wrapper to deploy a Containerlab lab by ID.
# Usage: ./scripts/start-lab.sh <lab-id>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

log() { echo "[start-lab] $*"; }
warn() { echo "[start-lab] WARN: $*" >&2; }

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
# Deploy
# ------------------------------------------------------------------
if ! command -v containerlab >/dev/null 2>&1; then
  echo "ERROR: containerlab is not installed." >&2
  exit 1
fi

log "Deploying lab '${LAB_ID}'..."
containerlab deploy --topo "${TOPO}"

# ------------------------------------------------------------------
# Track active lab
# ------------------------------------------------------------------
mkdir -p "${REPO_ROOT}/data"
echo "${LAB_ID}" > "${REPO_ROOT}/data/active-lab"
log "Active lab set to '${LAB_ID}'."
log "Done."
