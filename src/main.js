import fs from 'fs-extra'
import _ from 'lodash'
import Promise from 'bluebird'
import TestHandler from './lib/test-handler'
import sigintHandler from './lib/sigint-handler'

// Run if invoked from command line with CLI args
if (!module.parent) {
  let cliOptions = require('./lib/cli');
  cliOptions = _.omitBy(cliOptions.args, _.isUndefined);

  run(cliOptions).then((results) => {
    if (results.outputHandler) {
      console.log(results.outputHandler.getSummaryOutput());
    }
    process.exit(results.exitCode);
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
    'logDir': ".tmp-logs",
    'workerEnvVars': {},
    'silentSummary': false,
    'verbose': false,
    'inlineStream': false
  });

  if (options.workers === 1) {
    let cucumber = require(options.cucumberPath).Cli;
    let args = ['', '', options.paths.join(' ')];
    options.tags.forEach(function(arg) {
      args.push('-t');
      args.push(arg);
    });
    options.requires.forEach(function(arg) {
      args.push('-r');
      args.push(arg);
    });

    return new Promise(function(resolve) {
      cucumber(args).run(function (isSuccessful) {
        let exitCode = (isSuccessful) ? 0 : 1;
        resolve({exitCode: exitCode});
      });
    });

  } else {
    fs.ensureDir(options.logDir);

    let cukeRunner = new TestHandler(options);
    sigintHandler(cukeRunner);

    return cukeRunner.run();
  }
}
