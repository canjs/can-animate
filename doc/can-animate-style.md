@function can-animate-style
@parent can-animate

@signature `can-animate-duration="DURATION"`

@param {String|Number} [DURATION=400] Specify the duration of the animation as:

 * A string
   * slow: 600ms
   * fast: 200ms
 * A number, specifying duration in milliseconds
 
 If not specified, the duration will be 400ms.

@body

## Use

```
<div can-animation-duration="slow" can-animation="{ANIMATIONKEY}"></div>
```

