# MikroTik Labs

Plataforma local de laboratorios para preparacion completa de MTCNA y MTCRE.

## Objective

Preparacion completa para MTCNA y MTCRE, organizada en dos tracks:

- Track 1: MTCNA
- Track 2: MTCRE

## Structure

- `apps/backend` - API Fastify para listar, iniciar, detener, validar y completar labs
- `apps/frontend` - UI React/Vite para estudiar y operar los labs
- `packages/lab-schema` - Shared Zod schemas and TypeScript types for lab manifests
- `packages/lab-runner` - Lab execution, catalog validation, progress, and Containerlab integration
- `docs/` - Project documentation, roadmaps, and authoring guides
- `labs/` - Lab definitions, topologies, instructions, hints, solutions, resources, and checks

## Modes

| Mode | Description |
|------|-------------|
| `containerlab` | Lab runs in a Containerlab-based virtual topology |
| `quiz` | No network devices; only quiz questions |
| `physical-auto` | Real MikroTik hardware, automatically validated by the server |
| `physical-manual` | Real MikroTik hardware, validated by the user marking steps complete |

## Scripts

### Development

- `pnpm typecheck` - Type-check all packages
- `pnpm build` - Build TypeScript packages and frontend
- `pnpm test` - Validate the lab catalog
- `pnpm dev` - Start development server
- `pnpm validate:labs` - Validate lab manifests

### Operational

| Script | Purpose |
|--------|---------|
| `scripts/install-local.sh` | Install Docker, Containerlab, Node.js tools, FRP client, and KVM deps on a local Ubuntu/Debian PC |
| `scripts/install-vps.sh` | Install FRP server (`frps`) and systemd service on a VPS |
| `scripts/start-platform.sh` | Start backend, frontend, and optional FRP client in the background |
| `scripts/stop-platform.sh` | Stop backend/frontend/FRP. Pass `--destroy-lab` to also clean up labs |
| `scripts/start-lab.sh <id>` | Manually deploy a Containerlab lab from `labs/<id>/topology.clab.yml` |
| `scripts/stop-lab.sh <id>` | Manually destroy a Containerlab lab |
| `scripts/cleanup-labs.sh` | Destroy active/known labs and remove project-specific Docker resources (no global prune) |

See `docs/VPS_FRP.md` for the full FRP/local-vs-VPS workflow.
See `docs/ROUTEROS_CHR_IMAGE.md` for the local RouterOS CHR image required by Containerlab.

Default public access through the VPS uses high ports:

- Platform: `http://<VPS_PUBLIC_IP>:43180`
- r1 WinBox/SSH/WebFig: `43291`, `43221`, `43281`
- r2 WinBox/SSH/WebFig: `43292`, `43222`, `43282`
- r3 WinBox/SSH/WebFig: `43293`, `43223`, `43283`

## Workspace

This repository uses pnpm workspaces and TypeScript project references.
