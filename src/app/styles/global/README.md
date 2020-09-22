Thank you [Codyhouse](https://codyhouse.co/ds/docs/framework/mixins) for base scss.

-   [Accessibility](#accessibility)
-   [Breakpoints](#breakpoints)
-   [Buttons](#buttons)
-   [Colors](#colors)
-   [Forms](#forms)
-   [Grid & Layout](#grid-&-layout)
-   [Icons](#icons)
-   [Reset](#reset)
-   [Share styles](#sharestyles)
-   [Spacing](#spacing)
-   [Typography](#typography)
-   [Visibility](#visibility)
-   [z-index](#z-index)

# Accessibility

-   [Classes](##classes)
-   [Mixins](##mixins)

## Classes

| Name            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `.sr-only`      | hide content to all users, except those visiting your website using a screen reader. |
| `.js-tab-focus` | make focus ring visible only for keyboard navigation (i.e., tab key).                |

A good example of the `.sr-only` class in use is the counter component, where we hide the "Notifications" label for all users (we rely on a visual approach so that it's clear the element represents a notification), but we make this content available to assistive technologies:

```html
<span class="counter">
	8
	<i class="sr-only">Notifications</i>
</span>
```

## Mixins

| Name     | Type  | Description                                                                          |
| -------- | :---: | ------------------------------------------------------------------------------------ |
| `srHide` | Mixin | hide content to all users, except those visiting your website using a screen reader. |
| `srShow` | Mixin | reveal content that was visually hidden.                                             |

```scss
.component span {
	@include srHide; // visually hide the span element - it is still accessible to SR
}

.component--is-visible span {
	@include srShow; // visually reveal the span element
}
```

# Breakpoints

-   [Breakpoints List](##breakpoints-list)
-   [How to use the breakpoint mixin](##How-to-use-the-breakpoint-mixin)
-   [How to edit the breakpoints](##How-to-edit-the-breakpoints)

## Breakpoints List

```scss
$breakpoints: (
	// ~512px
	xs: 32rem,
	// ~768px
	sm: 48rem,
	// ~1024px
	md: 64rem,
	// ~1280px
	lg: 80rem,
	// ~1440px
	xl: 90rem
);
```

**This build tool is mobile first, so the breakpoint mixin targets only the min-width of the viewport.**

## How to use the breakpoint mixin

```scss
@include breakpoint(md) {
	/* your code here */
}
```

Output:

```css
@media (min-width: 64rem) {
	/* your code here */
}
```

If you need to use more advanced media queries, you can pass an additional \$logic argument to the mixin as well. For example:

```scss
@include breakpoint(sm, 'not all') {
	/* your code here */
}
```

Output:

```css
@media not all and (min-width: 32rem) {
	/* your code here */
}
```

## How to edit the breakpoints

To edit the default breakpoints, copy the \$breakpoints SASS map (removing the !default flag) and import your custom breakpoints before the 'global' and 'custom-style' files of the framework.

```scss
$breakpoints: (
	xs: 32rem,
	sm: 48rem,
	md: 64rem,
	lg: 80rem,
	xl: 90rem,
);

@import 'global';
@import 'custom-style';
```

# Buttons

Edit the 📁 custom/buttons.scss file to create your custom buttons.

The `.btn` class includes the style applied to all the button components.

The following class modifiers can be used to create button variations.

| Class            | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `.btn`           | basic style of all button components                                                       |
| `.btn--primary`  | main call-to-action button style                                                           |
| `.btn--accent`   | used to draw particular attention to the button (e.g., destructive actions).               |
| `.btn--subtle`   | subtle style variation, used for secondary actions or in combo with primary/accent button. |
| `.btn--disabled` | used for feedback, to identify a button that is disabled.                                  |
| `.btn--sm`       | button size small.                                                                         |
| `.btn--md`       | button size medium.                                                                        |
| `.btn--lg`       | button size large.                                                                         |
| `.btn--icon`     | button containing (only) an icon.                                                          |

Checkout Codyhouse [codepen](https://codepen.io/ngocsangyem/pen/PoNXNEp) to create your custom buttons:

If you want to create `fixed-sized` button variations (e.g., a button with a height equal to 40px), you can create class modifiers that set the desired size:

```scss
/* 👇 example: custom height utility classes */
.height-30,
.height-40,
.height-50 {
	height: var(--height);

	&.btn,
	&.form-control {
		line-height: var(--height);
		padding-top: 0;
		padding-bottom: 0;
	}
}

.height-30 {
	--height: 30px;
}
.height-40 {
	--height: 40px;
}
.height-50 {
	--height: 50px;
}

/* 👇 example: custom width utility classes */
.width-40,
.width-120 {
	width: var(--width);

	&.btn {
		padding-left: 0;
		padding-right: 0;
	}
}

.width-40 {
	--width: 40px;
}
.width-120 {
	--width: 120px;
}
```

[Example](https://codepen.io/ngocsangyem/pen/OJNrNEj)

# Colors

-   [Define Color Variables](##define-color-variables)
-   [Main Colors](##main-colors)
-   [Feedback](##feedback)
-   [Color contrasts](##color-contrasts)
-   [Black + White](##black-+-white)
-   [Color functions](##color-functions)

## Define Color Variables

Each color is defined using the `defineColorHSL` [mixin](https://github.com/ngocsangyem/gulp-components/tree/master/src/app/styles/abstracts#color):

```scss
:root,
[data-theme='default'] {
	@include defineColorHSL(--color-primary, 220, 90%, 56%);
}
```

Output:

```css
:root,
[data-theme='default'] {
	--color-primary: hsl(220, 90%, 56%);
	--color-primary-h: 220;
	--color-primary-s: 90%;
	--color-primary-l: 56%;
}
```

This method allows us to [combine SASS color functions and CSS Variables](https://codyhouse.co/blog/post/how-to-combine-sass-color-functions-and-css-variables).

> 🚀 Use the [Color Editor](https://codyhouse.co/ds/globals/colors) to create and export a color palette compatible with CodyFrame

## Main Colors

These are the "Brand" colors, mostly used for interactive elements (e.g., buttons). Each color in this section has 5 color variations (base color + 2 lighter versions + 2 darker versions).

```scss
:root,
[data-theme='default'] {
	// main
	@include defineColorHSL(--color-primary-darker, 220, 90%, 36%);
	@include defineColorHSL(--color-primary-dark, 220, 90%, 46%);
	@include defineColorHSL(--color-primary, 220, 90%, 56%);
	@include defineColorHSL(--color-primary-light, 220, 90%, 66%);
	@include defineColorHSL(--color-primary-lighter, 220, 90%, 76%);

	@include defineColorHSL(--color-accent-darker, 355, 90%, 41%);
	@include defineColorHSL(--color-accent-dark, 355, 90%, 51%);
	@include defineColorHSL(--color-accent, 355, 90%, 61%);
	@include defineColorHSL(--color-accent-light, 355, 90%, 71%);
	@include defineColorHSL(--color-accent-lighter, 355, 90%, 81%);
}
```

## Feedback

Feedback colors are used to convey specific meanings like success/error/warning. Each color in this section has 5 color variations (base color + 2 lighter versions + 2 darker versions).

```scss
:root,
[data-theme='default'] {
	// feedback
	@include defineColorHSL(--color-success-darker, 94, 48%, 36%);
	@include defineColorHSL(--color-success-dark, 94, 48%, 46%);
	@include defineColorHSL(--color-success, 94, 48%, 56%);
	@include defineColorHSL(--color-success-light, 94, 48%, 66%);
	@include defineColorHSL(--color-success-lighter, 94, 48%, 76%);

	@include defineColorHSL(--color-error-darker, 355, 90%, 41%);
	@include defineColorHSL(--color-error-dark, 355, 90%, 51%);
	@include defineColorHSL(--color-error, 355, 90%, 61%);
	@include defineColorHSL(--color-error-light, 355, 90%, 71%);
	@include defineColorHSL(--color-error-lighter, 355, 90%, 81%);

	@include defineColorHSL(--color-warning-darker, 46, 100%, 41%);
	@include defineColorHSL(--color-warning-dark, 46, 100%, 51%);
	@include defineColorHSL(--color-warning, 46, 100%, 61%);
	@include defineColorHSL(--color-warning-light, 46, 100%, 71%);
	@include defineColorHSL(--color-warning-lighter, 46, 100%, 81%);
}
```

## Color Contrasts

The color contrasts are used to define a scale of neutral colors:

```scss
:root,
[data-theme='default'] {
	// color contrasts
	@include defineColorHSL(--color-bg, 0, 0%, 100%);
	@include defineColorHSL(--color-contrast-lower, 0, 0%, 95%);
	@include defineColorHSL(--color-contrast-low, 240, 1%, 83%);
	@include defineColorHSL(--color-contrast-medium, 240, 1%, 48%);
	@include defineColorHSL(--color-contrast-high, 240, 4%, 20%);
	@include defineColorHSL(--color-contrast-higher, 240, 8%, 12%);
}
```

To create a scale of contrasts you need two starting colors: 1) background color and 2) highest contrast color. You can then generate stop colors in between, using tools like the [Color Editor](https://codyhouse.co/ds/globals/colors).

While defining the scale, it helps to associate each color to an element of your UI:

-   color-bg → background color of the theme in use
-   color-contrast-lower → low contrast background
-   color-contrast-low → borders
-   color-contrast-medium → text subtle
-   color-contrast-high → text color
-   color-contrast-higher → text heading color

Here's an example of a contrast scale in a theme with a white background:

[Codepen](https://codepen.io/ngocsangyem/pen/dyMwMxp)

## Black + White

`--color-white` and `--color-black` represent white and black in your color palette:

```scss
:root,
[data-theme='default'] {
	// black + white
	@include defineColorHSL(--color-black, 240, 8%, 12%);
	@include defineColorHSL(--color-white, 0, 0%, 100%);
}
```

Unlike the color contrasts, `--color-white` and `--color-black` are not affected by the theme in use. More info in the following Themes section.

## Themes

A theme is a group of related colors. The 📁 custom/colors.scss file includes a theme titled "default". To create a new theme, you can make a copy of the default theme and overwrite the values of the CSS variables (or use the [Color Editor](https://codyhouse.co/ds/globals/colors)).

To apply a theme to a component or a group of components, add `data-theme="{themeName}"`:

```html
<div class="component" data-theme="dark">
	<!-- ... -->
</div>
```

If you use the color variables properly (in particular, the color contrasts) in your components, [you can easily switch from a "light" to a "dark" theme](https://codyhouse.co/blog/post/dark-light-switch-css-javascript).

In the example below, try changing the data-theme value to default/dark/soft in the HTML (the default theme is applied even if you don't specify the theme at all):

[Codepen](https://codepen.io/ngocsangyem/pen/dyMwXoN)

Considering the default theme in the example above, using `--color-bg` will return white. However, if you apply another theme, `--color-bg` will return a different color. If you want to set a white color that is not affected by the theme (e.g., for the text color of a button), you should use `--color-white`.

## Color functions

| Name                                             |  Type   | Description                                          |
| ------------------------------------------------ | :-----: | ---------------------------------------------------- |
| `alpha(var(--color-name), {alphaValue})`         | Funtion | Used to return a color with different opacity value. |
| `lightness(var(--color-name), {lightnessValue})` | Funtion | Used to return color with different lightness value. |

```scss
.component {
	// return color with opacity 0.2
	color: alpha(var(--color-contrast-higher), 0.2);

	// return color with lightness equal to (--color-name-l*0.9)
	background-color: lightness(var(--color-primary), 0.9);
}
```

# Forms

-   [Main style](##main-style)
-   [Custom Radio/Checkbox buttons](##custom-radiocheckbox-buttons)
-   [Custom select](##custom-select)

Edit the 📁 custom/forms.scss file to create your custom form elements.

## Main Style

The `.form-control` class applies the basic style to all form elements.

To highlight invalid form inputs, you can target the `aria-invalid` attribute, while the `disabled` (or `readonly`) attribute is used to target disabled form elements:

| Class                                | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| `.form-control`                      | basic style of all form elements                      |
| `.form-control[aria-invalid="true"]` | highlight form element where value entered is invalid |
| `.form-control[disabled]`            | target disabled form elements                         |
| `.form-control[readonly]`            | target disabled form elements                         |

Other form classes:

| Class          | Description      |
| -------------- | ---------------- |
| `.form-legend` | <legend> element |
| `.form-label`  | <label> element  |

Fork the [pen](https://codepen.io/ngocsangyem/pen/zYqyBLK) or use the [Forms Editor](https://codyhouse.co/ds/globals/forms) to create your custom form style.

If you want to create fixed-sized input variations (e.g., a .form-control element with a height equal to 40px), you can create class modifiers that set the desired size:

```scss
/* 👇 example: custom height utility classes */
.height-30,
.height-40,
.height-50 {
	height: var(--height);

	&.btn,
	&.form-control {
		line-height: var(--height);
		padding-top: 0;
		padding-bottom: 0;
	}
}

.height-30 {
	--height: 30px;
}
.height-40 {
	--height: 40px;
}
.height-50 {
	--height: 50px;
}

/* 👇 example: custom width utility classes */
.width-40,
.width-120 {
	width: var(--width);

	&.btn {
		padding-left: 0;
		padding-right: 0;
	}
}

.width-40 {
	--width: 40px;
}
.width-120 {
	--width: 120px;
}
```

[Example](https://codepen.io/ngocsangyem/pen/gOrZMjd)

## Custom radio/checkbox buttons

## Custom Select

# Grid & Layout

[🎥 CodyFrame Grid System](https://www.youtube.com/watch?v=7XzpjIHekJA)

-   [Container](##container)
-   [Grid System](##grid-system)
-   [Gap](##gap)
-   [Offset](##offset)
-   [Auto-Sized Grid](##auto-sized-grid)
-   [Examples](##examples)
-   [Known issues](##known-issues)
-   [CSS Grid Layout fallback (mixin)](<##css-grid-layout-fallback-(mixin)>)

## Container

The `.container` class is used to center the content horizontally.

```scss
.container {
	width: calc(100% - 2 * var(--component-padding));
	margin-left: auto;
	margin-right: auto;
}
```

The `--component-padding` variable is subtracted from the `.container` width to create left/right side margins.

The .container class is often used with the `.max-width-{size}` [utility classes]():

[Example](https://codepen.io/ngocsangyem/pen/poyqEyy)

If you want to set the max-width equal to the current breakpoint, use one of the .max-width-adaptive-{size} [utility classes]():

[Example](https://codepen.io/ngocsangyem/pen/ZEWVpOL)

## Grid System

CodyFrame includes a powerful grid system for building responsive layouts. The .grid class is used to target the grid container and the .col-{number} classes are applied to the grid items to set the number of columns occupied.

By default, the grid is composed of 12 columns. You can modify the number of columns by updating the \$grid-columns SCSS variable:

```scss
$grid-columns: 12;
@import 'base';
@import 'custom-style';
```

If you don't apply a `.col-{size}` class to a grid item, it takes the whole width of the grid.

[Example](https://codepen.io/ngocsangyem/pen/ZEWVppL)

#### .col → expandable item

If you want to automatically adjust the width of your grid items so that they all have equal widths, you can use the .col class. This class is also useful if you want a grid item to automatically take all the (remaining) available space in a row.

[Example](https://codepen.io/ngocsangyem/pen/vYGvXyv)

#### .col-content → item width depends on its content

If you want a grid item width to be determined by its content (as opposed to occupying a specific number of columns), use `.col-content` class.

[Example](https://codepen.io/ngocsangyem/pen/NWNeRpq)

### Responsive modifiers

Use the `.col-{number}@{breakpoint}`, `.col@{breakpoint}`, and `.col-content@{breakpoint}` variations to modify the number of columns occupied by a grid item at a specific breakpoint:

[Example](https://codepen.io/ngocsangyem/pen/KKzbgmM)

## Gap

The `.gap-{size}` classes are used to set the grid gap (default gap is zero):

| Class        | Description                         |
| ------------ | ----------------------------------- |
| `.gap-xxxxs` | set gap equal to var(--space-xxxxs) |
| `.gap-xxxs`  | set gap equal to var(--space-xxxs)  |
| `.gap-xxs`   | set gap equal to var(--space-xxs)   |
| `.gap-xs`    | set gap equal to var(--space-xs)    |
| `.gap-sm`    | set gap equal to var(--space-sm)    |
| `.gap-md`    | set gap equal to var(--space-md)    |
| `.gap-lg`    | set gap equal to var(--space-lg)    |
| `.gap-xl`    | set gap equal to var(--space-xl)    |
| `.gap-xxl`   | set gap equal to var(--space-xxl)   |
| `.gap-xxxl`  | set gap equal to var(--space-xxxl)  |
| `.gap-xxxxl` | set gap equal to var(--space-xxxxl) |
| `.gap-0`     | set gap equal to 0px                |

Use the `.gap-{size}@{breakpoint}` responsive helpers to modify the grid gap at a specific breakpoint (e.g., gap-md@md).

## Offset

To offset a column, use one of the .offset-{numberOfColumns} [utility classes]():

[Example](https://codepen.io/ngocsangyem/pen/vYGvXPo)

Use the .offset-{numberOfColumns}@{breakpoint} variations to modify the offset of a grid item at a specific breakpoint (e.g., offset-1@md).

⚠️ The offset utility classes work only in [modern browsers](https://caniuse.com/css-variables).

## Auto-sized Grid

To take advantage of some CSS Grid powerful features (i.e., the option to auto-determine the number of columns), download the Auto-Sized Grid component and include it in your project.

## Examples

### [Nesting](https://codepen.io/ngocsangyem/pen/WNwLGBR)

Grid infinite nesting:

### Distribution

Use the Flexbox utility classes to edit columns distribution:

[Distribution 1](https://codepen.io/ngocsangyem/pen/yLOGadP)
[Distribution 2](https://codepen.io/ngocsangyem/pen/XWdojvY)

### [Reverse order](https://codepen.io/ngocsangyem/pen/XWdoNrB)

Reverse the order of two columns at a specific breakpoint.

### [Column breaks](https://codepen.io/ngocsangyem/pen/xxVmRGM)

How to break columns to a new line:

### [Holy grail](https://codepen.io/ngocsangyem/pen/VwaqmeZ)

Basic page layout:

## [Known issues](https://codepen.io/ngocsangyem/pen/KKzbNzy)

If you apply a background-color to the `.grid` element, along with a `.gap-{size}` class, you get an issue due to collapsing margins: the margins of the children affect the background-color, even if they don't affect the layout.

To fix this issue, apply the background-color and the `.clearfix` class to the parent of the `.grid` element.

## CSS Grid Layout fallback

If you use CSS Grid Layout in your CSS, you can use the `gridFallback` and the `column` mixins if you wish to provide a fallback for browsers [not supporting it](https://caniuse.com/css-grid).

Here's an example of how to use CSS Grid together with our mixins to create a responsive layout:

[Codepen](https://codepen.io/ngocsangyem/pen/NWNebrg)

In the example above (SCSS tab), we use a @support feature query to set the grid settings. The mixin fallback needs to be included before the grid settings, and you can optionally pass the gap value to the mixin.

The grid items only need a span value for the grid-column property. The span value is equal to the number of columns you want the item to stretch. The fallback mixin of the grid items accepts a fraction, or a percentage value, as the argument.

Note: if you're not supporting older browsers (i.e. IE), you can just use the grid properties and forget about the fallbacks. You lucky friend!
