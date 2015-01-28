import animate from "can-animate";
import can from "can";
import $ from "jquery";

var scope = new can.Map({
	names: ['Adam', 'Bob', 'Steve', 'Fred'],
	remove: function(name){
		var names = this.attr('names');
		names.splice(names.indexOf(name), 1);
	}
});

$('#content').html(can.view('#demo-html', scope));