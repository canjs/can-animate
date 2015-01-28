import animate from "can-animate";
import can from "can";
import $ from "jquery";
import "jquery-ui";

var scope = new can.Map({
	triggerMove: false,
	run: function(){
		this.attr('triggerMove', true);
	}
});

$('#content').html(can.view('#demo-html', scope));