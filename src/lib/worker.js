import path from 'path';
import {spawn} from 'child_process';
import Promise from 'bluebird';

export default class Worker {
  constructor(options) {
    this.options = options;
  }

  execute() {
    return new Promise(function(resolve) {
      let featureFile = this.options.featureFile;
      let featureFileData = path.parse(featureFile);
      let featureName = featureFileData.name;
      let scenarioLine = this.options.scenarioLine;
      let logFileName = featureName + '-line-' + scenarioLine + '.json';
      let logFile = path.join(this.options.logDir, logFileName);
      let relativeLogFile = relativeLogFile = path.relative(process.cwd(), logFile);
      let cucumberPath = this.options.cucumberPath;
      let args = [featureFile + ':' + scenarioLine, '-f', 'json:' + relativeLogFile];

      this.options.requires.forEach(function(arg) {
        args.push('-r');
        args.push(arg);
      });

      // TODO: allow inheriting stdio
      this.child = spawn(
        cucumberPath,
        args,
        {stdio: 'ignore'}
      );

      let startTime = new Date();

      this.child.on('exit', function(code) {
        resolve({
          type: 'result',
          exitCode: code,
          featureFile: featureFile,
          scenarioLine: scenarioLine,
          resultFile: logFile,
          duration: new Date() - startTime
        });
      });

      this.child.on('error', function(err) {
        resolve({
          type: 'result',
          exitCode: 10,
          exception: err,
          featureFile: featureFile,
          scenarioLine: scenarioLine,
          duration: new Date() - startTime
        });
      });
    }.bind(this));
  }

  kill() {
    if (this.child) {
      this.child.kill();
    }
  }
}
