import path from 'path';
import {spawn} from 'child_process';
import Promise from 'bluebird';

export default class Worker {
  constructor(options) {
    this.scenario = options.scenario;
    this.featureFile = options.featureFile;
    this.featureFileData = path.parse(this.featureFile);
    this.featureName = this.featureFileData.name;
    this.scenarioLine = options.scenarioLine;
    this.logFileName = this.featureName + '-line-' + this.scenarioLine + '.json';
    this.logFile = path.join(options.logDir, this.logFileName);
    this.relativeLogFile = path.relative(process.cwd(), this.logFile);
    this.cucumberPath = options.cucumberPath;
    this.args = [this.cucumberPath, this.featureFile + ':' + this.scenarioLine, '-f', 'json:' + this.relativeLogFile];
    options.requires.forEach((arg) => {
      this.args.push('-r');
      this.args.push(arg);
    });
    if (options.inlineStream) {
      this.ioMode = 'inherit';
    } else {
      this.ioMode = 'ignore';
    }
  }

  execute() {
    return new Promise((resolve) => {
      let startTime = new Date();

      this.child = spawn(
        process.execPath,
        this.args,
        {stdio: this.ioMode}
      );

      this.child.on('exit', (code) => {
        resolve({
          type: 'result',
          exitCode: code,
          featureFile: this.featureFile,
          scenarioLine: this.scenarioLine,
          resultFile: this.logFile,
          duration: new Date() - startTime
        });
      });

      this.child.on('error', (err) => {
        resolve({
          type: 'result',
          exitCode: 10,
          exception: err,
          featureFile: this.featureFile,
          scenarioLine: this.scenarioLine,
          duration: new Date() - startTime
        });
      });
    });
  }

  kill() {
    if (this.child) {
      this.child.kill();
    }
  }
}
