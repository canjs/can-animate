 var animateAttrs = {
	"when": {
		setup : function(){},
		teardown: function(){},
	}
};

var go = function(el, attrData){
	if( !can.data(el, "processed") ) {
		can.data(el, "processed", true);
		
		var data = animateAttrs[attrData.attributeName].setup(el, attrData);
		
		var animationData =  {};
		can.data(el, "animationData", animationData);
		
		can.each( el.attributes, function(attrName, attrValue){
			animationData[attrName.replace("can-animate","")] = animateAttrs[attrName].setup(attrValue);
		});
		
		can.animate(el, animationData);
	}
};


can.view.attr("-duration", go);
can.view.attr("-when", go);
can.view.attr("-start", go);