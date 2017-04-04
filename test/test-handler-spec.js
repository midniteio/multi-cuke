import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs-extra';
import _ from 'lodash';

chai.use(chaiAsPromised);
chai.should();

import TestHandler from '../src/lib/test-handler';
import options from './fixtures/options';
import defaultOptions from '../src/lib/default-options';

const timeoutMs = 20000;

describe('Test Handler', function() {
  it('should wait for all children to exit before returning', function () {
    var opts = defaultOptions;
    this.timeout(timeoutMs);
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);

    return cukeRunner.run().then(() => {
      return cukeRunner.workers.should.be.empty;
    });
  });

  it('should return the overall exit code when all tests finish', function () {
    this.timeout(timeoutMs);
    fs.ensureDirSync(defaultOptions.logDir);

    function nonInjectedExitCode() {
      let cukeRunner = new TestHandler(defaultOptions);
      return cukeRunner.run();
    }

    function injectedExitCode() {
      fs.ensureDirSync(options.tagged.logDir);
      let injectedCukeRunner = new TestHandler(options.tagged);
      injectedCukeRunner.overallExitCode = 10;
      return injectedCukeRunner.run();
    }

    return Promise.all([ nonInjectedExitCode(), injectedExitCode() ])
    .then(([ cleanRun, injectedRun]) => {
      cleanRun.should.have.deep.property('exitCode').and.to.be.equal(0);
      injectedRun.should.have.deep.property('exitCode').and.to.be.equal(10);
    });
  });

  it('should return the output handler', function () {
    var opts = defaultOptions;
    this.timeout(timeoutMs);
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then((results) => {
      return results.should.have.property('outputHandler');
    });
  });

  it('should have the summary available from the ouput handler ', function () {
    var opts = defaultOptions;
    this.timeout(timeoutMs);
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then((results) => {
      return results.outputHandler.getSummaryOutput().should.not.be.empty;
    });
  });

  it('should generate a merged json log by default', function () {
    var opts = defaultOptions;
    this.timeout(timeoutMs);
    let mergedFilePath = defaultOptions.mergedLog;
    // Delete the file so that previous runs of the unit test don't cause false positives
    try {
      fs.removeSync(mergedFilePath);
    } catch (e) {}

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then(() => {
      chai.expect(fs.existsSync(mergedFilePath)).to.be.true;
    });
  });

  it('should not generate a merged json log if disableMergedLog is true', function () {
    var opts = _.cloneDeep(defaultOptions);
    opts.disableMergedLog = true;

    this.timeout(timeoutMs);
    let mergedFilePath = defaultOptions.mergedLog;
    // Delete the file so that previous runs of the unit test don't cause false positives
    try {
      fs.removeSync(mergedFilePath);
    } catch (e) {}

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then(() => {
      chai.expect(fs.existsSync(defaultOptions.mergedLog)).to.be.false;
    });
  });
});
