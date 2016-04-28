import {cpus} from 'os';
import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import OutputHandler from './parsers/pretty';
import featureFinder from './feature-finder';
import VerboseLogger from '../utils/verbose-logger';
import Worker from './worker';

let maxWorkers = cpus().length;

export default class TestHandler {
  constructor(options) {
    this.outputHandler = new OutputHandler();
    this.silentSummary = options.silentSummary;
    this.verboseLogger = new VerboseLogger(options.verbose);
    this.workers = [];
    this.scenarios = [];
    this.options = options;
    this.overallExitCode = 0;
    this.summaryData = {};
  }

  run() {
    this.verboseLogger.log('Beginning test run with the following options:');
    this.verboseLogger.log(this.options);

    return this.runTestSuite()
      .then(() => {
        return this.waitForChildren();
      })
      .then(() => {
        return {
          exitCode: this.overallExitCode,
          outputHandler: this.outputHandler
        };
      });
  }

  runTestSuite() {
    return featureFinder(this.options).then((scenarios) => {
      this.verboseLogger.log('Scenarios found that match options:');
      this.verboseLogger.logScenarios(scenarios);

      if (_.isEmpty(scenarios)) {
        console.log('There are no scenarios found that match the options passed: \n', this.options);
      }

      this.scenarios = scenarios;
      for (var i = 0; i < Math.min(this.options.workers, maxWorkers); i++) {
        if (!_.isEmpty(scenarios)) {
          this.createWorker(scenarios.shift());
        }
      }
    });
  }

  waitForChildren() {
    return Promise.delay(500)
      .then(() => {
        if (_.isEmpty(this.scenarios) && _.isEmpty(this.workers)) {
          return this.outputHandler.scenarioStatuses.failed.length;
        } else {
          return this.waitForChildren();
        }
      });
  }

  createWorker(scenario) {
    this.verboseLogger.log('Initializing worker for: ' + scenario.featureFile + ':' + scenario.scenarioLine);

    let cucumberPath = './node_modules/cucumber/bin/cucumber.js';

    let testOptions = {
      featureFile: scenario.featureFile,
      scenarioLine: scenario.scenarioLine,
      logDir: this.options.logDir,
      cucumberPath: path.resolve(cucumberPath),
      requires: this.options.requires,
      scenario: scenario,
      inlineStream: this.options.inlineStream
    };

    let worker = new Worker(testOptions);

    let done = function(payload) {
      let output = this.outputHandler.handleResult(payload);
      console.log(output);

      if (payload.exitCode !== 0) {
        this.overallExitCode = 1;
      }

      _.pull(this.workers, worker);
      this.verboseLogger.log('Scenarios in progress:');
      this.verboseLogger.logScenarios(_.map(this.workers, 'scenario'));

      if (!_.isEmpty(this.scenarios)) {
        this.createWorker(this.scenarios.shift());
      }

      if (_.isEmpty(this.scenarios) && _.isEmpty(this.workers)) {
        this.outputHandler.setEndTime();

        if (!this.silentSummary) {
          console.log(this.outputHandler.getSummaryOutput());
        }
      }

      if (payload.exception) {
        console.log('Error caught: ', payload.exception);
      }
    }.bind(this);

    this.workers.push(worker);

    return worker.execute()
    .then(function(result) {
      return done(result);
    })
    .catch(function(err) {
      return done({
        type: 'result',
        exitCode: 10,
        exception: err,
        featureFile: scenario.featureFile,
        scenarioLine: scenario.scenarioLine,
        duration: 0
      });
    });
  }

  kill() {
    this.workers.forEach((worker) => {
      worker.kill();
    });
  }
}
