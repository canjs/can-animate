import animate from "can-animate";
import can from "can";
import $ from "jquery";

var scope = new can.Map({
    "hasError": false
});

$('#content').html(can.view('#demo-html', scope));