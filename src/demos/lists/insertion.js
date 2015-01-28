import animate from "can-animate";
import can from "can";
import $ from "jquery";

var scope = new can.Map({
	names: ['Adam'],
	addName: function(context, el, ev){
		this.attr('names').push(el.val());
		el.val('');
	}
});

$('#content').html(can.view('#demo-html', scope));