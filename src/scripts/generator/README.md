---
status: development
classBase: {{ data.className }}
displayName: {{ data.humanName }}
schema:
  title:
    type: string
usage:
  - class: .{{ data.className }}
    required: True
    elements:
      - div
    outcome: Defines the {{ data.humanName }} component
flavours:
  - title: Base
    status: development
    states:
      - title: Simplest {{ data.humanName }}
        data:
          title: Example
---

# {{ data.humanName }}

{{ data.humanName }} is a reusable component.
