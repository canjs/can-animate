import QUnit from "steal-qunit";
import animate from "can-animate";
import can from "can";
import $ from "jquery";

QUnit.module("can-animate");

QUnit.test("basics", function(){
	ok(animate(),"something working");
});


