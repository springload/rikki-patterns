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
            - You can have up to four Front Runner accounts.
            - You won't pay any account or transaction fees unless the balance across all your front runner accounts slips below $4,000.
            - Earn interest based on the balance of your accounts.
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
            - You can have up to four Front Runner accounts.
            - You won't pay any account or transaction fees unless the balance across all your front runner accounts slips below $4,000.
            - Earn interest based on the balance of your accounts.
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
