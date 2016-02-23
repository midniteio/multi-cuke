import path from 'path'
import fs from 'fs-extra'
import prettyMs from 'pretty-ms'
import _ from 'lodash'
import Gherkin from 'gherkin'
import colorMap from '../../../data/cucumber-color-map'
import {colorize, indent, buffer} from '../../utils/unix'

const gherkinParser = new Gherkin.Parser();

export default class PrettyParser {
  constructor(startTime) {
    this.startTime = new Date();
    this.totalSteps = 0;
    this.totalScenarios = 0;
    this.passedScenarios = 0;
    this.totalDuration = 0;
    this.stepStatuses = {};
    this.scenarioStatuses = {
      passed: 0,
      failed: 0
    };
    this.failedScenarios = [];
    this.undefinedSteps = [];
  }

  handleMessage(payload) {
    this.totalDuration += payload.duration;
    if (payload.exitCode === 0) {
      this.parseMessage(payload.resultFile);
    } else {
      this.parseException(payload.featureFile, payload.exception);
    }
  }

  parseMessage(resultsFile) {
    let logFileJSON = fs.readJsonSync(resultsFile);
    let feature = logFileJSON.pop();
    let featureFile = path.basename(feature.uri)
    let scenario = _.filter(feature.elements, ['type', 'scenario']).pop();
    let tagsArray = _.map(scenario.tags, 'name');

    let maxStepLength = findMaxStepTitleLength(scenario.steps);
    let passed = true;

    buffer.log('Feature: ' + feature.name);
    if (!_.isEmpty(tagsArray)) {
      buffer.log(colorize(indent(1) + tagsArray.join(' '), colorMap.tag));
    }
    buffer.log(indent(1) + 'Scenario: ' + scenario.name);

    scenario.steps.forEach((step) => {
      if (!step.hidden) {
        let stepDesc = colorize(
          indent(2) + _.padEnd(step.keyword + step.name, maxStepLength) + indent(1),
          colorMap[step.result.status]
          );
        let lineStr = colorize('# ' + featureFile + ':' + step.line, colorMap.comment);
        buffer.log(stepDesc + lineStr);

        if (step.result.status === 'failed') {
          buffer.log(colorize(indent(2) + step.result.error_message + '\n', 'red'));
          passed = false;
        }
      }

      if (step.hidden && step.result.status === 'failed') {
        buffer.log(colorize(indent(2) + _.padEnd(step.keyword, maxStepLength) + indent(1), 'red'));
        buffer.log(colorize(indent(2) + step.result.error_message + '\n', 'red'));
      }

      if (step.result.status.toLowerCase() === 'undefined' && !_.includes(this.undefinedSteps, step.keyword + step.name)) {
        this.undefinedSteps.push(step.keyword + step.name);
      }

      if (this.stepStatuses[step.result.status]) {
        this.stepStatuses[step.result.status]++;
      } else {
        this.stepStatuses[step.result.status] = 1;
      }

      this.totalSteps++;
    });

    if (passed) {
      this.scenarioStatuses.passed++;
    } else {
      this.failedScenarios.push(featureFile + ':' + scenario.line + ' # ' + scenario.name);
      this.scenarioStatuses.failed++;
    }

    console.log(buffer.dump());
    this.totalScenarios++;
  }

  parseException(featureFile, exception) {
    let file = fs.readFileSync(featureFile, { encoding: 'utf8' });
    let feature = gherkinParser.parse(file);
    let scenario = feature.scenarioDefinitions.pop();

    buffer.log('Feature: ' + feature.name);

    if (scenario.tags) {
      let tagsArray = _.map(scenario.tags, 'name');
      buffer.log(colorize(indent(1) + tagsArray.join(' '), colorMap.tag));
    }

    buffer.log(indent(1) + 'Scenario: ' + scenario.name);
    buffer.log(colorize(indent(1) + exception, 'red'));
    console.log(buffer.dump());

    this.failedScenarios.push(path.basename(featureFile) + ':' + scenario.line + ' # ' + scenario.name);
    this.scenarioStatuses.failed++;
    this.totalScenarios++;
  }

  outputSummary() {
    let endDuration = new Date() - this.startTime;
    let pluralize = (this.totalScenarios === 1) ? 'scenario' : 'scenarios';
    let stepDescription = (this.totalSteps > 0) ? ' steps (' + statusToString(this.stepStatuses) + ')' : ' steps';
    let percentGain = (this.totalDuration === 0) ? 'N/A' : Math.round((this.totalDuration/ endDuration) * 100) + '%';

    if (!_.isEmpty(this.failedScenarios)) {
      console.log(colorize('Failed scenarios:', colorMap.failed));
      console.log(colorize(this.failedScenarios.join('\n'), colorMap.failed) + '\n');
    }

    if (!_.isEmpty(this.undefinedSteps)) {
      console.log(colorize('Undefined steps:', colorMap.undefined));
      console.log(colorize(this.undefinedSteps.join('\n'), colorMap.undefined) + '\n');
    }

    console.log('%s %s (%s)', this.totalScenarios, pluralize, statusToString(this.scenarioStatuses));
    console.log(this.totalSteps + stepDescription);
    console.log(
      'Total duration: %s (%s if ran in series - %s spped increase via parallelization)',
      prettyMs(endDuration),
      prettyMs(this.totalDuration),
      percentGain
    );
  }
}

function findMaxStepTitleLength(steps) {
  return steps.map((step) => {
    return (step.keyword + step.name).length;
  }).sort().shift();
}

function statusToString(statusObj) {
  let nonZeroStatuses = _.omitBy(statusObj, (value) => {
    return value === 0;
  });
  let output = _.map(nonZeroStatuses, (value, key) => {
    return colorize(value + ' ' + key, colorMap[key]);
  });
  return output.join(', ');
}
