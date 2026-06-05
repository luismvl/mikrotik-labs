# VPS and FRP Access

## Overview

For remote physical labs, the lab server may need to reach MikroTik devices behind NAT. FRP (Fast Reverse Proxy) is the chosen tunnel mechanism.

## Architecture

```
User Browser
     |
Lab Server (VPS)
     |
  FRP Server (runs on VPS)
     |
  FRP Client (runs near the MikroTik device)
     |
MikroTik Device
```

## Plan A: local PC with FRP client (frpc)

Use this when you run the platform on your own Ubuntu/Debian PC or server and want remote access.

1. On the VPS, run `scripts/install-vps.sh` to set up `frps` and a systemd service.
2. On the local PC, run `scripts/install-local.sh` to set up Docker, Containerlab, and `frpc`.
3. Copy `config/frpc.toml.example` to `config/frpc.toml` and fill in `serverAddr` and `token`.
4. Start the platform with `scripts/start-platform.sh`; it will auto-start `frpc` if the config exists.
5. Open the platform from outside with `http://<VPS_PUBLIC_IP>:43180`.

## Plan B: run everything on the VPS

Use this when you do not have a local Linux machine with Docker/Containerlab.

1. On the VPS, run `scripts/install-vps.sh` (still useful for FRP if you want to proxy to remote devices).
2. Optionally also run `scripts/install-local.sh` on the VPS to install Docker and Containerlab.
3. Start the platform on the VPS with `scripts/start-platform.sh`.
4. Access the frontend directly via the VPS IP and the frontend port (or reverse proxy).

## FRP Server (VPS)

- Runs `frps` with a static token via systemd (`frps.service`).
- Default control port: `43700`.
- Exposes the frontend and RouterOS access with high TCP ports.
- Public defaults:
  - Frontend: `43180`
  - r1 WinBox/SSH/WebFig: `43291`, `43221`, `43281`
  - r2 WinBox/SSH/WebFig: `43292`, `43222`, `43282`
  - r3 WinBox/SSH/WebFig: `43293`, `43223`, `43283`
- The frontend derives the public host from the browser URL, so labs do not hardcode the VPS IP.

## FRP Client

- Runs `frpc` on a small Linux host or the MikroTik device itself (if RouterOS supports).
- Connects to the VPS FRP server.
- Forwards the local frontend and active lab RouterOS service ports to the VPS.
- The backend stays local behind Vite's `/api` proxy.
- The `scripts/start-platform.sh` script auto-starts `frpc` when `config/frpc.toml` is present.

## Security

- Use strong FRP authentication tokens (change the placeholder in `config/frps.toml` and `config/frpc.toml`).
- Restrict VPS firewall to known IPs where possible.
- Rotate tokens periodically.
- Do not expose the FRP dashboard to the public internet without additional hardening.

## Script Workflow

```
VPS:
  scripts/install-vps.sh   -> installs frps, creates /etc/frp/frps.toml, starts systemd service
  (optionally) scripts/start-platform.sh   -> if you run the platform on the VPS

Local PC:
  scripts/install-local.sh -> installs Docker, Containerlab, frpc, creates config/frpc.toml
  pnpm install
  scripts/start-platform.sh -> starts backend, frontend, and frpc (if configured)
  scripts/start-lab.sh <id> -> deploys a lab manually for debugging
  scripts/stop-lab.sh <id>  -> destroys that lab
  scripts/stop-platform.sh  -> stops backend/frontend/frpc; optionally --destroy-lab
```

## Alternatives

- WireGuard tunnel between VPS and lab site
- OpenVPN for persistent site-to-site
- Direct public IP if available (preferred when possible)

## Deprioritized

- Complex multi-hop mesh tunnels
- Queue-based tunnel provisioning
- Dynamic DNS integration
