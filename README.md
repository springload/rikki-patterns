# Pattern Library Server

This is a living style guide for web applications.

### Features

* Colour definitions
* Type styles
* Components documentation
* Guidelines for writing content

### Running the preview server

```
npm install
npm run server
```

### Building tokens

We use a system of [Design Tokens](#) similar to SalesForce Lightning Design System,
so that you can export the tokens for your environment (CSS, JS, SASS, XML).

```
npm run token --tokens colours,breakpoints,typography --path ./my_app/tokens --format sass
```
Available formats are SASS, CSS, JSON, XML


### Creating a new component

Components can be generated via

```
npm run generate [COMPONENT_NAME]
```

---

### Installing into your Sass workflow

To build the frontend assets into your application's static file directory:

```
npm run build ./my_app/static
```

To watch changes to the Design System and automatically export them to your app:
```
npm run watch ./my_app/static
```

## Versioning

The library is released in accordance with SEMVER.
