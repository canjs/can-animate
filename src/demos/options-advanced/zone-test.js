import can from "can";
import Zone from "can-zone";

can.$(function(){
  //zone testing
  console.log("----zonetest: Start");
  new Zone().run(function(){
      return new Promise(function(res){
        $(".content").animate({
            "opacity":0
        }, 1000, function(){
          console.log("----zonetest: animaton done");
          res();
        });
      });
  }).then(function(){
      console.log("----zonetest: zone run done");
  });
  //end zone testing
});