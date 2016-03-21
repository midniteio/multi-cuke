import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {fork} from 'child_process';

chai.should();
chai.use(sinonChai);

import logger from '../src/utils/worker-log-handler';

describe('Worker Log Handler', function(){
  it('should print to console when not within a child process', function () {
    let logSpy = sinon.spy(console, 'log');

    logger('Test log');
    (console.log).should.have.been.called;

    logSpy.restore();
  });

  it('should return data when in a child process', function () {
    return new Promise((resolve) => {
      var worker = fork('./test/fixtures/logger-process.js', [], {
        silent: true
      });

      worker.on('message', (payload) => {
        resolve(payload.should.have.deep.property('message').and.to.be.equal('Test Command'));
      });
    });
  });
});
