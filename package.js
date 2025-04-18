Package.describe({
  name: 'raix:push',
  version: '3.0.3-meteor-2.9.0',
  summary: 'Isomorphic Push notifications for APN and GCM',
  git: 'https://github.com/raix/push.git'
});

// Server-side push deps
Npm.depends({
  'apn': '1.6.2', // '1.7.4', // working: 1.6.2 // LEGACY
  'node-gcm': '0.9.6', // '0.12.0' // working: 0.9.6 // LEGACY
  'firebase-admin': '8.10.0',
  'mock-require': '3.0.2'
});

Cordova.depends({
  'phonegap-plugin-push': '2.1.3',
  'cordova-plugin-device': '2.0.2'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2');
  api.use(['ecmascript']);


  api.use([
    'tracker', // Push.id() is reactive
    'random'   // The push it is created with Random.id()
  ], 'client');

  // Keep track of users in the appCollection
  api.use([
    'accounts-base@2.2.6'
  ], ['client', 'server'], {weak: true});

  api.use([
    'momentjs:moment@2.17.1',
    'raix:eventstate@0.0.4',
    'check',
    'mongo',
    'underscore',
    'ejson'
  ], ['client', 'server']);

  api.use('mongo', 'server');

  // API
  api.addFiles('lib/client/cordova.js', 'web.cordova');

  // Common api
  api.addFiles([
    'lib/common/main.js'
  ], ['web.browser', 'server']);

  // Common api
  api.addFiles([
    'lib/common/notifications.js'
  ], ['client', 'server']);

  // API's
  api.addFiles('lib/client/browser.js', 'web.browser');
  api.addFiles('lib/server/push.api.js', 'server');
  api.addFiles('lib/server/push.api.legacy.js', 'server');

  // // Unified api
  api.addFiles('lib/client/client.js', 'client');
  api.addFiles('lib/server/server.js', 'server');
  api.addFiles('lib/server/server.legacy.js', 'server');

  api.export('Push');

  api.export('_matchToken', {testOnly: true});
  api.export('checkClientSecurity', {testOnly: true});
  api.export('initPushUpdates', {testOnly: true});
  api.export('subscribeToTopic', {testOnly: true});
  api.export('unsubscribeFromTopic', {testOnly: true});
  api.export('_replaceToken', {testOnly: true});
  api.export('_removeToken', {testOnly: true});

});

Package.onTest(function (api) {
  api.use('raix:push');
  api.use('practicalmeteor:chai');

  api.use(['ecmascript', 'meteortesting:mocha']);

  api.use(['accounts-base']);

  api.use([
    'momentjs:moment@2.17.1',
    'raix:eventstate@0.0.4',
    'check',
    'mongo',
    'underscore',
    'ejson'
  ]);

  // API
  api.addFiles('lib/client/cordova.js', 'web.cordova');

  // Common api
  api.addFiles([
    'lib/common/main.js'
  ], ['web.browser', 'server']);

  // Common api
  api.addFiles([
    'lib/common/notifications.js'
  ], ['client', 'server']);

  // API's
  api.addFiles('lib/client/browser.js', 'web.browser');
  api.addFiles('lib/server/push.api.js', 'server');
  api.addFiles('lib/server/push.api.legacy.js', 'server');

  // // Unified api
  api.addFiles('lib/client/client.js', 'client');
  api.addFiles('lib/server/server.js', 'server');
  api.addFiles('lib/server/server.legacy.js', 'server');

  // Finally add an entry point for tests
  api.mainModule('lib/server/push.api.tests.js');
});
