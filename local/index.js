"use strict";

import {handler} from '../restApi/consulta/handler.js';

handler({query: "seguro"}, {done: function(error, message){
    console.log("error:", error);
    console.log("message:", message);
}})
