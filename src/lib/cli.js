#!/usr/bin/env node
import program from 'commander';
import pkg from '../../package.json';
import defaultOptions from './default-options';

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
  .option('-l, --log-dir <path>', 'Output dir for test logs. Default: ' + defaultOptions.logDir)
  .option('-s, --silent-summary', 'Silences summary output so it can be handled via the returned promise')
  .option('-v, --verbose', 'Adds verbose output to console')
  .option('-i, --inline-stream',
    'Inlines stream in real time in addition to multi-cuke output. ' +
    '*Note* This adds complexity to the logs that are hard to decipher, but included if needed for debugging'
  )
  .option('-d, --dev-mode', 'Shortcut for running cucumber-js directly')
  .option('--fail-fast', 'abort the run on first failure')
  .option('--strict', 'Fail fast if a step is undefined')
  .option('--merged-log <path>', 'Path for merged log. Default: ' + defaultOptions.mergedLog)
  .option('--disable-merged-log', 'Prevents the merged log from being written')
  // Deprecated options to be deleted with v1.0.0
  .option('--logdir <path>', 'DEPRECATED, use --log-dir instead')
  .option('--silentsummary', 'DEPRECATED, use --silent-summary instead')
  .option('--inlinestream', 'DEPRECATED, use --inline-stream instead')
  .option('--devMode', 'DEPRECATED, use --dev-mode instead')
  .parse(process.argv);

const deprecationFlags = [
  {oldFlag: '--logdir', newFlag: '--log-dir'},
  {oldFlag: '--silentsummary', newFlag: '--silent-summary'},
  {oldFlag: '--inlinestream', newFlag: '--inline-stream'},
  {oldFlag: '--devMode', newFlag: '--dev-mode'}
];

deprecationFlags.forEach(({oldFlag, newFlag}) => {
  if (program.rawArgs.includes(oldFlag)) {
    console.warn(`'${oldFlag}' is deprecated and will be removed in future versions. Please use '${newFlag}' instead`);
  }
});

export const args = {
  paths: (program.args.length) ? program.args : undefined,
  tags: (program.tag.length) ? program.tag : undefined,
  requires: (program.require.length) ? program.require : undefined,
  cucumberPath: program.cucumber,
  workers: program.workers,
  logDir: program.logDir || program.logdir,
  silentSummary: program.silentSummary || program.silentsummary,
  verbose: program.verbose,
  inlineStream: program.inlineStream || program.inlinestream,
  devMode: program.devMode,
  failFast: program.failFast,
  strict: program.strict,
  mergedLog: program.mergedLog,
  disableMergedLog: program.disableMergedLog
};
