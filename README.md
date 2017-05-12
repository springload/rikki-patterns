# Rikki Patterns [![npm](https://img.shields.io/npm/v/rikki-patterns.svg?style=flat-square)](https://www.npmjs.com/package/rikki-patterns) [![Build Status](https://travis-ci.org/springload/rikki-patterns.svg?branch=master)](https://travis-ci.org/springload/rikki-patterns) [![Coverage Status](https://coveralls.io/repos/github/springload/rikki-patterns/badge.svg)](https://coveralls.io/github/springload/rikki-patterns)

> :running_shirt_with_sash::zap: Living pattern library generator. Move fast and don't break your patterns.

## Features

- Colour definitions
- Type styles
- Components documentation
- Guidelines for writing content

## Usage

```sh
npm install --save-dev rikki-patterns
```

### Running the preview server

```sh
rikki
```

### Building tokens

We use a system of Design Tokens similar to SalesForce Lightning Design System, so that you can export the tokens for your environment.

```sh
rikki tokens --tokens colours,breakpoints,typography --path ./my_app/tokens --format sass
```

Available formats are Sass, CSS, JSON, XML.

### Creating a new component

```sh
rikki component [COMPONENT_NAME]
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

### Configuration

## Development

### Install

> Clone the project on your computer, and install [Node](https://nodejs.org). This project also uses [nvm](https://github.com/creationix/nvm).

```sh
nvm install
# Then, install all project dependencies.
npm install
# Install the git hooks.
./.githooks/deploy
# Set up a `.env` file with the appropriate secrets.
touch .env
```

### Working on the project

> Everything mentioned in the installation process should already be done.

```sh
# Make sure you use the right node version.
nvm use
# Start the server and the development tools.
npm run start
# Runs linting.
npm run lint
# Runs tests.
npm run test
# View other available commands with:
npm run
```

### Releases

- Make a new branch for the release of the new version.
- Update the [CHANGELOG](CHANGELOG.md).
- Update the version number in `package.json`, following semver.
- Make a PR and squash merge it.
- Back on master with the PR merged, follow the instructions below.

```sh
npm run dist
# Use irish-pub to check the package content. Install w/ npm install -g first.
irish-pub
npm publish
```

- Finally, go to GitHub and create a release and a tag for the new version.
- Done!
