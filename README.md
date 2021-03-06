# Observe

A tiny library for copying one of my favorite parts of KnockoutJS: observables.

## The Magic

The real magic here is dependency resolution: Computed variables can depend on
other observables and computed variables, and will automatically update when
their dependencies change:

```javascript
function Person(first_name, last_name) {
    var self = this;
    this.first_name = ob.observable(first_name);
    this.last_name = ob.observable(last_name);
    this.full_name = ob.computed(function() {
        return this.first_name() + ' ' + this.last_name();
    }, this);

    this.full_name.onchange(function() {
        console.log('Name has changed to ' + self.full_name());
    });
}

var mike = new Person('Michael', 'Kelly');
mike.first_name('Mike') // Changes full_name, which logs the name to the console.
```

## Observables

```javascript
// Create an observable
var myvar = ob.observable(1);

// Read the value
console.log('Value of myvar is ' + myvar());

// Write a new value
myvar(2);

// Register a listener
myvar.onchange(function(new_value) {
    console.log('Value changed to ' + new_value);
});
```

## Computed Variables

```javascript
// Create a computed variable
var first_name = 'Michael';
var last_name = 'Kelly';
var full_name = ob.computed(function() {
    return first_name + ' ' + last_name;
});
full_name(); // = 'Michael Kelly'

// Create a writable computed variable
var my_value = 1;
var myvar = ob.computed(function() {
    return 1 + my_value;
}, function(value) {
    my_value = value;
});
myvar(2); // myvar() = 1 + 2 = 3

// Specify value of `this` (3rd argument if writable)
function Person(first_name, last_name) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.full_name = computed(function() {
        return this.first_name + ' ' + this.last_name;
    }, this);
}
new Person('Michael', 'Kelly').full_name(); // = 'Michael Kelly'

// Create a lazy computed variable. Does not update when dependencies change,
// only when read.
var dependency = observable(1);
var myvar = computed(function() {
    return dependency() + 1;
});
myvar.lazy = true;

dependency(2);
myvar(); // myvar isn't reevaluated until this line.
```

## Misc

```javascript
// Load observe via AMD
define(function(require) {
    var ob = require('observe');
    var myvar = ob.observable(1);
});
```

## MIT License

Copyright (c) 2012 Michael Kelly

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
