---
displayName: Icon
classBase: icon
schema:
  icon:
    type: string
    description: Name of the icon – should map to an SVG symbol id prefixed with `icon-`.
  color:
    type: string
    description: Color to display the icon in.
  class:
    type: string
    description: Extra modifier classes to add to the `svg` element.
  title:
    type: string
    description: Accessible label for screen readers.
usage:
  - class: .icon
    required: True
    elements:
      - svg
    outcome: Defines the Icon component.
  - class: .icon++
    required: false
    elements:
      - svg
    outcome: Increases the size of the icon.
    comment: Only one size class should be used.
  - class: .icon--green
    required: false
    elements:
      - svg
    outcome: Changes the color of the icon.
    comment: Only one color class should be used.

flavours:
  - title: Base
    status: production
    states:
      - title: Simplest icon
        data:
          icon: beaker
      - title: Accessible icon
        data:
          icon: beaker
          title: Clip art representation of a beaker
      - title: Colored icon
        data:
          icon: beaker
          color: blue
      - title: Big icon
        data:
          icon: beaker
          class: icon+++
---

The icon component is reused all over the site. It relies on SVG icons as symbols.
