import QUnit from "steal-qunit";
import animate from "can-animate";
import can from "can";
import $ from "jquery";

QUnit.module("can-animate");

QUnit.test("calling can.animate falls back to jquery", function(assert) {
	var jq = $('<div>');
	// jQuery.animate returns the jQuery object
	assert.equal(animate(jq), jq);
});

QUnit.test("basic animation works", function(assert) {
	$('#qunit-fixture').append($('<div class="animated">'));
	var div = $('div.animated');

	var done = assert.async();
	can.animate(div, {height: '200px'}, {
		complete: function(){
			assert.equal(div.css('height'), '200px', 'height animated by can.animate');
			done();
		}
	});

});

QUnit.module("can-animate/attribute-setup")

var attrSetupTest = function(name, key, property, value, title, customEl, context){
	var animationData = {
		properties: {},
		options: {}
	}

	if(customEl){
		animationData.element = customEl;
	}

	if(context){
		animationData.context = context;
	}

	QUnit.test(title, function(assert) {
		animate.animateAttrs[name].setup.call(animationData, customEl, key);

		if(context){
			assert.deepEqual(value, can.getObject(property, animationData));
		}else if(property){
			assert.equal(value, can.getObject(property, animationData));
		}else {
			assert.deepEqual(animationData, value);
		}
	});
};

var scopeMethod = function(){};

var scope = new can.Map({
	scopeOptions: {foo: 'bar'},
	scopeMethod: scopeMethod,
	scopeStyle: {'font-size': '12px', color: 'red'}
});

attrSetupTest('options', '{scopeOptions}', 'options', {foo: 'bar'},
							'options set from scope property', null, scope);

attrSetupTest('duration', 'slow', 'options.duration', 'slow',
							'duration set as string');

attrSetupTest('duration', '300', 'options.duration', 300,
							'duration set as number');

attrSetupTest('fade-in', 'slow', null,
	{properties: {opacity: '1'}, options: {duration: 'slow'},
	 element: {style: {}}},
	'fade in opacity and duration set', {style: {}});

attrSetupTest('fade-in', 'slow', null,
	{properties: {opacity: '1'}, options: {duration: 'slow'},
	 element: {style: {opacity: 0}}},
	'fade in starting style set when empty string', {style: { opacity: '' }});

attrSetupTest('fade-toggle', 'slow', null,
	{properties: {opacity: 'toggle'}, options: {duration: 'slow'}},
	'fade toggle properties and options set');

attrSetupTest('when', 'inserted', 'when', 'inserted',
	'when set');

attrSetupTest('inserted', undefined, 'when', 'inserted',
	'can-animate-inserted sets "when" to "inserted"');

attrSetupTest('removed', undefined, 'when', 'removed',
	'can-animate-removed sets "when" to "removed"');

attrSetupTest('style', '{scopeStyle}', 'properties',
	{'font-size': '12px', color: 'red'},
	'style set from a string', null, scope);

attrSetupTest('style', 'color: red; font-size: 12px', 'properties',
	{'font-size': '12px', color: 'red'},
	'style set from a property', null, scope);

attrSetupTest('start', '{scopeMethod}', 'options.start', scopeMethod,
	'start method set from scope property', null, scope);

attrSetupTest('complete', '{scopeMethod}', 'options.complete', scopeMethod,
	'complete method set from scope property', null, scope);

QUnit.module('can-animate/removal');

var animationTest = function(name, animateText, options){
	var text = '<div class="animated" ';
	var scope = new can.Map({});

	if(options && options.start){
		text = text + 'can-animate-start="{start}" ';
		scope.attr('start', options.start);
	}
	if(options && options.complete){
		text = text + 'can-animate-complete="{complete}" ';
		scope.attr('complete', options.complete);
	}
	text = text + animateText;
	text = text + '></div>';

	QUnit.test(name, function(assert) {
		if(options.before){
			options.before();
		}
		$('#qunit-fixture').html(can.view.stache(text)(scope));
		if(options.after){
			options.after();
		}
	})
}

animationTest('fade in on insertion', 
	'can-animate-fade-in="slow"',
	{
		start: function(){assert.equal(this.style.opacity, 0)},
		complete: function(){assert.equal(this.style.opacity, 1); done()},
		before: function(){
			assert.expect(2);
			var done = assert.async();
		}
	});

animationTest('fades out before removal',
	'can-animate-when="removed" can-animate-fade-out="slow"',
	{
		start: function(){assert.equal(this.style.display, '');},
		complete: function(){assert.equal(this.style.display, 'none'); done();},
		before: function(){
			assert.expect(2);
			var done = assert.async();
		},
		after: function(){
			can.remove($('#qunit-fixture .animated'));
		}
	});
