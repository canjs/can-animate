import QUnit from "steal-qunit";
import animate from "can-animate";
import can from "can";
import $ from "jquery";

QUnit.module("can-animate");

QUnit.test("calling can.animate falls back to jquery", function(){
	var jq = $('<div>');
	// jQuery.animate returns the jQuery object
	equal(animate(jq), jq);
});

QUnit.test("basic animation works", function(){
	$('#qunit-fixture').append($('<div class="animated">'));
	var div = $('div.animated');

	stop();
	can.animate(div, {height: '200px'}, {
		complete: function(){
			equal(div.css('height'), '200px', 'height animated by can.animate');
			start();
		}
	});

});