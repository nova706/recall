angular.module('recall').factory('recallLocalStorage', [
    '$document',
    '$window',

    function ($document, $window) {

        /**
         * The localStorage utility helps manage the storage and retrieval of registered application data.
         */
        var storage = {
            keys: {
                LAST_SYNC: 'LAST_SYNC'
            }
        };

        /**
         * Checks if the key is registered with the class.
         *
         * @param {String} key
         * @returns {Boolean} True if the key exists
         */
        var keyExists = function (key) {
            return storage.keys[key] !== undefined;
        };

        /**
         * Appends a modifier to a key
         * @param {String} key
         * @param {String} modifier
         * @returns {String} The key with the modifier appended.
         */
        var addKeyModifier = function (key, modifier) {
            if (modifier) {
                key += "_" + modifier;
            }
            return key;
        };

        /**
         * Register a new key with the local storage service.
         * @param {String} key
         */
        storage.registerKey = function (key) {
            if (!keyExists(key)) {
                storage.keys[key] = key;
            }
        };

        /**
         * Stores data by key in local browser storage.
         *
         * @param {String} key The key to use as the local storage name. Must be a key found in localStorage.keys.
         * @param {String} value The string value to store.
         * @param {String} keyModifier An additional identifier on the key.
         */
        storage.set = function (key, value, keyModifier) {
            if (keyExists(key)) {
                key = addKeyModifier(key, keyModifier);
                if (storage.supportsLocalStorage()) {
                    $window.localStorage.setItem(key, value);
                } else {
                    var life = 60 * 60 * 24 * 5;
                    var v = encodeURIComponent(value);
                    $document.cookie = key + '=' + v + '; max-age=' + life + ';';
                }
            }
        };

        /**
         * Retrieves stored data by key.
         *
         * @param {String} key The key of the data to retrieve. Must be a key found in localStorage.keys.
         * @param {String} keyModifier An additional identifier on the key.
         * @return {String} The string value stored.
         */
        storage.get = function (key, keyModifier) {
            var value = "";

            if (keyExists(key)) {
                key = addKeyModifier(key, keyModifier);
                if (storage.supportsLocalStorage()) {
                    value = $window.localStorage.getItem(key) || "";
                } else {
                    var regexp = new RegExp(key + "=([^;]+)", "g");
                    var c = regexp.exec($document.cookie);

                    if (c) {
                        value = decodeURIComponent(c[1]) ;
                    }
                }
            }

            return value;
        };

        /**
         * Removes stored data by key.
         *
         * @param {String} key The key of the data to remove. Must be a key found in localStorage.keys.
         * @param {String} keyModifier An additional identifier on the key.
         */
        storage.remove = function (key, keyModifier) {
            if (keyExists(key)) {
                key = addKeyModifier(key, keyModifier);
                if (storage.supportsLocalStorage()) {
                    $window.localStorage.removeItem(key);
                } else {
                    $document.cookie = key + '=; max-age=0;';
                }
            }
        };

        /**
         * Checks if the browser supports html5 local storage.
         *
         * @private
         * @returns {Boolean} True if the browser does support html5 local storage.
         */
        storage.supportsLocalStorage = function () {
            try {
                return 'localStorage' in $window && $window.localStorage !== null;
            } catch (e) {
                return false;
            }
        };

        return storage;
    }
]);