# 🐛 Frontend-debug [![Netlify Status](https://api.netlify.com/api/v1/badges/2eb250dd-cab2-4e06-8996-df32cf606042/deploy-status)](https://app.netlify.com/sites/fdebug/deploys)

Debug tool for front-end dev

Inject this script tag into `footer.php`, right above `</body>`

```html

<script src="https://fdebug.netlify.app/script.js"></script>
```

Or using dev mode with a todo (recommend)

```php
<?php
// Front-end debug
// todo: @your-name remove once done
if(ev_dev_mode()){
	echo '<script src="https://fdebug.netlify.app/script.js"></script>';
} ?>
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