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

  let vet = GlobalVets.findOne({appIdentifier: appTokens[0].appName});

  if (!vet) {
    return [];
  }

  let users = Meteor.users.find({_id: {$in: [...userIdsSet]}}, {fields: {accountDisabledPerVet: 1}}).fetch();

  users.forEach(user => {
    let isUserDisabled = user.accountDisabledPerVet && user.accountDisabledPerVet[vet._id];
    userDisabledMap.set(user._id, isUserDisabled);
  });

  return appTokens.filter(appToken => {
    return !(appToken.userId && userDisabledMap.get(appToken.userId));
  });

}

export {AppTokenUtil};
