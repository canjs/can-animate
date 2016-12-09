import animate from "can-animate";
import can from "can";
import Zone from "can-zone";

var Scope = can.Map.extend({
    "hasError": false,
    animateOptions: {

        "mixins": {
            "fade": function(opts){
                if(opts.propertyIdentifier === "inserted" || !opts.$el.is(":visible")){
                    console.log("fade - running");
                    opts.$el.hide().fadeIn(opts.duration, function(){
                        console.log("fade - animation done");
                    });
                }else if(opts.propertyIdentifier === "removed" || opts.$el.is(":visible")){
                    console.log("fade - running");
                    opts.$el.fadeOut(opts.duration, function(){
                        console.log("fade - animation done");
                    });
                }
            },
            "pulse": function(opts){
                //run custom pulse method
                if(opts.context.attr("hasError")){
                    console.log("hasError - opts",arguments);
                    opts.$el.fadeOut(200, function(){
                        opts.$el.fadeIn(200, function(){
                            console.log("hasError animation done");
                        });
                    });
                }else{
                    console.log("don't run animation");
                }
            }
        },

        "duration": 2000,

        "bindings":{

            "$inserted": "fade",
            "$removed": "fade",
            "hasError": "pulse"
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