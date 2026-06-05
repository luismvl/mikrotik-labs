#!/usr/bin/env bash
set -euo pipefail

# cleanup-labs.sh
# Destroy project labs and remove project-specific Docker resources.
# Never runs docker system prune.
# Works even if containerlab is missing (prints warnings).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

log() { echo "[cleanup-labs] $*"; }
warn() { echo "[cleanup-labs] WARN: $*" >&2; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# ------------------------------------------------------------------
# Destroy active lab if tracked
# ------------------------------------------------------------------
ACTIVE_LAB_FILE="${REPO_ROOT}/data/active-lab"
if [ -f "${ACTIVE_LAB_FILE}" ]; then
  ACTIVE_LAB="$(cat "${ACTIVE_LAB_FILE}")"
  if [ -n "${ACTIVE_LAB}" ]; then
    ACTIVE_TOPO="${REPO_ROOT}/labs/${ACTIVE_LAB}/topology.clab.yml"
    if [ -f "${ACTIVE_TOPO}" ]; then
      if command_exists containerlab; then
        log "Destroying active lab '${ACTIVE_LAB}'..."
        containerlab destroy --topo "${ACTIVE_TOPO}" --cleanup || warn "Failed to destroy active lab"
      else
        warn "containerlab not found; cannot destroy active lab '${ACTIVE_LAB}'."
      fi
    else
      warn "Active lab topology missing: ${ACTIVE_TOPO}"
    fi
  fi
  rm -f "${ACTIVE_LAB_FILE}"
  log "Removed active-lab tracker."
fi

# ------------------------------------------------------------------
# Discover and destroy all known lab topologies (best effort)
# ------------------------------------------------------------------
if [ -d "${REPO_ROOT}/labs" ]; then
  for topo in "${REPO_ROOT}"/labs/*/topology.clab.yml; do
    [ -f "${topo}" ] || continue
    lab_dir="$(dirname "${topo}")"
    lab_name="$(basename "${lab_dir}")"
    if command_exists containerlab; then
      log "Attempting destroy for lab '${lab_name}'..."
      containerlab destroy --topo "${topo}" --cleanup 2>/dev/null || warn "No running lab for '${lab_name}' or destroy failed"
    else
      warn "containerlab not found; skipping destroy for '${lab_name}'."
    fi
  done
fi

# ------------------------------------------------------------------
# Remove Docker containers belonging to this project
# ------------------------------------------------------------------
if command_exists docker; then
  log "Removing project-related Docker containers..."
  # Containers with names matching clab-* or containing lab directory names
  PROJECT_NAMES="mikrotik-labs"
  for lab_dir in "${REPO_ROOT}"/labs/*/; do
    [ -d "${lab_dir}" ] || continue
    lab_name="$(basename "${lab_dir}")"
    PROJECT_NAMES="${PROJECT_NAMES}|${lab_name}"
  done

  docker ps -aq 2>/dev/null | while read -r cid; do
    [ -n "${cid}" ] || continue
    cname="$(docker inspect --format='{{.Name}}' "${cid}" 2>/dev/null | sed 's/^\///')"
    # Only remove if name contains a known project/lab token
    if echo "${cname}" | grep -qiE "(${PROJECT_NAMES})"; then
      log "Removing container ${cname} (${cid})"
      docker rm -f "${cid}" >/dev/null 2>&1 || warn "Could not remove container ${cid}"
    fi
  done

  log "Removing project-related Docker networks..."
  docker network ls --format '{{.Name}}' 2>/dev/null | while read -r net; do
    [ -n "${net}" ] || continue
    if echo "${net}" | grep -qiE "(${PROJECT_NAMES})"; then
      log "Removing network ${net}"
      docker network rm "${net}" >/dev/null 2>&1 || warn "Could not remove network ${net}"
    fi
  done
else
  warn "docker not found; skipping Docker cleanup."
fi

log "Project cleanup complete. No global docker system prune was performed."
