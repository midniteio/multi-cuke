import path from 'path'
import fs from 'fs-extra'
import Promise from 'bluebird'
import Gherkin from 'gherkin'
import glob from 'glob'
import _ from 'lodash'

let promiseGlob = Promise.promisify(glob);
let gherkinParser = new Gherkin.Parser();
let allScenarios = [];

export default function(cucumberOptions) {
  return Promise.map(cucumberOptions.paths, (featurePath) => {
    if (path.parse(featurePath).ext) {
      return Promise.resolve(featurePath);
    } else {
      return promiseGlob(path.join(featurePath, '**', '*.feature'));
    }
  })
  .then((files) => {
    files = _.flattenDeep(files);
    return files.map((file) => {
      let featureData = parseFeature(file);
      return featureData.scenarioDefinitions
        .filter((scenario) => {
          let scenarioTags = _.map(scenario.tags, 'name');
          let positiveTags = cucumberOptions.tags.filter((tag) => {
            return tag[0] !== '~';
          });
          let negativeTags = _.difference(cucumberOptions.tags, positiveTags).map((tag) => {
            return tag.replace('~', '');
          });

          let positiveMatch = (_.intersection(scenarioTags, positiveTags).length === positiveTags.length);
          let negativeMatch = _.isEmpty(_.intersection(scenarioTags, negativeTags));

          if (_.isEmpty(negativeTags)) {
            return positiveMatch;
          } else {
            return (positiveMatch && negativeMatch);
          }
        })
        .map((scenario) => {
          return {
            featureFile: path.relative(process.cwd(), file),
            scenarioLine: scenario.location.line
          };
        });
    });
  })
  .then((results) => {
    return _.flattenDeep(results);
  });
};

function parseFeature(featurePath) {
  try {
    let file = fs.readFileSync(featurePath, {encoding: 'utf8'});
    return gherkinParser.parse(file);
  } catch (e) {
    console.log(featurePath + ' could not be parsed from Gherkin, ignoring as a feature file.', e);
    return {scenarioDefinitions: []};
  }
}