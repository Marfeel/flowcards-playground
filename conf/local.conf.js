var browserstack = require('browserstack-local');
require('dotenv').config();

const user = process.env.BROWSERSTACK_USERNAME || '';
const key = process.env.BROWSERSTACK_ACCESS_KEY || '';

exports.config = {
	user,
  key,

  updateJob: false,
  specs: [
    './experiences/**/*.test.js'
  ],
  exclude: [],

  capabilities: [
    {
      device: 'Google Pixel 5',
      browserName: 'Android',
      os_version: '11.0',
      real_mobile: 'true',
      'browserstack.local': true,
      'browserstack.console': "info",
      'browserstack.networkLogs':true,
      'browserstack.acceptInsecureCerts': 'true'
    },
  //   {
  //   platformName: 'iOS',
  //   automationName: 'XCUITest',
  //   deviceName: 'iPhone 12 Pro Max',
  //   platformVersion: '14',
  //   browserName: 'Safari',
  //   'browserstack.local': true,
  //   'browserstack.console': "info",
  //   'browserstack.networkLogs':true,
  //   'browserstack.acceptInsecureCerts': true
  // }
],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  host: 'hub.browserstack.com',

  before: function () {
    var chai = require('chai');
    global.expect = chai.expect;
    chai.Should();
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  // services: [
  //   ['static-server', {
  //       folders: [
  //           { mount: '/', path: './dist' },
  //           { mount: '/', path: './fixtures' }
  //       ]
  //   }]
  // ],

  // Code to start browserstack local before start of test
  onPrepare: function (config, capabilities) {
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config.key }, function (error) {
        if (error) return reject(error);

        console.log('Connected. Now testing...');
        resolve();
      });
    });
  },

  // Code to mark the status of test on BrowserStack based on the assertion status
  afterTest: function (test, context, { error, result, duration, passed, retries }) {
    if(passed) {
      browser.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Assertions passed"}}');
    } else {
      browser.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "At least 1 assertion failed"}}');
    }
  },

  // Code to stop browserstack local after end of test
  onComplete: function (capabilties, specs) {
    return new Promise(function(resolve, reject){
      exports.bs_local.stop(function() {
        console.log("Binary stopped");
        resolve();
      });
    });
  }
}
