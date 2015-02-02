@function can-animate-when
@parent can-animate.api

@signature `can-animate-when="WHEN"`

@param {String|Object} [WHEN]

Specify when the animation should occur either as:

* A string, specifying the name of the event
    - inserted
    - removed
    - click
    - enter
    - submit
* The name of a property in the template's scope

If specifying a property, the animation will trigger
when the property's value changes. By default, most animations
will trigger when the element is inserted.

@body

## Use

### String

```
    <div can-animate-when="click" can-animate-fade-out="slow">
        Fade out when clicked
    </div>
```

### Property

```
    <div can-animate-when="{count}" can-animate-fade-toggle="fast">
        Toggle fade when count changes
    </div>
```

## Example

@demo src/demos/when/when.html