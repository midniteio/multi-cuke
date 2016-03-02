import {cpus} from 'os'
import {fork} from 'child_process'
import path from 'path'
import OutputHandler from './parsers/pretty'
import featureFinder from './feature-finder'
import _ from 'lodash'
import Promise from 'bluebird'

let maxWorkers = cpus().length;

export default class TestHandler {
  constructor(options) {
    this.outputHandler = new OutputHandler();
    this.workers = [];
    this.scenarios = [];
    this.options = options;
    this.overallExitCode = 0;
    this.summaryData = {};
  }

  run() {
    return this.runTestSuite()
      .then(() => {
        return this.waitForChildren();
      })
      .then(() => {
        return {
          exitCode: this.overallExitCode,
          outputHandler: this.outputHandler
        };
      })
  }

  runTestSuite() {
    return featureFinder(this.options).then((scenarios) => {
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
    let workerModulePath = path.join(__dirname, 'worker');
    let workerEnv = _.merge(
      scenario,
      { testOptions: JSON.stringify(this.options) },
      this.options.workerEnvVars
    );
    let worker = fork(workerModulePath, [], {
      env: workerEnv,
      silent: true
    });

    this.workers.push(worker);

    worker.on('message', (payload) => {
      let output = this.outputHandler.handleMessage(payload);
      console.log(output);

      if (payload.code !== 0) {
        this.overallExitCode = 1;
      }
    });

    worker.on('exit', () => {
      _.pull(this.workers, worker)

      if (!_.isEmpty(this.scenarios)) {
        this.workers.push(this.createWorker(this.scenarios.shift()));
      }

      if (_.isEmpty(this.scenarios) && _.isEmpty(this.workers)) {
        this.outputHandler.setEndTime();

        if (!this.silentSummary) {
          console.log(this.outputHandler.getSummaryOutput());
        }
      }
    });

    worker.on('error', (worker, error) => {
      console.log('Error caught: ', error);
    });

    return worker;
  }

  kill() {
    this.workers.forEach((worker) => {
      worker.kill();
    });
  }
}
