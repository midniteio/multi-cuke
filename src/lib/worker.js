import path from 'path'

const testOptions = JSON.parse(process.env.testOptions);
const cucumber = require(testOptions.cucumberPath).Cli;

const featureFile = process.env.featureFile;
const featureFileData = path.parse(process.env.featureFile);
const featureName = featureFileData.name;
const scenarioLine = process.env.scenarioLine;
const logFileName = featureName + '-line-' + scenarioLine + '.json';
const logFile = path.join(testOptions.logDir, logFileName);
const relativeLogFile = path.relative(process.cwd(), logFile);

let args = ['', '', featureFile + ':' + scenarioLine, '-f', 'json:' + relativeLogFile];

testOptions.requires.forEach(function(arg) {
  args.push('-r');
  args.push(arg);
});

let startTime = new Date();

try {
  cucumber(args).run(function(isSuccessful) {
    let exitCode = (isSuccessful) ? 0 : 1;
    process.send({
      exitCode: exitCode,
      resultFile: logFile,
      duration: new Date() - startTime
    });
  });
} catch (e) {
  process.send({
    exitCode: 1,
    exception: e.stack,
    featureFile: featureFile,
    scenarioLine: scenarioLine,
    duration: new Date() - startTime
  });
}
