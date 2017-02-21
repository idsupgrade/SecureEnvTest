/*eslint-env node */
"use strict";

var nconf = require("nconf");

/*
 * Initializes and validates the app configuration.
 */
exports.init = function() {
    nconf.env("__");
};
