# Rikki Patterns [![npm](https://img.shields.io/npm/v/rikki-patterns.svg?style=flat-square)](https://www.npmjs.com/package/rikki-patterns) [![Build Status](https://travis-ci.org/springload/rikki-patterns.svg?branch=master)](https://travis-ci.org/springload/rikki-patterns) [![Coverage Status](https://coveralls.io/repos/github/springload/rikki-patterns/badge.svg)](https://coveralls.io/github/springload/rikki-patterns)

> Living pattern library generator.

## Features

- Colour definitions
- Type styles
- Components documentation
- Guidelines for writing content

## Install

```sh
npm install --save-dev rikki-patterns
```

## Usage

### Running the preview server

```sh
rikki
```

### Building tokens

We use a system of Design Tokens similar to SalesForce Lightning Design System, so that you can export the tokens for your environment (CSS, JS, SASS, XML).

```sh
npm run token --tokens colours,breakpoints,typography --path ./my_app/tokens --format sass
```

Available formats are Sass, CSS, JSON, XML.

### Creating a new component

Components can be generated via:

```sh
npm run component [COMPONENT_NAME]
```

### Installing into Python apps

The templates use Nunjucks/Jinja2 and React. You can add the template paths to
your application to make direct use of the components.


```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'APP_DIRS': True,
        'DIRS': [
            normpath(join(DJANGO_ROOT, 'client/ui/components')),
            normpath(join(DJANGO_ROOT, 'client/ui')),
        ],
        'OPTIONS': {
            'extensions': [
                'wagtail.wagtailcore.jinja2tags.core',
                'wagtail.wagtailadmin.jinja2tags.userbar',
                'wagtail.wagtailimages.jinja2tags.images',
                'jinja2.ext.with_',
                'jinja2.ext.i18n',
                'jinja2.ext.do',
                'core.jinja2_extensions.IncludeBlockWithContext',
            ],
            # 'environment': '<your_project>.jinja2.environment'
        },
    },
]
```

### Installing into your Sass workflow

To build the frontend assets into your application's static file directory:

```sh
npm run build ./my_app/static
```

To watch changes to the Design System and automatically export them to your app:
```sh
npm run watch ./my_app/static
```
