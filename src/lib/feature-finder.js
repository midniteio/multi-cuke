import path from 'path';
import fs from 'fs-extra';
import Promise from 'bluebird';
import Gherkin from 'gherkin';
import glob from 'glob';
import _ from 'lodash';

let promiseGlob = Promise.promisify(glob);
let gherkinParser = new Gherkin.Parser();

export default function(cucumberOptions) {
  let detectedErrors = false;
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
      let parsedData = parseFeature(file);
      detectedErrors = detectedErrors || parsedData.detectedErrors;
      return parsedData.children
        .filter((child) => {
          return (child.type === 'Scenario' || child.type === 'ScenarioOutline')
                 && verifyTags(child, cucumberOptions.tags);
        })
        .map((scenario) => {
/*eslint-disable max-nested-callbacks*/
          if (scenario.type === 'ScenarioOutline') {

            return scenario.examples.map((example) => {
              return example.tableBody.filter(tableBody => tableBody.type === 'TableRow')
              .map((row) => {
                return {
                  featureFile: path.relative(process.cwd(), file),
                  scenarioLine: row.location.line,
                  isScenarioOutline: true
                };
              });
            });
          }
/*eslint-enable max-nested-callbacks*/

          return {
            featureFile: path.relative(process.cwd(), file),
            scenarioLine: scenario.location.line,
            isScenarioOutline: false
          };
        });
    });
  })
  .then((results) => {
    return {scenarios:_.flattenDeep(results), detectedErrors: detectedErrors};
  });
};

function parseFeature(featurePath) {
  try {
    let file = fs.readFileSync(featurePath, {encoding: 'utf8'});
    return gherkinParser.parse(file).feature;
  } catch (e) {
    console.error(featurePath + ' could not be parsed from Gherkin, ignoring as a feature file.\n', e.message);
    return {children: [], detectedErrors: true};
  }
}

function verifyTags(scenario, tags) {
  let scenarioTags = _.map(scenario.tags, 'name');
  var results = _.map(tags, (tag) => {
    if (tag.indexOf(',') !== 0) {
      var orOperatorTags = tag.split(',');
      var tagResults = _.map(orOperatorTags, (orOperatorTag) => {
        return checkTagMatch(scenarioTags, orOperatorTag);
      });
      return _.includes(tagResults, true);
    } else {
      return checkTagMatch(scenarioTags, tag);
    }
  });

  return !_.includes(_.flattenDeep(results), false);
}

function checkTagMatch(scenarioTags, tag) {
  if (tag[0] === '~') {
    tag = tag.replace('~', '');
    return !_.includes(scenarioTags, tag);
  } else {
    return _.includes(scenarioTags, tag);
  }
}
