const AppTokenUtil = {
  getAppTokensBasedOnQuery: getAppTokensBasedOnQuery
};

function getAppTokensBasedOnQuery(query, desktopAppId) {
  let userDisabledMap = new Map();
  let userIdsSet = new Set();

  let appTokens = Push.appTokens.find(query).fetch();

  if (!appTokens.length) {
    return [];
  }

  if (desktopAppId) {
    return appTokens;
  }

  appTokens.forEach(function (appToken) {
    if (appToken.userId) {
      userIdsSet.add(appToken.userId);
    }
  });

  let app = GlobalGenericApps.findOne({appIdentifier: appTokens[0].appName});
  if (!app) {
    app = GlobalVets.findOne({appIdentifier: appTokens[0].appName});
  }

  if (!app) {
    return [];
  }

  let users = Meteor.users.find({_id: {$in: [...userIdsSet]}}, {fields: {disabled: 1}}).fetch();

  users.forEach(user => {
    let isUserDisabled = user.disabled;
    userDisabledMap.set(user._id, isUserDisabled);
  });

  return appTokens.filter(appToken => {
    return !(appToken.userId && userDisabledMap.get(appToken.userId));
  });

}

export {AppTokenUtil};
