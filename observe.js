define(function(require, exports) {
    /**
     * Define an observable variable.
     */
    exports.observable = function(initial_value) {
        var _value = initial_value;
        var listeners = [];

        var observable = function(value) {
            if (value === undefined) {
                return _value;
            } else {
                _value = value;
                for (var k = 0; k < listeners.length; k++) {
                    listeners[k].call(window, value);
                }

                return observable; // For chained assignments
            }
        };

        observable.onchange = function() {
            for (var k = 0; k < arguments.length; k++) {
                listeners.push(arguments[k]);
            }
        };

        return observable;
    };
});
