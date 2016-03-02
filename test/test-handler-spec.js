import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fs from 'fs-extra'

chai.use(chaiAsPromised);
chai.should();

import TestHandler from '../src/lib/test-handler'
import options from './fixtures/options'

describe('Test Handler', function() {
  it('should wait for all children to exit before returning', function () {
    var opts = options.default;
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);

    return cukeRunner.run().then(() => {
      return cukeRunner.workers.should.be.empty;
    })
  });

  it('should return the overall exit code when all tests finish', function () {
    var opts = options.default;
    fs.ensureDir(opts.logDir);

    function nonInjectedExitCode() {
      let cukeRunner = new TestHandler(opts);
      return cukeRunner.run()
    }

    function injectedExitCode() {
      let injectedCukeRunner = new TestHandler(opts);
      injectedCukeRunner.overallExitCode = 10;
      return injectedCukeRunner.run()
    }

    return Promise.all([
      nonInjectedExitCode().should.eventually.have.deep.property('exitCode').and.to.be.equal(0),
      injectedExitCode().should.eventually.have.deep.property('exitCode').and.to.be.equal(10)
    ]);
  });

  it('should return the output handler', function () {
    var opts = options.default;
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then((results) => {
      return results.should.have.property('outputHandler');
    });
  });

  it('should have the summary available from the ouput handler ', function () {
    var opts = options.default;
    fs.ensureDir(opts.logDir);

    let cukeRunner = new TestHandler(opts);
    return cukeRunner.run().then((results) => {
      return results.outputHandler.getSummaryOutput().should.not.be.empty;
    });
  });

});
