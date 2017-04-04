import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import featureFinder from '../src/lib/feature-finder';
import options from './fixtures/options';
import results from './results/feature-finder';

describe('Feature Finder', function(){
  it('should find all scenarios within a folder', function () {
    var opts = options.singlePathNoTags;
    var expectedResult = results.default;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should find only tagged scenarios when passed a tag', function () {
    var opts = options.tagged;
    var expectedResult = results.tagged;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should not find scenario when using negated tag', function () {
    var opts = options.negatedTag;
    var expectedResult = results.negatedTag;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support multiple tags', function () {
    var opts = options.multipleTags;
    var expectedResult = results.multipleTags;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support feature tags', function () {
    var opts = options.featureTags;
    var expectedResult = results.featureTags;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support mixed tags', function () {
    var opts = options.mixedTags;
    var expectedResult = results.mixedTags;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support "or" tags', function () {
    var opts = options.orOperatorTags;
    var expectedResult = results.orOperatorTags;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support direct feature paths', function () {
    var opts = options.featurePath;
    var expectedResult = results.featurePath;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });

  it('should support multiple paths', function () {
    var opts = options.multiplePaths;
    var expectedResult = results.multiplePaths;
    return featureFinder(opts).should.eventually.deep.equal(expectedResult);
  });
});
