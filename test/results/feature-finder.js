import path from 'path';

module.exports = {
  default: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 14
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
  tagged: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      isScenarioOutline: false,
      scenarioLine: 4
    }
  ],
  negatedTag: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 14
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
  multipleTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    }
  ],
  mixedTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    }
  ],
  orOperatorTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      isScenarioOutline: false,
      scenarioLine: 4
    }
  ],
  featurePath: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 14
    }
  ],
  multiplePaths: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      isScenarioOutline: false,
      scenarioLine: 14
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      isScenarioOutline: false,
      scenarioLine: 4
    }
  ]
};
