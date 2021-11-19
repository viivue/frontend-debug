# 🐛 frontend-debug
Debug tool for front-end dev

Inject this script tag into `footer.php`

```html
<script src="https://viivue.mochisandbox.com/demo/fe-debug/fe-debug.js"></script>
```

## Show debug

Add `?debug` to site URL

```html
https://viivue.mochisandbox.com/demo/?debug
```

> Once enabled, the debug dialog will remain showing as long as you still stay in the same tab.

## Hide debug

Add `?nodebug` to site URL

```html
https://viivue.mochisandbox.com/demo/?nodebug
```

Or just close the current tab.

## How does this work?

- The script will generate some HTML for the debug UI.
- Calculate values using requestAnimationFrame.
- Show/hide debug UI with session storage.