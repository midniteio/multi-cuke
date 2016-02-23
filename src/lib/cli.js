#!/usr/bin/env node
import program from 'commander'
import _ from 'lodash'

import pkg from '../../package.json'

function collect(val, collection) {
  collection.push(val);
  return collection;
}

program
  .version(pkg.version)
  .description(
    'Takes (DIRNAME|FEATURE)+ as args with the following options,\n  parses qualifing scenarios out ' +
    'individually, and runs them in parallel via \n  Node\'s Cluster API'
  )
  .arguments('[paths]')
  .option('-t, --tag <tag>', 'Cucumber tag (repeatable)', collect, [])
  .option('-r, --require <path>', 'Require location for support files (repeatable)', collect, [])
  .option('-c, --cucumber <path>', 'Path to specific cucumber installation')
  .option('-w, --workers <int>', 'Number of workers (Defaults to # Processors)', parseInt)
  .option('-l, --logdir <path>', 'Output dir for test logs')
  .parse(process.argv);

let args = {
  paths: (program.args.length) ? program.args : undefined,
  tags: (program.tag.length) ? program.tag : undefined,
  requires: (program.require.length) ? program.require : undefined,
  cucumberPath: program.cucumber,
  workers: program.workers,
  logdir: program.logdir
};

export default _.omitBy(args, _.isUndefined);
