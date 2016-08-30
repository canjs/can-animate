export default {

    "duration": 2000,

    "whens":{ // <= this name sucks
        "inserted": {
            "run": function(opts){
                console.log("inserted run", this, arguments);
                /* 
                    opts.context //the element's scope
                    opts.options //the animate options
                    opts.properties //the animate properties
                    opts.el //the element
                    opts.options.always //call when finished
                */

                //run custom scale in animation
                opts.el.animate(can.extend({},opts.properties,{
                    "margin-top":"0%",
                    "opacity":1
                }), opts.options.duration, function(){
                    opts.options.always();
                });
            },
            "before": function(opts){
                //can-animate will call this before 'run'
                opts.el.css({
                    "opacity":0,
                    "margin-top":"-1000px"
                });
            },
            "after": function(opts){
                //can-animate will call this when run is complete
            },
            duration: 1000
        },

        "removed": {
            "run": "fade-out" //this would run with a duration of 2000 (set in root of animate options)
        },
        /* possible alternative:
        "removed": "fade-out"
        */

        "{hasError}": { //not inserted or removed => scope property to bind to
            "run": function(opts){
                console.log("hasError run", this, arguments);
                //run custom shake method
                //run opts.fn when done
            },
            "duration": 1500 //can override the duration from root of animate options
        }
    }

};