(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.ob = factory();
    }
}(function () {
    var ob = {};
    var global_dependencies = null;

    /**
     * Define an observable variable.
     */
    ob.observable = function(initial_value) {
        var _value = initial_value;
        var listeners = [];

        var observable = function(value) {
            if (value === undefined) {
                // Add to dependency chain if being tracked.
                if (global_dependencies !== null) {
                    global_dependencies.push(observable);
                }

                return _value;
            } else {
                _value = value;
                notifyListeners(listeners, value);

                return observable; // For chained assignments.
            }
        };

        observable.onchange = createOnChange(listeners);

        return observable;
    };

    /**
     * Define a computed variable.
     *
     * If write is not provided, variable is read-only.
     */
    ob.computed = function(read, write, context) {
        var changed = false;
        var listeners = [];

        // Swap write and context if write is not a function.
        if (write !== undefined && typeof write !== 'function') {
            context = write;
            write = undefined;
        }

        var computed = function() {
            if (arguments.length === 0) {
                // Add to global dependencies if being tracked.
                if (global_dependencies !== null) {
                    global_dependencies.push(computed);
                }

                // Check for lazy evaluation.
                if (computed.lazy === true && changed === true) {
                    _value = read.call(context);
                    notifyListeners(listeners, _value);
                }

                return _value;
            } else if (write === undefined) {
                // TODO: Better error message.
                throw 'Error: Trying to write to a read-only value!';
            } else {
                write.apply(context, arguments);
                _value = read.call(context);
                notifyListeners(listeners, _value);

                return computed; // For chained assigments.
            }
        };

        computed.lazy = false; // If true, does not evaluate the new value
                               // after a dependency changes until this is read.
        computed.onchange = createOnChange(listeners);

        // Track dependencies.
        global_dependencies = [];
        var _value = read.call(context);
        for (var k = 0; k < global_dependencies.length; k++) {
            global_dependencies[k].onchange(function() {
                if (computed.lazy === true) {
                    changed = true;
                } else {
                    _value = read.call(context);
                    notifyListeners(listeners, _value);
                }
            });
        }
        global_dependencies = null;

        return computed;
    };

    /**
     * Send a notification out to the registered listeners.
     *
     * Extra arguments are passed to the listeners.
     */
    function notifyListeners(listeners) {
        var change_args = Array.prototype.slice.call(arguments, 1);
        for (var k = 0; k < listeners.length; k++) {
            listeners[k].apply(window, change_args);
        }
    }

    /**
     * Generate an onchange handler for the given listener list.
     */
    function createOnChange(listeners) {
        return function() {
            for (var k = 0; k < arguments.length; k++) {
                listeners.push(arguments[k]);
            }
        };
    }

    return ob;
}));
