# can-animate

`can-animate` adds state-based animations to your DoneJS apps.

## Use in Templates

### Basic Usage
Use the `can-animate` attribute with a string value will run that animation on `inserted` and `removed`.  The string values are pre-defined animation keys. More about animation keys, [here](#animation-objects).
```
<my-component can-animate="fade" />
```

### Advanced Bindings with Property Identifiers
Use the `can-animate-xxxx` attribute (where "xxxx" is a property identifier).  A property identifier is a string that represents the state of a scope property. More about property identifiers, [here](#property-identifiers).  The value of this format can be a string value that corresponds to an animation key or an animation object.  More about animation objects, [here](#animation-objects).

#### Run pulse animation when `myProp` changes
```
<my-component can-animate-myProp="pulse" />
```

#### Run fade-out animation when `myProp` becomes falsey
```
<my-component can-animate-!myProp="fade-out" />
```

#### Run custom `myPropAnimation` animation object (scope property) when `myProp` equals `otherProp` falsey
```
<my-component can-animate-myProp:{otherProp}="myPropAnimation" />
```

#### Run pulse animation when component is clicked
```
<my-component can-animate-$click="pulse" />
```


## Use in Scope
Use an animateOptions object in the scope by attaching it to the `can-animate` attribute.
```
<my-component can-animate="animateOptions" />
```

### Basic Usage
```
animateOptions: {
  duration: 1000,
  bindings:{
    '$inserted':'fade-in'
  }
}
```
or, generally
```
animateOptions: {
  duration: 1000,
  bindings:{
    'propertyIdentifier':animateObject || animationKey
  }
}
```


### Full animateOptions object
```
animateOptions: {
  duration: 1000,
  mixins: {
    'my-custom-fade': { // this is an animateObject
      before: function(opts){}, 
      run: function(opts){}, 
      after: { position: "" } // an object will be treated as a CSS object
    },
    'my-custom-scale-out': someImportedVariable //import animateObjects from other files :)
    'pulse':function(options){} // if an animationObject is a function, it will be treated as a 'run' method with no 'before' or 'after'
  },
  bindings:{
    'propertyIdentifier':animateObject, //generalization
    '$inserted':'my-custom-fade', // my-custom-fade animation key defined in 'mixins'
    'currentLabel:{defaultLabel}': { // can provide an animateObject
      before: function(opts){},
      run: function(opts){}
      // animateObjects don't need to provide before or after methods
    }
  },
  hooks: { // hook into before, run, and after for every animation. Executed in order of appearance. next() to continue. Executed before corresponding animation hook (before hook runs before each animationObject's before hook)
before: [function(options, next){}],
  run: [function(options, next){}],
  after: [function(options, next){}],
  complete: [function(options, next){}]
}
```

#### duration (ms)
Provide a global duration for all animations that don't specifically set their own duration.

#### mixins
The mixins object allows the addition of custom animations to be used within each binding.

#### bindings
This is where animations are attached to the state

#### hooks
Global hooks allow us to provide before, run, or, after functionality for every animation within the animateOptions object. Hooks is an object with the keys `before`, `run`, and `after` – the value of each is an array of hook functions (`function(options, next){}`). Global hook functions are executed in the order in which they appear in the array and should call the provided `next` function once inner functionality is complete.
The set of global hook functions for each hook is executed *before* the corresponding hooks in the individual animations.  For example, for the following animation and global hooks:
```
animateOptions:{
  bindings:{
    'myProperty': {
      'before': myPropertyBeforeFunction,
      'run': myPropertyRunFunction,
      'after': myPropertyAfterFunction 
    }
  },
  hooks:{
    before: [globalBeforeHook1, globalBeforeHook2],
    run: [globalRunHook1],
    after: [globalAfterHook1, globalAfterHook2],
    complete: [globalCompleteHook1]
  }
}
```
...the order methods will be called is as follows:

1. globalBeforeHook1
1. globalBeforeHook2
1. myPropertyBeforeFunction
1. globalRunHook1
1. myPropertyRunFunction
1. globalAfterHook1
1. globalAfterHook2
1. myPropertyAfterFunction
1. globalCompleteHook1

*Note: * Is the `next` function necessary?  i.e. Can we use can-zone like we do for before, run, and after?

## Animation Objects
An animation object is a set of instructions, or hooks, in addition to specific animation options (such as duration) that constitute an animation.  The value of each hook can be either a function or a css object.
```
'custom-animaton-key': {
  duration: 1000
  before: {display:block, opacity:1},
  run: {function(options){}},
  after: function(options){},
}
```

### Options
#### duration
if duration is specified, it will override the globally set duration for this animation only.

### Hooks
Hooks can be either a function or an object.  

If an object, it will be treated as CSS properties.  For `before` and `after` hooks, this css properties object will simply be set to the object.  For the `run` hook, it will be used to animate to at the given duration.

If a function, it will be called appropriately with an `options` parameter that looks like this:
```
{
  el, //non-wrapped element
  ev, //the event that triggered this animation
  options, //the properties of the animation (duration, etc)
  scope //the scope
}
```

*Note: * The options parameter probably requires more discussion.

#### `before`
Executed before the `run` hook.

#### `run`
Executed as the main animation.

#### `after`
Executed once the `run` code has completed.

### Notes
#### Async behavior and can-zone
If the value of any of the hooks is a function, it can contain asynchronous behavior (such as animations or XHR calls), and the following method won't be executed until they're completed.  Thanks, can-zone!

#### animationObject as a function
If the animation object itself is a function:
```
'custom-animation-key': function myCustomFunction(opts){}
```
...it will be expanded into a full animation object where the provided function is the `run` hook:
```
'custom-animation-key': {
  'before': undefined,
  'run': function myCustomFunction(opts){},
  'after': undefined
}
```

## Property Identifiers
Property identifiers provide specificity to when animations are run.
They can be used within attributes:
```
<my-component can-animate-xxxx="pulse" />
```
or as keys of an animateOptions.bindings object
```
animateOptions:{
  bindings:{
    'xxxx':'pulse'
  }
}
```

### On Change (`myProp`)
To run an animation for every change of a property, simply use the property's key as the property indentifier.
```
<my-component can-animate-myProp="pulse" />
```

### Falsey (`!myProp`)
Prefixing the property with an exclamation point (`!`) will run the animation when the property's value becomes falsey.
```
<my-component can-animate-!myProp="pulse" />
```

### Truthy (`myProp!`)
Adding an exclamation point (`!`) to the end of the property will run the animation when its value becomes truthy.
```
<my-component can-animate-myProp!="pulse" />
```

### Equals string value (`myProp:simple-string-value`)
Provide a string value by separating it from the property key with a colon (`:`) to run the animation when the property's value equals the provided string value.
```
<my-component can-animate-myProp:unread="pulse" />
```

### Equals another property's value (`myProp:{otherProp}`)
Provide another property (`{otherProp}`) by separating it from the property key with a colon (`:`) to run the animation when the property's value equals the other property's value.
```
<my-component can-animate-myProp:{otherProp}="pulse" />
```

### DOM Events (`$click`)
To run an animation when a DOM event is triggered, prefix the event with a dollar sign (`$`). 
```
<my-component can-animate-$click="pulse" />
```

Listen to `$inserted` and `$removed` events with this syntax.
```
<my-component can-animate-$inserted="fade-in" />
```


## Still to come:
* A strategy for waiting for another property's animation to finish.
* A strategy to put attrs into a 'transitioning' state while animating.
* A strategy for cancelling an animation.


## Docs

>  ./node_modules/.bin/documentjs -wd