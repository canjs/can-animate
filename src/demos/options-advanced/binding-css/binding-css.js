import animate from "can-animate";
import can from "can";
import Zone from "can-zone";

var Scope = can.Map.extend({
    "hasError": false,
    animateOptions: {

        "duration": 2000,

        "bindings":{

            "$inserted": {
                "before": {
                    "opacity": 0
                },
                "run": {
                    "opacity": 1
                },
                duration: 1000
            },

            "$removed":{
                "run":{
                    "opacity": 0
                }
            },

            //---- hasError - function
            "hasError": function(opts){
                    //run custom pulse method
                    if(opts.context.attr("hasError")){
                        console.log("hasError - opts",arguments);
                        $(opts.el).fadeOut(200, function(){
                            $(opts.el).fadeIn(200, function(){
                                console.log("hasError animation done");
                            });
                        });
                    }else{
                        console.log("don't run animation");
                    }
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