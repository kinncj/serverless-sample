'use strict';

import Consulta from './consulta.js';
import Cache    from 'node-cache';

let cache = new Cache({stdTTL: 5000, checkperiod: 5000});

module.exports.handler = function(event, context) {
    Consulta.create(event, function(error, response) {
        return context.done(error, response);
    }, cache);
};
