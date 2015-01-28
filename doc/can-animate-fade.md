@function can-animate-fade
@parent can-animate.api

@signature `can-animate-fade[-in|-out|-toggle]="DURATION"`

@param {String|Number} [DURATION=400] Specify the duration of the animation as:

 * A string
   * slow: 600ms
   * fast: 200ms
 * A number, specifying duration in milliseconds
 
 If not specified, the duration will be 400ms.

@body

## Use

### Fade in

By default, fade in is performed on insertion.

```
<div can-animation-fade-in="slow"></div>
```

### Fade out

By default, fade out is performed when an element is removed.

```
<div can-animation-fade-out="slow"></div>
```

### Fade toggle

Toggle must be used with `can-animation-when`.

```
<div can-animation-fade-toggle="slow" 
     can-animation-when="{scopeProperty}"></div>
```

## Examples

### Fading in when can.List item is inserted

@demo src/demos/lists/insertion.html

### Fading out when can.List item removed

@demo src/demos/lists/removal.html