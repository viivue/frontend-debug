# 🐛 Frontend-debug

[![release](https://badgen.net/github/release/viivue/frontend-debug/)](https://github.com/viivue/frontend-debug/releases/latest)
[![minified](https://badgen.net/badge/minified/13KB/cyan)](https://www.jsdelivr.com/package/gh/viivue/frontend-debug)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2eb250dd-cab2-4e06-8996-df32cf606042/deploy-status)](https://app.netlify.com/sites/fdebug/deploys)

> Debug tool for front-end dev

## Installation

### NPM Package

Install NPM package

```shell
npm i @viivue/frontend-debug
```

Import

```js
import "@viivue/frontend-debug";
```

### CDN

Inject this script tag at the end of your page, right above `</body>`

```html
<script src="https://fdebug.netlify.app/script.js"></script>
```

Or you can download the file and serve it the way you want.

## Usage

### Show debug dialog

Add `?debug` to site URL

```html
https://fdebug.netlify.app/?debug
```

> Once enabled, the debug dialog will remain showing as long as you still stay in the same tab.

### Hide debug dialog

Add `?nodebug` to site URL

```html
https://fdebug.netlify.app/?nodebug
```

Or just close the current tab.

## How does this work?

- The script will generate some HTML for the debug UI.
- Calculate values using requestAnimationFrame.
- Show/hide debug UI with JavaScript session storage.

## Deployment

```shell
# Run dev server
npm run dev

# Release (update package.json carefully first)
npm run prod

# Build production site (for Netlify)
npm run publish
```