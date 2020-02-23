# FormaJS
jQuery extension for creating dynamic and interactive forms.

Go to our docs page for complete [documentation](https://formajs.com/), [examples](https://formajs.com/examples/index.html), usage and features.

**This project is still in its infancy; not a good idea to use it in production.**

## [Quick start](https://formajs.com/index.html#usage)

Copy-paste the stylesheet `<link>` into your `<head>`.

```html
<link rel="stylesheet" src="path/to/js/forma.css" />
```

Place the following `<script>` near the end of your pages, right before the closing `</body>` tag, to enable them. jQuery must come first.

```html
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
<script src="path/to/js/forma-0.0.1.min.js"></script>
```

### [Build your form](https://formajs.com/index.html#structure)

There are couple structure rules you need to follow when building your forms. 

First add the `forma` class to you form tag. 

Then each form element must be structured as an example below, where `<span>` holds the label, description and notifications and `<div class="fieldset">` all your form elements.

```html
<form class="forma">
  <label>
    <span></span>
    <div class="fieldset">
      <input type="text" />
    </div>
  </label>
  <button type="submit"></button>
</form>
```

### [Initialize FormaJS](https://formajs.com/index.html#options)

Once we have our form we are ready to initiate our form. 

```html
<script>
  $.forma();
</script>
```

Note: Must be added after the `forma-0.0.1.min.js`.

### [Customize your form](https://formajs.com/index.html#style)

For customizing and styling your form take a look at the `forma.css` file. 

Below is the example set with globally available variables specified within the `:root` selector.

```css
:root {
  --font: 400 normal 16px/1.6 'Monaco', 'Candara', 'Gill Sans', 'Helvetica', 'Arial', monospace;
  --primary-color: #D65DB1;
  --secondary-color: #845EC2;
  --error-color: #FF6F91;
  --success-color: #008F7A;
  --warning-color: #FF9671;
  --info-color: #0081CF;
  --white-rgb-color: 250, 250, 250; /* #FAFAFA */
  --black-rgb-color: 25, 25, 25; /* #191919 */
}
```

In addition you can easily extend and change the structure of your form. 

Take a look the end of the CSS file starting with `/* _forma-extend.css */`.

Note: You can create your own CSS. All you need to include is `forma-base.css` which holds some required style rules.

### [Contribute](https://formajs.com/index.html#contribute)

### [License](https://formajs.com/index.html#license)
