import path from 'path';
import {spawn} from 'child_process';
import Promise from 'bluebird';

export default class Worker {
  constructor(options) {
    this.options = options;
    this.featureFile = this.options.featureFile;
    this.featureFileData = path.parse(this.featureFile);
    this.featureName = this.featureFileData.name;
    this.scenarioLine = this.options.scenarioLine;
    this.logFileName = this.featureName + '-line-' + this.scenarioLine + '.json';
    this.logFile = path.join(this.options.logDir, this.logFileName);
    this.relativeLogFile = path.relative(process.cwd(), this.logFile);
    this.cucumberPath = this.options.cucumberPath;
    this.args = [this.featureFile + ':' + this.scenarioLine, '-f', 'json:' + this.relativeLogFile];
    this.options.requires.forEach(function(arg) {
      this.args.push('-r');
      this.args.push(arg);
    });
  }

  execute() {
    return new Promise(function(resolve) {
      let startTime = new Date();

      // TODO: allow inheriting stdio
      this.child = spawn(
        this.cucumberPath,
        this.args,
        {stdio: 'ignore'}
      );

      this.child.on('exit', function(code) {
        resolve({
          type: 'result',
          exitCode: code,
          featureFile: this.featureFile,
          scenarioLine: this.scenarioLine,
          resultFile: this.logFile,
          duration: new Date() - startTime
        });
      }.bind(this));

      this.child.on('error', function(err) {
        resolve({
          type: 'result',
          exitCode: 10,
          exception: err,
          featureFile: this.featureFile,
          scenarioLine: this.scenarioLine,
          duration: new Date() - startTime
        });
      }.bind(this));
    }.bind(this));
  }

  kill() {
    if (this.child) {
      this.child.kill();
    }
  }
}
