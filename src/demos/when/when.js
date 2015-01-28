import animate from "can-animate";
import can from "can";
import $ from "jquery";

var scope = new can.Map({
	count: 0,
	atFive: false,
	increment: function(){
		this.attr('count', this.attr('count') + 1);
		if(this.attr('count')>=5){
			this.attr('atFive', true);
		}
	}
});

$('#content').html(can.view('#demo-html', scope));