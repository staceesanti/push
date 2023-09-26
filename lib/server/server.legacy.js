const apn = Npm.require('apn');

Meteor.methods({
  'raix:configure-push-connections-legacy': (vetId) => {
    check(vetId, String);
    let app = GlobalGenericApps.findOne({_id: vetId, $or: [{disabled: false}, {disabled: {$exists: false}}]});
    if (!app) {
      app = GlobalVets.findOne({_id: vetId, $or: [{disabled: false}, {disabled: {$exists: false}}]});
    }
    if (app) {
      const key = app.appIdentifier;
      Push.legacy.Connections[key] = {};
      console.log('Push (legacy): Configuring push connection for: ', key);

      if (process.env.NODE_ENV === 'production' && app.apn) {
        Push.legacy.Connections[key].apn = {
          passphrase: app.apn.passphrase,
          certData: app.apn.cert,
          keyData: app.apn.key,
          connectTimeout: 30000
        };
      } else if (app['apn-dev']) {
        Push.legacy.Connections[key].apn = {
          certData: app['apn-dev'].cert,
          keyData: app['apn-dev'].key,
          connectTimeout: 30000
        };
      }
      if (app.firebaseConfig && app.firebaseConfig.cloudMessaging) {
        Push.legacy.Connections[key].gcm = {
          apiKey: app.firebaseConfig.cloudMessaging.serverKey,
          projectNumber: app.firebaseConfig.cloudMessaging.projectNumber
        };
      }

      if (Push.legacy.Connections[key] && Push.legacy.Connections[key].apn) {
        Push.legacy.Connections[key].apnConnection = new apn.Connection(Push.legacy.Connections[key].apn);
        Push.legacy.Connections[key].apnConnection.on('transmissionError', Meteor.bindEnvironment(function (errCode, notification, recipient) {
          if (Push.debug) {
            console.log('Push (legacy): Got error code %d for token %s', errCode, notification.token);
          }
          if ([2, 5, 8].indexOf(errCode) >= 0) {
            // Invalid token errors...
            _removeToken({
              apn: notification.token
            });
          }
        }));
        Push.legacy.Connections[key].apnConnection.on('error', Meteor.bindEnvironment(function (err) {
          console.log('Push (legacy): APN error ', err);
        }));
      }
    }
  }
});
