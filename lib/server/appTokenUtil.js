const AppTokenUtil = {
  getAppTokensBasedOnQuery: getAppTokensBasedOnQuery
};

function getAppTokensBasedOnQuery(query, desktopAppId, vetId) {
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

  let users = Meteor.users.find({_id: {$in: [...userIdsSet]}}).fetch();

  users.forEach(user => {
    let isUserDisabled = user.accountDisabledPerVet && user.accountDisabledPerVet[vetId];
    userDisabledMap.set(user._id, isUserDisabled);
  });

  return appTokens.filter(appToken => {
    return !(appToken.userId && userDisabledMap.get(appToken.userId));
  });

}

export {AppTokenUtil};
