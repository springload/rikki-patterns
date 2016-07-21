"use strict";

const getUI = require('../app/utils/ui').getUI;
const packageJson = require('../package.json');


module.exports = {
  "navigation": {
    "label": "Root",
    "path": "/",
    "children": [
      {
        "label": "Getting Started",
        "children": [
          { "label": "CSS" },
          { "label": "How To" }
        ]
      },
      {
        "label": "Design",
        "children": [
          {
            "label": "Overview"
          },
          {
            "label": "Layout"
          },
          {
            "label": "Colours"
          },
          {
            "label": "Typography"
          }
        ]
      },
      {
        "label": "Components",
        "children": getUI('components').map(function(component) {
          return {label: component.title};
        })
      },
      {
        "label": "Style and Tone"
      },
      {
        "label": "Give Feedback",
        "path": packageJson.bugs.url,
        "internal": false
      }
    ]
  }
}
