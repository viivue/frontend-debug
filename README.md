# 🐛 Frontend-debug

[![release](https://badgen.net/github/release/viivue/frontend-debug/)](https://github.com/viivue/frontend-debug/releases/latest)
[![minified](https://badgen.net/badge/minified/6KB/cyan)](https://www.jsdelivr.com/package/gh/viivue/frontend-debug)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/viivue/frontend-debug/badge?style=rounded)](https://www.jsdelivr.com/package/gh/viivue/frontend-debug)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2eb250dd-cab2-4e06-8996-df32cf606042/deploy-status)](https://app.netlify.com/sites/fdebug/deploys)
> Debug tool for front-end dev

## Installation

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

Run `./web` in live server

```shell
npm run dev
```

Build files from `./src` to `./dist`

```shell
npm run prod
```

Build sources from `./web` to `./build`

```shell
npm run build
```
<!---
Build files from `./src` to `./dist` then publish to `npm`

```shell
npm run publish
```
--->

## Test production output

Generate production output

```shell
npm run prod
```

Then load the output script in dev site at `/web/template.html`

```html
<!-- Test production output -->
<script src="/script.js"></script>
```

And remove `import '@/_index'` from `/web/index.js`