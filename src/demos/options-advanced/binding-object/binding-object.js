import animate from "can-animate";
import can from "can";
import Zone from "can-zone";

var Scope = can.Map.extend({
    "hasError": false,
    animateOptions: {

        "duration": 2000,

        "bindings":{
            
            //---- inserted - object - custom functions
            "$inserted": {
                "run": function(opts){
                    console.log("inserted - running");
                    opts.$el.hide().fadeIn(opts.duration, function(){
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

            //---- removed
            "$removed": {
                "run": function(opts){
                    console.log("removed - running");
                    opts.$el.fadeOut(opts.duration, function(){
                        console.log("removed - animation done");
                    });

                },
                "after": function(){
                    console.log("removed - after");
                }
            },

            //---- hasError - object - custom functions
            "hasError": {
                "run": function(opts){
                    console.log("hasError - opts",arguments);
                    opts.$el.fadeOut(opts.duration, function(){
                        opts.$el.fadeIn(opts.duration, function(){
                            console.log("hasError animation done");
                        });
                    });
                },
                before: function(opts){
                    console.log("hasError before", arguments);
                    if(!opts.context.attr("hasError")){
                        console.log("hasError before - doesn't have error - return false");
                        return false;
                    }
                },
                after: function(){
                    console.log("hasError after", arguments);
                },
                "duration": 400 //can override the duration from root of animate options
            }
        }
    }
});

var $content = can.$("#content"),
    $demoHtml = can.$("#demo-html"),
    $addButton = can.$(".add-modal"),
    scope;

$addButton.click(function(){
    scope = new Scope();
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

        if(!value || !value.length){
            scope.attr("hasError", true);
        }else{
            //do something with the value
            //then close
            // can.remove($modal);
            $modal.remove();
        }
    }
});