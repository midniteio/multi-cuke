export default class VerboseLogger {
  constructor(enabled) {
    this.enabled = enabled;
  }

  log(output) {
    if (!this.enabled) {
      return false;
    }

    if (typeof output === 'object') {
      output = JSON.stringify(output, null, 2)
    }

    let timestamp = new Date().toISOString();
    timestamp = timestamp.replace('T', ' ')
      .substring(0, timestamp.indexOf('.'));

    let datePrefix = '[' + timestamp + '] ';
    console.log(datePrefix + output);
  }

  logScenarios(scenarios) {
    if (!this.enabled) {
      return false;
    }

    scenarios.forEach((scenario) => {
      this.log(scenario.featureFile + ':' + scenario.scenarioLine);
    });
  }
};
