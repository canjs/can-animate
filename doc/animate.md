@page can-animate
@group can-animate.guides 0 Guides
@group can-animate.api 1 API
@group can-animate.examples 2 Examples

# can-animate

`can-animate` is a plugin for [CanJS](http://canjs.com)
that provides animation helpers through the use of
[`can.view.attr`](http://canjs.com/docs/can.view.attr.html).

Instead of:

    $('.list-item').bind('removed', function(){
        $(this).fadeOut();
    });

This plugin allows for things like:

    <ul>
        \{{#each list}}
        <li can-animate-fade-out="slow">
            \{{text}}
        </li>
        \{{/each}}
    </ul>

## Features

* Basic animations (fade in/out and slide in/out)
* Custom animation triggering
    - Based on DOM events
    - Based on changes in observable data
* Animation options specified:
    - As a string in an attribute
    - As a property in a template's scope
* `Start` and `Complete` callbacks
* Fine-grained and complete configuration for [jQuery animations](http://api.jquery.com/animate/)


