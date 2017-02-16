import path from 'path';

module.exports = {
  default: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 15
      },
      {
        featureFile: path.join('test', 'features', 'sample2.feature'),
        isScenarioOutline: false,
        scenarioLine: 4
      },
      {
        featureFile: path.join('test','features','sample3.feature'),
        isScenarioOutline: true,
        scenarioLine: 7
      },
      {
        featureFile: path.join('test','features','sample3.feature'),
        isScenarioOutline: true,
        scenarioLine: 8
      }
    ],
    didDetectErrors: false
  },
  tagged: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample2.feature'),
        isScenarioOutline: false,
        scenarioLine: 4
      }
    ],
    didDetectErrors: false
  },
  negatedTag: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 15
      },
      {
        featureFile: path.join('test', 'features', 'sample2.feature'),
        isScenarioOutline: false,
        scenarioLine: 4
      },
      {
        featureFile: path.join('test','features','sample3.feature'),
        isScenarioOutline: true,
        scenarioLine: 7
      },
      {
        featureFile: path.join('test','features','sample3.feature'),
        isScenarioOutline: true,
        scenarioLine: 8
      }
    ],
    didDetectErrors: false
  },
  multipleTags: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      }
    ],
    didDetectErrors: false
  },
  featureTags: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 15
      }
    ],
    didDetectErrors: false
  },
  mixedTags: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      }
    ],
    didDetectErrors: false
  },
  orOperatorTags: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample2.feature'),
        isScenarioOutline: false,
        scenarioLine: 4
      }
    ],
    didDetectErrors: false
  },
  featurePath: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 15
      }
    ],
    didDetectErrors: false
  },
  multiplePaths: {
    scenarios: [
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 8
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 12
      },
      {
        featureFile: path.join('test', 'features', 'sample.feature'),
        isScenarioOutline: false,
        scenarioLine: 15
      },
      {
        featureFile: path.join('test', 'features', 'sample2.feature'),
        isScenarioOutline: false,
        scenarioLine: 4
      }
    ],
    didDetectErrors: false
  }
};
