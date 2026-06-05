#!/usr/bin/env bash
set -euo pipefail

# install-vps.sh
# Idempotent setup for Ubuntu/Debian VPS to run frps.
# Does NOT start the platform or any lab.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRP_VERSION="${FRP_VERSION:-}"
FRP_ARCH="${FRP_ARCH:-linux_amd64}"
OPEN_FIREWALL="${OPEN_FIREWALL:-0}"

log() { echo "[install-vps] $*"; }
warn() { echo "[install-vps] WARN: $*" >&2; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# ------------------------------------------------------------------
# Base tools
# ------------------------------------------------------------------
log "Updating package lists..."
sudo apt-get update -y

sudo apt-get install -y --no-install-recommends \
  jq curl ca-certificates git || warn "Some base packages could not be installed"

# ------------------------------------------------------------------
# FRP server (frps)
# ------------------------------------------------------------------
FPS_BIN="/usr/local/bin/frps"
if [ -x "${FPS_BIN}" ]; then
  log "FRP server already installed at ${FPS_BIN}: $(frps -v 2>/dev/null || true)"
else
  log "Installing FRP server (frps)..."

  if [ -z "${FRP_VERSION}" ]; then
    log "Fetching latest FRP release version from GitHub..."
    FRP_VERSION="$(curl -fsSL https://api.github.com/repos/fatedier/frp/releases/latest | jq -r '.tag_name')"
  fi

  FRP_TARBALL="frp_${FRP_VERSION#v}_${FRP_ARCH}.tar.gz"
  FRP_URL="https://github.com/fatedier/frp/releases/download/${FRP_VERSION}/${FRP_TARBALL}"
  TMPDIR="$(mktemp -d)"
  trap 'rm -rf "${TMPDIR}"' EXIT

  log "Downloading ${FRP_URL} ..."
  curl -fsSL -o "${TMPDIR}/${FRP_TARBALL}" "${FRP_URL}"
  tar -xzf "${TMPDIR}/${FRP_TARBALL}" -C "${TMPDIR}"

  FRPS_SRC="${TMPDIR}/frp_${FRP_VERSION#v}_${FRP_ARCH}/frps"
  if [ ! -f "${FRPS_SRC}" ]; then
    FRPS_SRC="$(find "${TMPDIR}" -name frps -type f | head -n1)"
  fi

  sudo install -m 755 "${FRPS_SRC}" "${FPS_BIN}"
  log "frps installed to ${FPS_BIN}: $(frps -v 2>/dev/null || true)"
fi

# ------------------------------------------------------------------
# Config directory and frps.toml
# ------------------------------------------------------------------
sudo mkdir -p /etc/frp

FRPS_CONFIG="/etc/frp/frps.toml"
if [ -f "${FRPS_CONFIG}" ]; then
  log "${FRPS_CONFIG} already exists, leaving untouched."
else
  if [ -f "${REPO_ROOT}/config/frps.toml.example" ]; then
    sudo cp "${REPO_ROOT}/config/frps.toml.example" "${FRPS_CONFIG}"
    log "Created ${FRPS_CONFIG} from config/frps.toml.example."
  else
    log "Creating default ${FRPS_CONFIG} (inline fallback)..."
    sudo tee "${FRPS_CONFIG}" >/dev/null <<'EOF'
bindPort = 7000
vhostHTTPPort = 8080
token = "CHANGE_ME_TO_A_STRONG_TOKEN"
EOF
    log "Created default ${FRPS_CONFIG}."
  fi
fi

# ------------------------------------------------------------------
# Systemd service
# ------------------------------------------------------------------
SERVICE_FILE="/etc/systemd/system/frps.service"
log "Installing systemd service: ${SERVICE_FILE}"
sudo tee "${SERVICE_FILE}" >/dev/null <<EOF
[Unit]
Description=FRP Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.toml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now frps
log "frps service enabled and started."

# ------------------------------------------------------------------
# Firewall guidance
# ------------------------------------------------------------------
log "--- Firewall guidance ---"

# Determine ports from frps.toml
BIND_PORT=""
VHOST_PORT=""
if command_exists frps && [ -f "${FRPS_CONFIG}" ]; then
  # Best-effort extraction using grep/sed
  BIND_PORT="$(grep -E '^bindPort\s*=' "${FRPS_CONFIG}" | sed -E 's/.*=\s*([0-9]+).*/\1/' | head -n1)"
  VHOST_PORT="$(grep -E '^vhostHTTPPort\s*=' "${FRPS_CONFIG}" | sed -E 's/.*=\s*([0-9]+).*/\1/' | head -n1)"
fi
BIND_PORT="${BIND_PORT:-7000}"
VHOST_PORT="${VHOST_PORT:-8080}"

PROXY_PORTS=""
if [ -f "${FRPS_CONFIG}" ]; then
  # Extract custom proxy ports from array syntax like localPort = 3001
  PROXY_PORTS="$(grep -E 'localPort\s*=' "${FRPS_CONFIG}" | sed -E 's/.*=\s*([0-9]+).*/\1/' | sort -u | tr '\n' ' ')"
fi

echo "Open these ports in your VPS firewall/Security Group:"
echo "  - ${BIND_PORT}  (frps control port)"
if [ -n "${VHOST_PORT}" ]; then
  echo "  - ${VHOST_PORT}  (frps vhost HTTP port)"
fi
if [ -n "${PROXY_PORTS}" ]; then
  echo "  - ${PROXY_PORTS} (configured proxy ports)"
fi

if command_exists ufw; then
  echo ""
  echo "ufw is installed. To open the ports automatically, re-run with OPEN_FIREWALL=1:"
  echo "  sudo OPEN_FIREWALL=1 ./scripts/install-vps.sh"
  if [ "${OPEN_FIREWALL}" = "1" ]; then
    log "OPEN_FIREWALL=1 detected. Opening ports with ufw..."
    sudo ufw allow "${BIND_PORT}/tcp" || warn "Failed to open ${BIND_PORT}"
    if [ -n "${VHOST_PORT}" ]; then
      sudo ufw allow "${VHOST_PORT}/tcp" || warn "Failed to open ${VHOST_PORT}"
    fi
    for pp in ${PROXY_PORTS}; do
      sudo ufw allow "${pp}/tcp" || warn "Failed to open ${pp}"
    done
    log "ufw rules added."
  fi
else
  echo "ufw is not installed. Use your provider's firewall / security group to open the above ports."
fi

log "VPS install complete."
log "Remember to change the token in ${FRPS_CONFIG} and set a strong secret."
