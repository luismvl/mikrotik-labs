# Wi-Fi and Physical Labs Plan

## Wi-Fi Labs

CHR (Cloud Hosted Router) does not emulate real wireless. Because of this, Wi-Fi labs have specific rules.

### Requirements

- Conceptual / quiz labs are mandatory for all Wi-Fi topics that require understanding radio behavior, channel planning, or wireless security.
- `physical-auto` mode is used only if a MikroTik device with wireless hardware is reachable from the server.
- `physical-manual` mode is the official Plan B when a MikroTik wireless device is not reachable from the server.

### Mode Selection

| Scenario | Mode |
|----------|------|
| No real wireless device available | `quiz` (mandatory) |
| Real MikroTik wireless device reachable from server | `physical-auto` |
| Real MikroTik wireless device present but not reachable from server | `physical-manual` |

## Physical Labs

### Prerequisites

- A MikroTik router or CHR instance
- Network reachability from the lab server (for `physical-auto`)
- WinBox or WebFig access

### Fallbacks

If a physical device becomes unavailable, the lab can degrade to `physical-manual` or `quiz` without changing the manifest structure.

## Notes

- CHR is sufficient for routing, firewall, and switching labs.
- CHR is not sufficient for labs that require actual wireless transmission.
- Document which labs are CHR-safe and which require real hardware.
