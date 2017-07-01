# module-telemetry-policy

This repository serves as a [telemetry](https://github.com/tristanls/telemetry-events) policy for modules. It is structured as a [Jest](https://facebook.github.io/jest/) test suite so that it can be included as a test in a module implementation.

## Contributors

[@tristanls](https://github.com/tristanls)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
  * [Releases](#releases)

## Installation

    npm install module-telemetry-policy

## Usage

See `examples/readme.test.js` for usage example as a test, as well as a sample implementation of a module that conforms to the policy (`MyModule`).

## Tests

No automated tests of the policy tests.

## Documentation

  * [moduleTelemetryPolicy(config)](#moduletelemetrypolicyconfig)

### moduleTelemetryPolicy(config)

  * `config`: _Object_
    * `construct`: _Function_ Function that should return a correctly instantiated instance of module to be tested.
    * `package`: _Object_ Parsed `package.json` to extract module `name` and `version` from.

Executes tests ensuring that the instantiated module returned by calling `construct` complies with the specified module telemetry policy.

## Releases

We follow semantic versioning policy (see: [semver.org](http://semver.org/)):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
>MAJOR version when you make incompatible API changes,<br/>
>MINOR version when you add functionality in a backwards-compatible manner, and<br/>
>PATCH version when you make backwards-compatible bug fixes.

**caveat**: Major version zero is a special case indicating development version that may make incompatible API changes without incrementing MAJOR version.
