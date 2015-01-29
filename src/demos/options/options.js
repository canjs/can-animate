import animate from "can-animate";
import can from "can";
import $ from "jquery";

var scope = new can.Map({
	options: {
		duration: 2000
	}
});

$('#content').html(can.view('#demo-html', scope));