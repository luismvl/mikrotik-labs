#!/usr/bin/env bash
set -euo pipefail

# install-local.sh
# Idempotent setup for Ubuntu/Debian local PC/server.
# Does NOT start the platform or any lab.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

FRP_VERSION="${FRP_VERSION:-}"
FRP_ARCH="${FRP_ARCH:-linux_amd64}"

log() { echo "[install-local] $*"; }
warn() { echo "[install-local] WARN: $*" >&2; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# ------------------------------------------------------------------
# Base tools
# ------------------------------------------------------------------
log "Updating package lists..."
sudo apt-get update -y

PACKAGES="jq curl ca-certificates git iproute2"
if apt-cache show network-manager >/dev/null 2>&1; then
  PACKAGES="${PACKAGES} network-manager"
fi

log "Installing base packages if needed: ${PACKAGES}..."
sudo apt-get install -y --no-install-recommends ${PACKAGES} || warn "Some base packages could not be installed"

# ------------------------------------------------------------------
# Node.js (>=20) and pnpm via corepack
# ------------------------------------------------------------------
if ! command_exists node; then
  warn "Node.js not found. Please install Node.js >=20 (e.g., via NodeSource or nvm)."
  warn "After installing Node.js, re-run this script so corepack/pnpm can be enabled."
else
  NODE_MAJOR="$(node -v | sed -E 's/v([0-9]+).*/\1/')"
  if [ "${NODE_MAJOR}" -lt 20 ]; then
    warn "Node.js version is ${NODE_MAJOR}. Please upgrade to >=20."
  else
    log "Node.js version OK: $(node -v)"
    if ! command_exists pnpm; then
      log "Enabling corepack and pnpm..."
      sudo corepack enable || true
      corepack prepare pnpm@latest --activate || true
    fi
    if command_exists pnpm; then
      log "pnpm version: $(pnpm -v)"
    else
      warn "pnpm still not available after corepack setup."
    fi
  fi
fi

# ------------------------------------------------------------------
# Docker
# ------------------------------------------------------------------
if command_exists docker; then
  log "Docker already installed: $(docker --version)"
else
  log "Installing Docker..."
  # Official Docker install script via get.docker.com
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "${USER}" || warn "Could not add user to docker group"
fi

# ------------------------------------------------------------------
# Containerlab
# ------------------------------------------------------------------
if command_exists containerlab; then
  log "Containerlab already installed: $(containerlab version | head -n1)"
else
  log "Installing Containerlab..."
  # Official installer: https://get.containerlab.dev (community) or containerlab.dev/setup
  # The community install script is the quickest idempotent path.
  # Docs: https://containerlab.dev/install/
  bash -c "$(curl -sL https://get.containerlab.dev)" || {
    warn "Community installer failed; trying containerlab.dev/setup fallback..."
    curl -sL https://containerlab.dev/setup | sudo -E bash -s all
  }
fi

# ------------------------------------------------------------------
# FRP client (frpc)
# ------------------------------------------------------------------
FPC_BIN="/usr/local/bin/frpc"
if [ -x "${FPC_BIN}" ]; then
  log "FRP client already installed at ${FPC_BIN}: $(frpc -v 2>/dev/null || true)"
else
  log "Installing FRP client (frpc)..."

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

  FRPC_SRC="${TMPDIR}/frp_${FRP_VERSION#v}_${FRP_ARCH}/frpc"
  if [ ! -f "${FRPC_SRC}" ]; then
    # Some releases may have a different folder name
    FRPC_SRC="$(find "${TMPDIR}" -name frpc -type f | head -n1)"
  fi

  sudo install -m 755 "${FRPC_SRC}" "${FPC_BIN}"
  log "frpc installed to ${FPC_BIN}: $(frpc -v 2>/dev/null || true)"
fi

# ------------------------------------------------------------------
# QEMU / KVM dependencies
# ------------------------------------------------------------------
log "Installing QEMU/KVM dependencies..."
sudo apt-get install -y --no-install-recommends \
  qemu-kvm qemu-utils libvirt-daemon-system libvirt-clients \
  bridge-utils virtinst || warn "Some QEMU/KVM packages could not be installed"

# ------------------------------------------------------------------
# Verify /dev/kvm and user groups
# ------------------------------------------------------------------
if [ -c /dev/kvm ]; then
  log "/dev/kvm exists"
else
  warn "/dev/kvm is missing. Ensure virtualization (VT-x/AMD-V) is enabled in BIOS."
fi

for grp in docker kvm libvirt; do
  if groups "${USER}" | grep -qw "${grp}"; then
    log "User is in '${grp}' group."
  else
    warn "User is NOT in '${grp}' group. If needed, run: sudo usermod -aG ${grp} ${USER}"
    warn "Then log out and back in for group changes to take effect."
  fi
done

# ------------------------------------------------------------------
# Project base directories
# ------------------------------------------------------------------
log "Creating project base directories..."
mkdir -p "${REPO_ROOT}/logs"
mkdir -p "${REPO_ROOT}/data"
mkdir -p "${REPO_ROOT}/config"

if [ ! -f "${REPO_ROOT}/config/frpc.toml" ]; then
  if [ -f "${REPO_ROOT}/config/frpc.toml.example" ]; then
    cp "${REPO_ROOT}/config/frpc.toml.example" "${REPO_ROOT}/config/frpc.toml"
    log "Created config/frpc.toml from example."
  else
    warn "config/frpc.toml.example is missing; cannot create config/frpc.toml."
  fi
else
  log "config/frpc.toml already exists, leaving untouched."
fi

log "Local install complete."
log "Next steps:"
log "  1. Review config/frpc.toml and set your VPS serverAddr / token."
log "  2. Run: pnpm install"
log "  3. Run: ./scripts/start-platform.sh"
