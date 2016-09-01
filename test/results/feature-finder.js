import path from 'path';

module.exports = {
  default: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 14
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      scenarioLine: 4
    },
    {
      featureFile: path.join('test','features','sample3.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test','features','sample3.feature'),
      scenarioLine: 8
    }
  ],
  tagged: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      scenarioLine: 4
    }
  ],
  negatedTag: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 14
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      scenarioLine: 4
    },
    {
      featureFile: path.join('test','features','sample3.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test','features','sample3.feature'),
      scenarioLine: 8
    }
  ],
  multipleTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    }
  ],
  mixedTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    }
  ],
  orOperatorTags: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      scenarioLine: 4
    }
  ],
  featurePath: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 14
    }
  ],
  multiplePaths: [
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 7
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 11
    },
    {
      featureFile: path.join('test', 'features', 'sample.feature'),
      scenarioLine: 14
    },
    {
      featureFile: path.join('test', 'features', 'sample2.feature'),
      scenarioLine: 4
    }
  ]
};
