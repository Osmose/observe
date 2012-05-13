define(function(require) {
    var observable = require('observe').observable;
    var computed = require('observe').computed;

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

    test('You can create a computed variable.', function() {
        var first_name = 'Michael';
        var last_name = 'Kelly';

        var full_name = computed(function() {
            return first_name + ' ' + last_name;
        });

        equal(full_name(), 'Michael Kelly');
    });

    test('You can create a writable computed variable.', function() {
        var first_name = 'Michael';
        var last_name = 'Kelly';

        var full_name = computed(function() {
            return first_name + ' ' + last_name;
        }, function(name) {
            var names = name.split(' ', 2);
            first_name = names[0];
            last_name = names[1];
        });

        full_name('Keith Johnson');
        equal(first_name, 'Keith');
        equal(last_name, 'Johnson');
        equal(full_name(), 'Keith Johnson');
    });

    test('You can register listeners on a computed variable.', function() {
        var stored = 2;
        var myvar = computed(function() {
            return 1 + stored;
        }, function(value) {
            stored = value;
        });

        var listened_value = null;
        myvar.onchange(function(new_value) {
            listened_value = new_value;
        });

        myvar(4);
        equal(listened_value, 5);
    });

    test('Computed variables can take a context argument.', function() {
        function Person(first_name, last_name) {
            this.first_name = first_name;
            this.last_name = last_name;
            this.full_name = computed(function() {
                return this.first_name + ' ' + this.last_name;
            }, this);
        }

        var mike = new Person('Michael', 'Kelly');
        equal(mike.full_name(), 'Michael Kelly');

        // Test context with a write function.
        function Person2(first_name, last_name) {
            this.first_name = first_name;
            this.last_name = last_name;
            this.full_name = computed(function() {
                return this.first_name + ' ' + this.last_name;
            }, function(name) {
                var names = name.split(' ', 2);
                this.first_name = names[0];
                this.last_name = names[1];
            }, this);
        }

        var keith = new Person2('Keith', 'Johnson');
        equal(keith.full_name(), 'Keith Johnson');

        keith.full_name('Eric Wells');
        equal(keith.first_name, 'Eric');
        equal(keith.last_name, 'Wells');
        equal(keith.full_name(), 'Eric Wells');
    });

    test('Computed variables automatically update if an observable it ' +
         'depends upon updates.', function() {
             var myvar = observable(1);
             var myvar2 = computed(function() {
                 return 1 + myvar();
             });

             equal(myvar2(), 2);

             myvar(2);
             equal(myvar2(), 3);
         });

    test('Computed variables can depend on other computed variables.',
         function() {
             var myvar = observable(1);
             var myvar2 = computed(function() {
                 return 1 + myvar();
             });
             var myvar3 = computed(function() {
                 return 'myvar2 is ' + myvar2();
             });

             equal(myvar3(), 'myvar2 is 2');

             myvar(2);
             equal(myvar3(), 'myvar2 is 3');
         });

    test('Computed variables can be set to evaluate only when read.',
         function() {
             var called = 0;

             var dependency = observable(1);
             var myvar = computed(function() {
                 called++;
                 return dependency() + 1;
             });
             equal(called, 1);

             dependency(2);
             equal(called, 2);

             myvar.lazy = true;
             dependency(3);
             equal(called, 2);
             myvar();
             equal(called, 3);
         });
});
