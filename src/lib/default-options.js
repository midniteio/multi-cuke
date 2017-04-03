import path from 'path';

const defaultLogDir = ".tmp-logs";

module.exports = {
  'paths': ['features'],
  'tags': [],
  'requires': [],
  'cucumberPath': require.resolve("cucumber"),
  'workers': require('os').cpus().length,
  'logDir': defaultLogDir,
  'workerEnvVars': {},
  'silentSummary': false,
  'verbose': false,
  'inlineStream': false,
  'devMode': false,
  'strict': false,
  'mergedLog': path.join(defaultLogDir, 'merged','results.json')
};
