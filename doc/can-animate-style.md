@function can-animate-style
@parent can-animate.api

@signature `can-animate-duration="[style|{property}]"`

@param {String|Object} [STYLE] Specify the style to animate toward either as:

 * A string of css properties (similar to the `style` attribute)
 * The name of a property in the template's scope that is an object of CSS properties to animate toward

@body

## Use

### String

```
<div can-animation-style="height: 300px; margin-left: 200px"></div>
```

### Object

```
    can.view('<div can-animation-style="{css}"></div>', {
        css: {
            height: '300px',
            margin-left: '200px'
        }
    });
```