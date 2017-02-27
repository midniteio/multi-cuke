# multi-cuke
`multi-cuke` is an implementation for parallelized Cucumber-js testing using Node's child_process.spawn API.

It utilizes the Gherkin JS module as a parser to determine the entire set of scenarios that fit the passed arguments and spins up workers to run each- up to the number of available OS processor, or alternatively the passed number of workers (lesser of the two). As a test worker ends, a new worker is instantiated to handle the next scenario on the stack, until empty.

### Developing with multi-cuke ###
multi-cuke is written in es6 that is transpiled via Babel. This happens on npm-install, where the compiled code is output to the `distribution` folder. If making changes, `npm run build` will re-compile the code. multi-cuke uses travis-ci for linting and unit testing, which performs `npm test` on all PR's prior to merging with the expectation that they pass.

### Using multi-cuke from another Node module
multi-cuke is easily called from within your NodeJS source like any other NPM module:
```javascript 

// Using Babel/es6
import multicuke from 'multi-cuke';

// Require 
const multicuke = require('multi-cuke').default;
multicuke();
```
multi-cuke is Promise-based, and resolves a promise containing the exit code and the outputHandler when all have finished running. The outputHandler is returned as the summary data of the overall test suite run can be used in conjuction with other runs, if you would like to amass data across different test suites (See below for options and command-line args). Running from the command line will output the summary data then auto-exit with the returned exit code, while calling multi-cuke from a node module returns the promise that resolves to an exit code to be handled at your discretion. The promise is **not** rejected due to test scenario failures, but **is** rejected on errors in test execution to differentiate and provide clarity.


multi-cuke takes an options object as a parameter, but when none is passed will default to standard options, which are:
```javascript
{
  'paths': ['features'],
  'tags': [],
  'requires': [],
  'cucumberPath': require.resolve("cucumber"),
  'workers': require('os').cpus().length,
  'workerEnvVars': {},
  'logDir': '.tmp-logs',
  'silentSummary': false,
  'verbose': false,
  'inlineStream': false,
  'failFast': false,
  'devMode': false,
  'strict': false
}
```
The options object passed is extended with default values via lodash's `_.default()` utility, so passing all options are not required, and passing simply
```javscript
{ paths: ['otherFeatureDir'] }
```
or
```javascript
{
  tags: ['@Smoke'],
  workers: 4
}
```
is as valid as passing all options.

`paths` expects an array of paths which is will use as the source of your tests.

`tags` expects an array of cucumber-js tags to run a subset of all features found.

`requires` follows the `--requires` tag as defined by cucumber-js, and specifies external sources for step definitions, support files.

`cucumberPath` is the path to your cucumber-js module, if you need to use a specific version, otherwise will default to what is included in multi-cuke.

`workers` specifies the max number of parallel workers to be running at once. If no number passed, defaults to the number of cpu's available.

`workerEnvVars` is an object that will be passed as environment variables to the cucumber-js worker process, and it's properties will be available to access in the spawned process via process.env. The values for each key must be a string.

`logDir` specifies the dir multi-cuke writes test log files to.

The `silentSummary` option silences the default output of summary data when all tests cases resolve. This is an optional flag so that output summary can be handled or transformed at a later time via the returned object in the promise. An example:

```javascript
const multicuke = require('multi-cuke');
multicuke().then((results) => {
  // results.outputHandler is the parser defined for this test
  console.log(results.outputHandler.getSummaryOutput());
});

```

Or to combine data of multiple test suites (via tags):
```javascript
const multicuke = require('multi-cuke');

Promise.all([
  multicuke({ tags: ['@Blocker'] }),
  multicuke({ tags: ['@LowUserPath'] })
]).then((results) => {
  // Deal with results ...
});

```

`verbose` will log extra data around which workers are queued and still running.

`inlineStream` will remove the silence on the worker process, so output occur in real-time in addition to the multi-cuke output. Generally, this makes output hard to decipher with workers running asynchronously, but the option is included for aid in debugging if deemed necessary or helpful.

