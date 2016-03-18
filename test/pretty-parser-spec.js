import path from 'path';
import chai from 'chai';

chai.should();

import PrettyParser from '../src/lib/parsers/pretty';

const featureFile = path.join(__dirname, 'features', 'sample.feature');
const featureOutput = path.join(__dirname, 'fixtures', 'sample-feature-output.json');

describe('Pretty parser', function() {
  it('parser should handle a valid test run and update the tracked properties', function() {
    let parser = new PrettyParser({ silentSummary: true });
    let output = parser.handleMessage({
      exitCode: 0,
      duration: 100,
      resultFile: featureOutput
    })

    return Promise.all([
      parser.should.have.deep.property('totalSteps').and.to.be.equal(2),
      parser.should.have.deep.property('totalScenarios').and.to.be.equal(1),
      parser.should.have.deep.property('totalDuration').and.to.be.equal(100),
      parser.should.have.deep.property('stepStatuses').and.to.be.equal({undefined: 2}),
      parser.should.have.deep.property('scenarioStatuses').and.to.be.equal({passed: 1, failed: 0}),
      parser.should.have.deep.property('failedScenarios').and.to.be.empty,
      parser.should.have.deep.property('undefinedSteps').and.to.be.equal(['Given I am a test', 'Then I am a step']),
      output.should.not.be.empty
    ]);
  });

  it('parser should handle a test that ended in an exception', function() {
    let parser = new PrettyParser({ silentSummary: true });
    let err = new Error('Test error');
    let output = parser.handleMessage({
      exitCode: 10,
      duration: 100,
      featureFile: featureFile,
      scenarioLine: 7,
      exception: err
    });
    return Promise.all([
      parser.should.have.deep.property('totalSteps').and.to.be.equal(0),
      parser.should.have.deep.property('totalScenarios').and.to.be.equal(1),
      parser.should.have.deep.property('totalDuration').and.to.be.equal(100),
      parser.should.have.deep.property('stepStatuses').and.to.be.empty,
      parser.should.have.deep.property('scenarioStatuses').and.to.be.equal({passed: 0, failed: 1}),
      parser.should.have.deep.property('undefinedSteps').and.to.be.empty,
      output.should.not.be.empty
    ]);
  });

  it('parser should aggregate data when additional tests finish', function() {
    let parser = new PrettyParser({ silentSummary: true });
    parser.handleMessage({
      exitCode: 0,
      duration: 100,
      resultFile: featureOutput
    })
    parser.handleMessage({
      exitCode: 0,
      duration: 200,
      resultFile: featureOutput
    })

    return Promise.all([
      parser.should.have.deep.property('totalSteps').and.to.be.equal(4),
      parser.should.have.deep.property('totalScenarios').and.to.be.equal(2),
      parser.should.have.deep.property('totalDuration').and.to.be.equal(300),
      parser.should.have.deep.property('stepStatuses').and.to.be.equal({undefined: 4}),
      parser.should.have.deep.property('scenarioStatuses').and.to.be.equal({passed: 2, failed: 0}),
      parser.should.have.deep.property('failedScenarios').and.to.be.empty,
    ]);
  });

  it('parser should return summary log', function() {
    let parser = new PrettyParser({ silentSummary: true });
    parser.handleMessage({
      exitCode: 0,
      duration: 100,
      resultFile: featureOutput
    });
    parser.setEndTime();

    let summary = parser.getSummaryOutput();

    return Promise.all([
      summary.should.not.be.empty,
      summary.should.contain('1 scenario (\u001b[32m1 passed\u001b[0m)'),
      summary.should.contain('2 steps (\u001b[33m2 undefined\u001b[0m)'),
      summary.should.contain('Total duration: '),
      summary.should.contain('(100ms if ran in series - N/A speed increase via parallelization)')
    ]);
  });
});
