/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'panlavillita',
    environment,
    rootURL: '',
    locationType: 'hash',

    torii: {
      sessionServiceName: 'session'
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };
  ENV['ember-simple-google-maps'] = {
    url: 'https://maps.googleapis.com/maps/api/js',
    version: '3',
    apiKey: 'AIzaSyC89TSJ7xLWE0-Ync0PnNkHcYmg3nVp7Yg'
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['firebase'] = {
      // apiKey: "AIzaSyBFxcDTxe25ClMfRbn95VoLZ6S3ZNdwUSs",
      // authDomain: "panlavillita-dev.firebaseapp.com",
      // databaseURL: "https://panlavillita-dev.firebaseio.com",
      // projectId: "panlavillita-dev",
      // storageBucket: "panlavillita-dev.appspot.com",
      // messagingSenderId: "86780068472"
        apiKey: "AIzaSyAzAZwIw0UnLQaVCuArb9_OVKTSVAZ6gNg",
        authDomain: "panlavillitamx.firebaseapp.com",
        databaseURL: "https://panlavillitamx.firebaseio.com",
        projectId: "panlavillitamx",
        storageBucket: "panlavillitamx.appspot.com",
        messagingSenderId: "1030925768507"
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['firebase'] = {
      apiKey: "AIzaSyBFxcDTxe25ClMfRbn95VoLZ6S3ZNdwUSs",
      authDomain: "panlavillita-dev.firebaseapp.com",
      databaseURL: "https://panlavillita-dev.firebaseio.com",
      projectId: "panlavillita-dev",
      storageBucket: "panlavillita-dev.appspot.com",
      messagingSenderId: "86780068472"
    };
    // ENV['firebase'] = {
    //   apiKey: "AIzaSyAzAZwIw0UnLQaVCuArb9_OVKTSVAZ6gNg",
    //   authDomain: "panlavillitamx.firebaseapp.com",
    //   databaseURL: "https://panlavillitamx.firebaseio.com",
    //   projectId: "panlavillitamx",
    //   storageBucket: "panlavillitamx.appspot.com",
    //   messagingSenderId: "1030925768507"
    // };
  }

  return ENV;
};
