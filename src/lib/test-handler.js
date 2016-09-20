import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import OutputHandler from './parsers/pretty';
import featureFinder from './feature-finder';
import VerboseLogger from '../utils/verbose-logger';
import Worker from './worker';

export default class TestHandler {
  constructor(options) {
    this.outputHandler = new OutputHandler();
    this.silentSummary = options.silentSummary;
    this.failFast = options.failFast;
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
        this.mergeLogs();
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
      for (var i = 0; i < this.options.workers; i++) {
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

  mergeLogs() {
    let testResults = [];
    let mergedFileName = path.join(this.options.logDir, 'merged', 'results.json');
    let logFilePaths = fs.readdirSync(this.options.logDir);
    logFilePaths.forEach((logFilePath) => {
      try {
        if (_.endsWith(logFilePath, '.json')) {
          testResults = _.concat(
            testResults,
            fs.readJsonSync(path.join(this.options.logDir, logFilePath), 'utf8')
          );
        }
      } catch (e) {
        // ignore errors from invalid/empty files
      }
    });
    fs.ensureDirSync(path.join(this.options.logDir, 'merged'));
    fs.writeFileSync(mergedFileName, JSON.stringify(testResults, null, 4));
  }

  createWorker(scenario) {
    this.verboseLogger.log('Initializing worker for: ' + scenario.featureFile + ':' + scenario.scenarioLine);
    let testOptions = {
      featureFile: scenario.featureFile,
      scenarioLine: scenario.scenarioLine,
      isScenarioOutline: scenario.isScenarioOutline,
      logDir: this.options.logDir,
      cucumberPath: this.options.cucumberPath.replace('lib', 'bin'),
      requires: this.options.requires,
      scenario: scenario,
      inlineStream: this.options.inlineStream
    };

    let worker = new Worker(testOptions);

    let done = (payload) => {
      let output = this.outputHandler.handleResult(payload);
      console.log(output);

      if (payload.exitCode !== 0) {
        this.overallExitCode = 1;
        if (this.failFast) {
          this.verboseLogger.log('Fail fast: A scenario failed, clearing remaining scenarios.');
          this.scenarios = [];
        }
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
    };

    this.workers.push(worker);

    return worker.execute()
      .then((result) => {
        return done(result);
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }

  kill() {
    this.workers.forEach((worker) => {
      worker.kill();
    });
  }
}
