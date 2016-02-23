import {cpus} from 'os'
import {fork} from 'child_process'
import path from 'path'
import OutputHandler from './parsers/pretty'
import featureFinder from './feature-finder'
import _ from 'lodash'
import Promise from 'bluebird'

let maxWorkers = cpus().length;

export default class TestHandler {
  constructor(options, envVars) {
    this.outputHandler = new OutputHandler();
    this.workers = [];
    this.scenarios = [];
    this.options = options;
  }

  run() {
    return this.runTestSuite().then(() => {
      return this.waitForChildren();
    });
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
    let worker_env = _.merge(
      scenario,
      { testOptions: JSON.stringify(this.options) },
      this.options.workerEnvVars
    );
    let worker = fork(workerModulePath, [], {
      env: worker_env,
      silent: true
    });

    this.workers.push(worker);

    worker.on('message', (payload) => {
      this.outputHandler.handleMessage(payload)
    });

    worker.on('exit', (code, signal) => {
      _.pull(this.workers, worker)

      if (!_.isEmpty(this.scenarios)) {
        this.workers.push(this.createWorker(this.scenarios.shift()));
      }

      if (_.isEmpty(this.scenarios) && _.isEmpty(this.workers)) {
        this.outputHandler.outputSummary();
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
