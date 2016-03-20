import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

import VerboseLogger from '../src/utils/verbose-logger';

describe('Verbose Logger', function(){
  it('should output when verbose setting passed', function () {
    let logSpy = sinon.spy(console, 'log');
    let verboseLog = new VerboseLogger(true);

    verboseLog.log('Test log');
    (console.log).should.have.been.called;

    logSpy.restore();
  });

  it('should output when verbose setting passed with logScenarios', function () {
    let logSpy = sinon.spy(console, 'log');
    let verboseLog = new VerboseLogger(true);

    verboseLog.logScenarios([
      {featureFile: 'test.feature', scenarioLine: 1}
    ]);
    (console.log).should.have.been.called;

    logSpy.restore();
  });

  it('should not output when verbose setting is not passed', function () {
    let logSpy = sinon.spy(console, 'log');
    let verboseLog = new VerboseLogger(false);

    verboseLog.log('Test log');
    (console.log).should.not.have.been.called;

    logSpy.restore();
  });
});
