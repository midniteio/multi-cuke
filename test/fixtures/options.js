module.exports = {
  default: {
    paths: ['test/features'],
    tags: [],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true,
    mergedLog: 'merged/results.json'
  },
  tagged: {
    paths: ['test/features'],
    tags: ['@UnitTest'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  negatedTag: {
    paths: ['test/features'],
    tags: ['~@Ignore'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  multipleTags: {
    paths: ['test/features'],
    tags: ['@UnitTest', '@Secondary'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  featureTags: {
    paths: ['test/features'],
    tags: ['@FeatureTag'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  mixedTags: {
    paths: ['test/features'],
    tags: ['@Secondary', '~@Ignore'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  orOperatorTags: {
    paths: ['test/features'],
    tags: ['@Secondary,@UnitTest'],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  featurePath: {
    paths: ['test/features/sample.feature'],
    tags: [],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  },
  multiplePaths: {
    paths: ['test/features/sample.feature', 'test/features/sample2.feature'],
    tags: [],
    requires: [],
    cucumberPath: require.resolve('cucumber'),
    workers: 1,
    logDir: '.unit-test-tmp',
    silentSummary: true
  }
};
