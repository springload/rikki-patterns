---
displayName: List
classBase: list
schema:
  elements:
    type: array
    description: Array of list items
  list_type:
    type: string
    description: Type of list eg. Bulleted, numbered, alphanumeric
usage:
  - class: .list-[type]
    required: True
    elements:
      - ul
    outcome: Defines the List component
flavours:
  - title: Base
    status: production
    states:
      - title: Styled
        data:
          list_type: styled
          elements:
            - The list component is really simple.
            - Yet so important.
            - Lists have content "elements", and a type.
      - title: Numbered
        data:
          list_type: numbered
          elements:
            - Item 1
            - Item 2
            - Item 3
      - title: Ticked
        data:
          list_type: ticked
          elements:
            - List type determines what the list looks like.
            - And thus its purpose.
      - title: Action
        data:
          list_type: action
          elements:
            - Item 1
            - Item 2
            - Item 3
      - title: Quicklink style
        data:
          list_type: quicklink
          elements:
            - Item 1
            - Item 2
            - Item 3
      - title: Unstyled
        data:
          list_type: unstyled
          elements:
            - Item 1
            - Item 2
            - Item 3
---
