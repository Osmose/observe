define(function(require) {
    var observable = require('observe').observable;

    test('An observable stores a normal value correctly.', function() {
        var myvar = observable(1);
        equal(myvar(), 1);

        myvar(2);
        equal(myvar(), 2);
    });

    test('You can chain assignments to an observable.', function() {
        var myvar = observable(1);
        myvar(2)(3);
        equal(myvar(), 3);
    });

    test('You can register listeners on an observable.', function() {
        var myvar = observable(1);
        var new_value = null;

        myvar.onchange(function(my_new_value) {
            new_value = my_new_value;
        });

        myvar(5);
        equal(new_value, 5);
    });
});
