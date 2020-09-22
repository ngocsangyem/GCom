Thank you [Codyhouse](https://codyhouse.co/ds/docs/framework/mixins) and [K-sass-core](https://github.com/baonguyenyam/k-sass-core) for awesome mixins.

-   [Color](#color)
-   [Typography](#typography)
-   [Spacing](#spacing)
-   [Color](#color)
-   [Accessibility](#accessibility)
-   [Miscellaneous](#miscellaneous)

# Color

| Name                                                       |  Type   | Description                                          |
| ---------------------------------------------------------- | :-----: | ---------------------------------------------------- |
| `defineColorHSL(--color-name, hue, saturation, lightness)` |  Mixin  | Used to define HSL color variables.                  |
| `alpha(var(--color-name), alpha)`                          | Funtion | Used to return a color with different opacity value. |
| `lightness(var(--color-name), alpha)`                      | Funtion | Used to return color with different lightness value. |

#### defineColorHSL

The `defineColorHSL` mixin is used to define your colors in the 📁 styles/global/colors.scss file :

```scss
:root {
	@include defineColorHSL(--color-primary, 220, 90%, 56%);
}
```

Output:

```scss
:root,
[data-theme='default'] {
	--color-primary: hsl(220, 90%, 56%);
	--color-primary-h: 220;
	--color-primary-s: 90%;
	--color-primary-l: 56%;
}
```

#### alpha

```scss
.component {
	// return color with opacity 0.2
	color: alpha(var(--color-name), 0.2);
}
```

⚠️ **Important**: the --color-name variable needs to be defined using the defineColorHSL mixin for the alpha function to properly work.

#### lightness

```scss
.component {
	// return color with lightness equal to (--color-name-l*0.9)
	background-color: lightness(var(--color-name), 0.9);
}
```

⚠️ **Important**: the --color-name variable needs to be defined using the defineColorHSL mixin for the lightness function to properly work.

# Typography

| Name         | Type  | Description                                         |
| ------------ | :---: | --------------------------------------------------- |
| `textUnit`   | Mixin | Edit text unit and type scale on a component level. |
| `fontSmooth` | Mixin | Edit font rendering.                                |
| `lhCrop`     | Mixin | Remove top space on text elements.                  |

#### textUnit

This mixin can be used to modify the CSS `--text-{size}` variables on a component level. Pass to the mixin the value you want to use as new text base size (e.g., 1rem or 16px):

```scss
.component {
	@include textUnit(1rem);
}
```

You can use this mixin to switch from a type scale system based on em units (which is the default in CodyFrame) to one based on a different unit (e.g., rem). This option is useful if you don't want to extend the automatic (typography) responsive behavior to a specific component.

Optionally, you can pass a second argument to the mixin: this will be used as new scale ratio (default is 1.2):

```scss
.component {
	@include textUnit(1rem, 1.3);
}
```

#### fontSmooth

This mixin can be used to add font smoothing to your text elements, useful for light text on dark backgrounds.

```scss
.dark-theme {
	@include fontSmooth;
}
```

#### lhCrop

This mixin is used to remove the top space of a text element that is caused by the element line-height.

```scss
.text-to-crop {
	@include lhCrop(1.2); // pass the line-height of .text-to-crop element
}
```

The mixin also accepts a (not required) second parameter (a number smaller than 1 that varies with the font-family value) that improves the crop effect:

```scss
.text-to-crop {
	@include lhCrop(1.2, 0.72);
}
```

Since this additional parameter depends on the font-family only (it is not affected by font-size or font-weight or line-height), a good idea would be to define a CSS variable for each one of your font families. You can then use that variable to call the lhCrop mixin; this way, if you need to change your font-family, you’ll only need to update the  value of that variable with no need to modify the mixin calls.

In the 📁 styles/global/typography.scss file, you find this variable defined for the primary font (--font-primary-capital-letter). Its default value is one, so make sure to update it according to your font-family.

```scss
.text-to-crop {
	@include lhCrop(1.2, var(--font-primary-capital-letter));
}
```

If your project requires more than one font-family, make sure to define new CSS variables for each one of them (eg. --font-secondary-capital-letter, ...).

If you want to learn more about the mixin, take a look at [this article explaining how the mixin formula works](https://codyhouse.co/blog/post/line-height-crop).

#### Spacing

| Name        | Type  | Description                           |
| ----------- | :---: | ------------------------------------- |
| `spaceUnit` | Mixin | Edit space unit on a component level. |

The `spaceUnit` mixin is used to modify the CSS --space-unit variable on a component level. Pass to the mixin the value you wish to use as new --space-unit value for your component:

```scss
.component {
	@include spaceUnit(1.2em); // --space-unit is now 1.2em
}
```

The mixin will automatically update all the `--space-{size}` variables based on the new value of the `--space-unit`.

For example, you can use this mixin to switch from a spacing system based on em units (which is the default in CodyFrame) to one based on `rem` units:

```scss
.component {
	@include spaceUnit(1rem);
}
```

This could be useful if you don't want your spacing variables to change when the font-size of the body (or component element) is updated.

# Accessibility

| Name     | Type  | Description                                                                          |
| -------- | :---: | ------------------------------------------------------------------------------------ |
| `srHide` | Mixin | Hide content to all users, except those visiting your website using a screen reader. |
| `srShow` | Mixin | Reveal content that was visually hidden.                                             |

```scss
.component span {
	@include srHide; // visually hide the span element - it is still accessible to SR
}

.component--is-visible span {
	@include srShow; // visually reveal the span element
}
```

# Miscellaneous
