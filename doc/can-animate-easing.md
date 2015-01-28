@function can-animate-easing
@parent can-animate.api

@signature `can-animate-esing="EASING"`

@param {String} [EASING='swing'] Specify the easing used for the animation as one of the following:

 * swing
 * linear
 
 If not specified, the easing will be swing. Other types of
 easing can be used with the inclusion of jQuery UI.

@body

## Use

```
<div can-animation-easing="linear" can-animation="{ANIMATIONKEY}"></div>
```

@demo src/demos/easing/easing.html