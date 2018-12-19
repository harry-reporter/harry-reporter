# harry-reporter [![Build Status](https://travis-ci.org/harry-reporter/harry-reporter.svg?branch=master)](https://travis-ci.org/harry-reporter/harry-reporter)

Plugin for [hermione](https://github.com/gemini-testing/hermione) which is intended to aggregate the results of tests running into html report. Inspired by [html-reporter](https://github.com/gemini-testing/html-reporter).

You can read more about hermione plugins [here](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
npm install harry-reporter
```

## Usage

Plugin has following configuration:

* **enabled** (optional) `Boolean` – enable/disable the plugin; by default plugin is enabled
* **path** (optional) `String` - path to directory for saving html report file; by
default html report will be saved into `hermione-report/index.html` inside current work
directory.
* **defaultView** (optional) `String` - default view mode. Available values are:
  * `all` - show all tests. Default value.
  * `failed` - show only failed tests.
* **baseHost** (optional) - `String` - it changes original host for view in the browser; by default original host does not change

Also there is ability to override plugin parameters by CLI options or environment variables
(see [configparser](https://github.com/gemini-testing/configparser)).
Use `html_reporter_` prefix for the environment variables and `--html-reporter-` for the cli options.

For example you can override `path` option like so:
```bash
$ html_reporter_path=custom/dir hermione test
$ hermione test --html-reporter-path custom/dir
```

Adding plugin to your `hermione` config file:

```js
module.exports = {
    // ...

    plugins: {
        'harry-reporter': {
            enabled: true,
            path: 'my/hermione-reports',
            defaultView: 'all',
            baseHost: 'test.com'
        }
    },
    //...
}
```

## Additional commands

Additional commands that are added to the tool for which this plugin is connected.

### gui

Command that adds ability to effective work with screenshots.

Example of usage:
```
npx hermione gui
```

### merge-reports

Command that adds ability to merge reports which are created after running the tests.

Example of usage:
```
npx hermione merge-reports src-report-1 src-report-2 -d dest-report
```

## Testing

Run mocha:
```
npm run test
```

Run lint:
```
npm run lint
```
