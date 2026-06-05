# Lab Authoring Guide

## Lab Manifest

Every lab is defined by a `manifest.json` file conforming to the schema in `packages/lab-schema`.

### Required Fields

- `id` - Unique lab identifier (e.g., `001`, `102`)
- `title` - Human-readable title
- `track` - `MTCNA` or `MTCRE`
- `mode` - One of `containerlab`, `quiz`, `physical-auto`, `physical-manual`
- `difficulty` - One of `easy`, `medium`, `hard`, `exam`
- `topics` - List of topic tags covered by the lab
- `resources` - List of `Resource` objects
- `objectives` - List of learning objectives
- `validation` - Validation object with `type` field

### Optional Fields

- `prerequisites` - List of prerequisite lab IDs or topic strings
- `routers` - Array of router access objects
- `hardware` - Hardware requirements object

### Resources

Each resource has:
- `type` - `official-docs`, `related-topic`, `search-term`, `video`, or `article`
- `title` - Short title
- `url` - Optional URL (search-term resources may omit it)
- `description` - Optional description

### Modes

| Mode | Description |
|------|-------------|
| `containerlab` | Lab runs in a Containerlab-based virtual topology |
| `quiz` | No network devices; only quiz questions |
| `physical-auto` | Real MikroTik hardware, automatically validated by the server |
| `physical-manual` | Real MikroTik hardware, validated by the user marking steps complete |

### Validation Types

| Type | Description |
|------|-------------|
| `automatic` | Server checks configuration and reports pass/fail |
| `manual` | User marks each step complete |
| `quiz` | Questions with defined correct answers |
| `mixed` | Some steps automatic, some manual, some quiz |

### Difficulty Levels

| Level | Description |
|-------|-------------|
| `easy` | Basic concept introduction |
| `medium` | Standard practice lab |
| `hard` | Complex multi-step scenario |
| `exam` | Exam-style simulation |

### Router Access

Each router object in `routers`:
- `name` - Router identifier (e.g., `R1`, `SW1`)
- `winboxPort` - Optional WinBox port
- `sshPort` - Optional SSH port
- `webfigPort` - Optional WebFig port
- `username` - Login username
- `password` - Login password

### Hardware

The `hardware` object:
- `required` - Boolean indicating if physical hardware is required
- `deviceType` - Optional: `mikrotik-wireless-router`
- `knownModel` - Optional known model string
- `connectionMode` - Optional: `same-lan`, `direct-ethernet`, `manual`

## File Layout

```
labs/
  <lab-id>/
    manifest.json
    topology.clab.yml          # for containerlab only
    instructions.md
    hints.md
    solution.md
    resources.md
    diagram.mmd
    check.ts
    startup/
      *.rsc
```

## Writing Tips

- Keep objectives measurable
- Include search terms so learners can find official docs
- Prefer `official-docs` and `related-topic` resources
- Add `video` resources for complex topics
- Provide hints in progressive order
- Use `startup/*.rsc` for initial router configurations
- Use `diagram.mmd` for Mermaid topology diagrams
