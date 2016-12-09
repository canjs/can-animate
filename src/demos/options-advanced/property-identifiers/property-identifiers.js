import animate from "can-animate";
import can from "can";
import Zone from "can-zone";

var Scope = can.Map.extend({
    "hasError": false,
    "timeoutProp": "",
    "intervalProp": "",
    "intervalPropEquals": "go",
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
            "shake": function(opts){
                //run custom shake method
                opts.$el.animate({
                    "margin-top": 40
                }, 100, function(){
                    opts.$el.animate({
                        "margin-top": -40
                    }, 200, function(){
                        opts.$el.animate({
                            "margin-top": 0
                        }, 100, function(){
                            console.log("hasError animation done");
                        });
                    });
                });
            },
            "pulse": function(opts){
                //run custom shake method
                opts.$el.fadeOut(200, function(){
                    opts.$el.fadeIn(200, function(){
                        console.log("hasError animation done");
                    });
                });
            }
        },

        "duration": 600,

        "bindings":{
            "$inserted": "fade",
            "$removed": "fade",
            "!hasError": "pulse",
            "hasError!": "shake",
            "timeoutProp:go": "pulse",
            "intervalProp:{intervalPropEquals}": "shake"
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

    setTimeout(() => {
        scope.attr("timeoutProp", "nogo");
        setTimeout(() => {
            scope.attr("timeoutProp", "go");
            setInterval(() => {
                scope.attr("intervalProp", "go");
                scope.attr("intervalProp", "");
            }, 5000);
        }, 1000);
    }, 1000);
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

        // scope.attr("hasError", false);

        if(!value || !value.length){
            scope.attr("hasError", true);
        }else{
            scope.attr("hasError", false);
            setTimeout(() => {
                //do something with the value
                //then close
                can.remove($modal);
                // $modal.remove();

            }, 3000);
        }
    }
});