# Project Overview

## Objective

Complete preparation for MTCNA and MTCRE, with Track 1 MTCNA and Track 2 MTCRE.

## Structure

- `apps/backend` - Fastify API for lab catalog, lab lifecycle, validation, and progress
- `apps/frontend` - React/Vite study interface for operating labs
- `packages/lab-schema` - Shared schemas and types for lab manifests
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

## Priorities

1. Practical labs that reflect real-world MikroTik scenarios
2. Automatic validation where possible to give immediate feedback
3. WinBox access so users can practice with the real management tool
4. Resources per lab (docs, videos, search terms) so learners can self-correct
5. Visible progress so users stay motivated
6. Clean frontend that stays out of the way
7. Minimal infrastructure so the project remains easy to run and maintain

## Deprioritized

- Authentication and user accounts
- Multi-user support
- Role-based access control
- PostgreSQL
- Redis
- Server-side rendering (SSR)
- Job queues
- Unnecessary scripts and automation

## Technology

- pnpm workspaces
- TypeScript
- Zod for schema validation
