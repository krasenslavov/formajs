# FormaJS
jQuery extension for creating dynamic and interactive forms with better UX.

Check out our GitHub page for complete [documentation](https://formajs.com/), [examples](https://formajs.com/examples/index.html), usage and features.

**This project is still in its infancy; put it together over the weekend, not really ready for production.**

## [Quick start](https://formajs.com/index.html#usage)

Copy-paste the stylesheet `<link>` into your HTML document`<head>` element.

```html
<link rel="stylesheet" src="path/to/js/forma.css" />
```

Place the following `<script>`'s near the end of your pages, right before the closing `</body>` tag. jQuery must come first.

```html
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
<script src="path/to/js/forma-0.0.1.min.js"></script>
```

### [Build your form](https://formajs.com/index.html#structure)

There are a few structure rules you need to follow when building your forms. 

1. First add the `forma` class attribute to your target form tag. 
2. Next each form element must be structured as an example below, where `<span>` holds the text and `<div class="fieldset">...</div>` your form elements.

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

Once we have our form created we are ready to initialize our form. 

Below is the most basic way without any additional options. 

```html
<script>
  $.forma();
</script>
```

Note: The script must be added after `<script src="path/to/js/forma-0.0.1.min.js"></script>`.

### [Customize your form](https://formajs.com/index.html#style)

For customizing and styling your form take a look at the `forma.css` and `forma-base.css` files. 

Below is an example set with globally available variables specified within the `:root` selector.

```css
:root {
  --font: 400 normal 16px/1.6 Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', monospace;
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

In addition, you can easily extend and change the structure of your form, take a look at the Register form [here](https://formajs.com/examples/register.html). 

Take a look the end of the CSS file starting with `/* _forma-extend.css */`.

Note: You can create your own CSS. All you need to include is `forma-base.css` which holds some required style rules.

### [Form validations](https://formajs.com/index.html#validation)

There are two types of validations, built-in validations with generic messages and custom validations that use regular expressions (by utilizing the `pattern` and `title` attributes).

More about validation and examples can be found [here](https://formajs.com/index.html#validation).

### [Contribute](https://formajs.com/index.html#contribute)

### [License](https://formajs.com/index.html#license)
