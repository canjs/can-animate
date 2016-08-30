@function can-animate-options
@parent can-animate.api

@signature `can-animate-options="{PROPERTY}"`

@param {Object} [PROPERTY] Name of the scope property with the options object

@body

## Use

Specify an options object on the scope.

```
<div can-animation-options="{options}"></div>
```

## `options` object
```
{
  duration: 1000, //the global duration for this set of animations
  bindings: {
    "inserted": "fade-in",
    "removed": "fade-out",

    //function - called when prop1 changes
    //  call js animation from within this function
    "prop1": function(props){}, 

    //object - run, before, and after props
    "prop2": {
      //function - main animation function - called when prop2 changes
      //  call js animation from within this function
      "run": function(props), 

      //function - can-animate calls this before "run"
      "before": function(props){}, 

      //function - can-animate calls this when the animation inside of "run" is done
      "after": function(props){} 
    },

    //plugins like these not yet supported
    "prop3": "custom-animation",

    //run 
    "prop4": {
      "run": "custom-animation", //plugins like these not yet supported
      "after": function(props){}
    },

    //specify css properties only (not yet supported)
    prop5: {
      //set up the element
      before:{
        "opacity":0,
        "top":"-100px",
        "z-index":"1000000000"
      },
      //animate to this
      run:{
        "opacity":1,
        "top":"0px"
      },
      //finalize the properties
      after:{
        "z-index":""
      }
    }
  }
}
```


## Examples
Fade In on inserted:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
        "inserted": {
          "run": "fade-in"
        }
    }
  }
});
```

Fade Out on removed:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
        "removed": {
          "run": "fade-out"
        }
    }
  }
});
```

Custom animation on inserted:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "inserted": function(opts){
          $(opts.el)
          .css({
              opacity:0,
              top:"-100px"
          })
          .animate({
              "opacity":1,
              "top":"0px"
          }, 1000, function(){
              console.log("inserted done");
          });
      }
    }
  }
});
```

Custom animation on inserted with callbacks:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "inserted": {
        "run": function(opts){
          console.log("inserted - running");
          $(opts.el).hide().fadeIn(opts.options.duration, function(){
              console.log("inserted - animation done");
          });
        },
        "before": function(){
            //can-animate will call this before 'run'
            console.log("inserted - before");
        },
        "after": function(){
            //can-animate will call this when run is complete
            console.log("inserted - after");
        }
      },
    }
  }
});
```

In addition to the `inserted` and `removed` events, animations can be attached to any property on the scope. Here's a function that will run when `hasError` changes.
```
"hasError": function(opts){
  if(opts.context.attr("hasError")){
    console.log("run animation");
    $(opts.el).fadeOut(200, function(){
        $(opts.el).fadeIn(1000, function(){
            console.log("hasError animation done");
        });
    });
  }else{
    console.log("don't run animation");
  }
}
```

`before` and `after` methods work here, too:
```
"hasError": {
  "run": function(opts){
    if(opts.context.attr("hasError")){
      $(opts.el).fadeOut(opts.options.duration, function(){
        $(opts.el).fadeIn(opts.options.duration, function(){
          console.log("hasError animation done");
        });
      });
    }else{
      console.log("don't run animation");
    }
  },
  before: function(opts){
    if(!opts.context.attr("hasError")){
      return false; //return false to cancel the run method
    }
    //animation is good to go, set up some things
    $(opts.el).css({
      //starting styles
    })
  },
  after: function(){
    console.log("hasError after", arguments);
    //animation is good to go, set up some things
    $(opts.el).css({
      //final styles
    })
  },
  "duration": 1500 //can override the duration from root of animate options
}
```

## Not yet supported

### Strings & Custom animation identifiers
Fade In on inserted:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "inserted": "fade-in"
    }
  }
});
```

Fade Out on removed:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "removed": "fade-out"
    }
  }
});
```

Custom animation when property is true:
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "hasError": "shake"
    }
  }
});
```

### CSS objects
Specify css object instead of function for before, after, and run
```
var scope = new can.Map({
  animateOptions: {
    "bindings":{
      "isActive": {
        //set up the element
        before:{
          "position":"relative",
          "left":"0px",
          "cursor": "wait"
        },
        //animate to this
        run:{
          "left":"10px"
        },
        //finalize the properties
        after:{
          "cursor":""
        }
      }
    }
  }
});

```





@demo src/demos/options-advanced/options-advanced.html