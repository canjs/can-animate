import animate from "can-animate";
import can from "can";
import animateOptions from "./animations";
import Zone from "can-zone";

var scope = new can.Map({
    "hasError": false,
    animateOptions: {

        "duration": 2000,

        "bindings":{

            //---- inserted - function
            //TODO: when passed this way, opts doesn't have properties (like duration) passed from parent
            // "inserted": function(opts){
            //     $(opts.el)
            //     .css({
            //         opacity:0,
            //         top:"-100px"
            //     })
            //     .animate({
            //         "opacity":1,
            //         "top":"0px"
            //     }, 1000, function(){
            //         console.log("inserted done");
            //     });
            // },
            
            //---- inserted - object - custom functions
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

            //---- removed - function
            //TODO: when passed this way, opts doesn't have properties (like duration) passed from parent
            // "removed": function(opts){
            //     $(opts.el).animate({
            //         "opacity":0,
            //         "top":"-100px"
            //     }, opts.options.duration, function(){
            //         console.log("removed done");
            //     });
            // },

            //---- removed - object - run string & after callback
            "removed": {
                "run": "fade-out", //this would run with a duration of 2000 (set in root of animate options)
                "after": function(){
                    console.log("removed - after");
                }
            },

            //---- removed - simple string (not yet supported)
            // "removed": "fade-out",

            //---- hasError - string (not yet supported)
            // "hasError": "shake" //would require an external plugin strategy

            //---- hasError - function
            "hasError": function(opts){
                    //run custom shake method
                    //run opts.fn when done
                    console.log("hasError - opts",arguments);
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


            //---- hasError - object - custom functions
            // "hasError": {
            //     "run": function(opts){
            //         console.log("hasError - opts",arguments);
            //         if(opts.context.attr("hasError")){
            //             console.log("run animation");
            //             $(opts.el).fadeOut(opts.options.duration, function(){
            //                 $(opts.el).fadeIn(opts.options.duration, function(){
            //                     console.log("hasError animation done");
            //                 });
            //             });
            //         }else{
            //             console.log("don't run animation");
            //         }
            //     },
            //     before: function(opts){
            //         console.log("hasError before", arguments);
            //         if(!opts.context.attr("hasError")){
            //             console.log("hasError before - doesn't have error - return false");
            //             return false;
            //         }
            //     },
            //     after: function(){
            //         console.log("hasError after", arguments);
            //     },
            //     "duration": 1500 //can override the duration from root of animate options
            // }
        }
    }
});

var $content = can.$("#content"),
    $demoHtml = can.$("#demo-html"),
    $addButton = can.$(".add-modal");

$addButton.click(function(){
    $('#content').html(can.view('#demo-html', scope));
});

$content.on("click", function(ev){
    var $target = can.$(ev.target);

    if($target.is(".cancel")){
        console.log("iscancel");
        can.remove($target.closest(".modal"));
    }else if($target.is(".confirm")){
        var $modal = $target.closest(".modal"),
            $input = $modal.find("input"),
            value = $input.val();
        scope.attr("hasError", false);

            console.log("value", value);
        if(!value || !value.length){
            console.log("! has value");
            scope.attr("hasError", true);
        }else{
            //do something with the value
            //then close
            can.remove($modal);
        }
    }
});

$content.on("removed", function(){
    console.log("bind to removed");
});

