import fs from 'fs-extra'
import _ from 'lodash'
import TestHandler from './lib/test-handler'
import cliOptions from './lib/cli'
import sigintHandler from './lib/sigint-handler'

// Run if invoked from command line with CLI args
if (!module.parent) {
  run(cliOptions).then(function(exitCode) {
    process.exit(exitCode);
  });
}

// Run if invoked from being required by another modules with passed args
module.exports = function(options) {
  return run(options || {});
};

function run(options) {
  _.defaults(options, {
    'paths': ['features'],
    'tags': [],
    'requires': [],
    'cucumberPath': require.resolve("cucumber"),
    'workers': require('os').cpus().length,
    'logDir': ".tmp-logs"
  });
  
  fs.ensureDir(options.logDir);
  
  let cukeRunner = new TestHandler(options);
  sigintHandler(cukeRunner);
  
  return cukeRunner.run();
}