`devMode` will run tests serially by calling the Cucumber-js cli directly. This option can be used during test development so that you can see the output update with each step run (avoiding the double printing that `inlineStream` shows).

### Using multi-cuke from command line
multi-cuke comes ready to use from command line. It supports arguments of both feature paths and directory paths that contain features (including multiple paths), as well as the following tags:
```

  -t, --tag               Scenario tag, as defined by cucumber-js
  -r, --require           Require flag, to specify non-default files to require, as defined by cucumber-js
  -c, --cucumber          Specify using a specific cucumber installation
  -w, --workers           Number of workers in parallel at a given time (defaults to the number of processors if none passed).
  -l, --logdir            Output dir for test logs
  -s, --silent-summary    Silences summary output so it can be handled via the returned promise
  -v, --verbose           Adds verbose output to console
  --fail-fast             Abort the run on first failure
  -i, --inlinestream      Inlines stream in real time in addition to multi-cuke output. *Note* This adds complexity to the logs that are hard to decipher, but included if needed for debugging
  -d, --devMode           Shortcut to running cucumber-js directly
  --strict                Fail if a step definition is not defined

```
All of the above options can also be found by using the `--help` flag on the command line.

Examples valid command from the command line (assuming multi-cuke is globally installed with `npm install -g multi-cuke`):

With default options, being run inside a directory with a `features` directory containing feature files.
```
multi-cuke
```

Specifying a specific path to feature files, and using only the `@Smoke` tag
```
multi-cuke path/to/features -t @Smoke
```

(Multiple) specific individual feature files
```
multi-cuke some-features/test1.feature other-feature/test2.feature
```

It does not support the formatter flag currently available in cucumber-js' CLI, as parsing of the output of multiple concurrent jobs acts differently than a single thread. See below for more information.

It is important to note that multi-cuke defers to the installed version of cucumber-js unless otherwise passed a path to another cucumber install. To use a specific/pinned version of cucumber in your project, simply pass it on the command line or include it in the options object, and that will be used in place of the local dependency installed with multi-cuke.

### Using console from within multi-cuke ###
With the output channels of the child process specifically silenced in order to keep scenario logs in tact, console.log, error, etc. will not display during a test's run. To address this, there is an included utility `utils/worker-log-handler.js`. The handler is provided so that you can declare it in your `world.js` file, and then be able to access it from your step definitions with a simple replace:
```
// world.js
this.log = require('multi-cuke/distribution/utils/worker-log-handler');


// steps.js
this.log('Log as usual, %s', 'nice');
```

This reason for this handler is to prevent having to rewrite logic in multiple projects. With this handler, if you are not within a child process (and therefore not parallelized), it will simply console.log as expected. If it is within a child process it will send a message to the test handler, which will push the message to the worker's defined log array, which will be batch output in order once the test finishes.

### Differences from standard Cucumber-js
To best consolidate the data of all scenario runs into meaningful test results, multi-cuke runs Cucumber with the json formatter, and the results parsed back to pretty formatting for readability by `lib/parsers/pretty`. The standard cucumber-js formatters would have formatting and/or redundancy issues, so are not supported (at this time) and ignored here. Additional parsers can be added using the same API as defined in `lib/parsers/pretty`.

multi-cuke also explicitly silences the stdio channels of the workers. Errors are still caught and surfaced in the worker's execution, but this prevents the test/step definitions from throwing errors to stdout in real-time as other tests run in parallel (and potentially creating very unclear logs). Additional/debug logging past error handling can alternatively be handled by having a debug log piped to file from step definitions, which serves a better purpose than writing to stdout and would not be affected by multi-cuke.

Additionally, since errors are caught and handled per-scenario basis, exceptions that would otherwise exit the process of Cucumber-js when found in a given scenario will be contained to that scenario's process, output, and logged- but will not stop the execution of other tests unrelated to that issue.

Contributions welcome.
