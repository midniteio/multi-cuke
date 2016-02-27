import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised);
chai.should();

import featureFinder from '../src/lib/feature-finder'
import options from './fixtures/options'
import results from './results/feature-finder'

describe('Feature Finder', function(){
  it('should find all scenarios with default options', function () {
    var opts = options.default;
    var expectedResult = results.default;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should find only tagged scenarios when passed a tag', function () {
    var opts = options.tagged;
    var expectedResult = results.tagged;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should not find scenario when using negated tag', function () {
    var opts = options.negatedTag;
    var expectedResult = results.negatedTag;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support multiple tags', function () {
    var opts = options.multipleTags;
    var expectedResult = results.multipleTags;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support mixed tag', function () {
    var opts = options.mixedTags;
    var expectedResult = results.mixedTags;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support direct feature paths', function () {
    var opts = options.featurePath;
    var expectedResult = results.featurePath;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support multiple paths', function () {
    var opts = options.multiplePaths;
    var expectedResult = results.multiplePaths;
    featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });
});
