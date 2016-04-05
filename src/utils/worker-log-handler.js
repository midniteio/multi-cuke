/*
This file must not include ES6 in order to support versions of node that do not include import, export,
or other ES6 functions as it intended to be required in any given cucumber world.
*/

var util = require('util');

module.exports = function() {
  var output = util.format.apply(util, arguments);

  if (!process.send) {
    console.log(output);
  } else {
    process.send({
      type: 'log',
      message: output
    });
  }
};
