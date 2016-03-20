import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.should();
chai.use(sinonChai);
sinon.spy(console, 'log');

import VerboseLogger from '../src/utils/verbose-logger'

describe('Verbose Logger', function(){
  it('should output when verbose setting passed', function () {
    let verboseLog = new VerboseLogger(true);
    verboseLog.log('Test log');
    (console.log).should.have.been.called;
  });

  it('should output when verbose setting passed with logScenarios', function () {
    let verboseLog = new VerboseLogger(true);
    verboseLog.logScenarios([
      {featureFile: 'test.feature', scenarioLine: 1}
    ]);
    (console.log).should.have.been.called;
  });

  it('should not output when verbose setting is not passed', function () {
    let verboseLog = new VerboseLogger(false);
    let returnedVal = verboseLog.log('Test log');
    returnedVal.should.be.false;
  });
});
