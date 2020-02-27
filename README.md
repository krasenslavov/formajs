# FormaJS

FormaJS will help you to create dynamic and interactive forms with a better end-user experience.

There are few different starting points once you load up and initialize the script. Check out our GitHub page for complete [documentation](https://formajs.com/) with [examples](https://formajs.com/examples/index.html), usage, and features.

*This project is still in alpha version so be careful if you use it for live sites or in production environments.*

## [Quick start](https://formajs.com/index.html#usage)

1. Copy-paste the stylesheet `<link>` into your HTML document`<head>`. There are few starting stylesheets that are included in the `/dist/css` folder.

```html
<link rel="stylesheet" href="path/to/css/forma.css" />
```

2. Create your form by using the structure below 

```html
<form class="forma">
  <label>
    <span></span>
    <div class="forma-fieldset">
      <input />
    </div>
  </label>
  <button></button>
</form>
```

*Don't forget to use `forma` as your main form class and wrap your form elements within `div` that has `forma-fieldset` class.*

3. Place the following `<script>`'s near the end of your pages, right before the closing `</body>` tag.

```html
<script src="path/to/js/forma.min.js"></script>
<script>forma();</script>
```

### [Build your form](https://formajs.com/index.html#structure)

There are a couple structure rules you need to follow when building your forms. 

1. First, add the `forma` class attribute to your target form tag. This is required if you plan to use the `/dist/css` files as your starting point for customization.
2. Next each form row (field) must be structured as the example below, where `<span>` holds the text and `<div class="forma-fieldset">...</div>` is for your form elements.

A real-world example login form structure.

```html
<form class="forma forma-login">
  <label for="username">
    <span>Username</span>
    <div class="fieldset">
      <input type="text" name="username" pattern="[a-z]{3,32}" 
        title="Username must be lowercase between 3 and 32 characters." required />
    </div>
  </label>
  <label for="password">
    <span>Password</span>
    <div class="fieldset">
      <input type="password" name="password" pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}" 
        title="Password must have minimum 8 characters, at least one letter and one number" required />
    </div>
  </label>
  <button type="submit" disabled>Login</button>
</form>
```

### [Initialize FormaJS](https://formajs.com/index.html#options)

Once we have our form created we are ready to initialize and run our script. 

Below is the most basic way to do that (wihtout any additional options). 

```html
<script>
  forma();
</script>
```

**Note: The init function must be added after `<script src="path/to/js/forma.min.js"></script>`.**

Below is the full format for our init function (with all default values). 

```html
<script>
  forma({
    container: '.forma',
    prefix: 'Enter ',
    suffix: '...',
    tab: true,
    auto: false,
    show: false,
    manual: false,
    submit: false,
    support: []
  });
</script>
```

Take a look at the [documentaion](https://formajs.com/index.html#options) page for more information about user-defined options.

### [Customize your form](https://formajs.com/index.html#style)

There are few different approaches when it comes to customizing and styling your forms.

You can either use the pre-built stylesheets that come inside the `/dist/css` folder, or build your own CSS from scratch.

**Note: need to take into consideration some JS defined CSS classes; take a look at `/dist/css/forma-boilerplate.css`**

If you decide you want to use the pre-built stylesheets the simplest way to customize your form look and feel is to update the `:root` values. See the example below.

```css
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
:root {
  --font-mono: 400 normal 16px/1.6 'Monaco', 'Consolas', 'Andale Mono', 'Ubuntu Mono', monospace;
  --font-google: 400 normal 16px/1.6 'Source Sans Pro', sans-serif;
  --primary-color: #d65bd1;
  --secondary-color: #845ec2;
  --error-color: #fc4444;
  --success-color: #008f7a;
  --warning-color: #ff9671;
  --info-color: #0081cf;
  --white-rgb-color: 250, 250, 250; /* #fafafa */
  --black-rgb-color: 25, 25, 25; /* #191919 */
  --space: 1rem;
}
``` 

In addition, you can easily extend and change the structure of your form, take a look at the Register form example [here](https://formajs.com/examples/register.html). 

### [SCSS](https://formajs.com/scss.html)

All stylesheets can be generated with SASS/SCSS; speed up your form customization process.

Below is the main `forma.scss`; take a look at the files under `/src/scss` for more information. 

```scss
// forma.scss

// _form-variables.scss
// Define global variables.
@import 'forma-variables';

// _forma-boilerplate.scss
// Starting from scratch (strcuture only).
@import 'forma-boilerplate';

// _forma-barebone.scss
// Get some structure with limited funcitionality and styling.
// @import 'forma-barebone';

// _forma-base.scss 
// Getting a bit more structure, functionality, and styling than _forma-barebone.scss.
// @import 'forma-base';

// _forma-complete.scss
// Fully integrated styleheet that can be customized wtih minimal effort and modification.
// @import 'forma-complete';

// _forma-docs.scss
// Take a look at our custom stylesheet we use for https://formajs.com/
// @import 'forma-docs';
```

If you download the master after uncommneting your stylesheet starting point run the following command in the terminal and the CSS will be generated.

    sass --watch src/scss/:src/scss/css

### [Form validations](https://formajs.com/index.html#validation)

There are two types of validations, built-in validations with generic messages and custom validations that use regular expressions (this is done by utilizing the `pattern` and `title` attributes for each form element).

More about form validation with examples can be found [here](https://formajs.com/index.html#validation).

### [Contribute](https://formajs.com/index.html#contribute)

Check out the [GitHub](https://formajs.com/index.html#contribute) page for the different ways you can contribute to this project.

### [License](https://formajs.com/index.html#license)

(c) Krasen Slavov | Code released under the [MIT License](https://opensource.org/licenses/MIT).