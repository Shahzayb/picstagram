const algoliasearch = require('algoliasearch');
// const User = require('../model/user');

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const usersIndex = client.initIndex('users');

usersIndex.setSettings({
  searchableAttributes: ['unordered(name)', 'username'],
  customRanking: ['desc(followers)'],
  attributesToRetrieve: ['name', 'username', 'avatar'],
});

const addUser = (user) => {
  return usersIndex.saveObject({
    objectID: user._id,
    avatar: user.profilePicUrl,
    name: user.name,
    username: user.username,
    followers: user.follower ? user.follower.length : 0,
  });
};

// User.find()
//   .then((users) => {
//     users.forEach((user) => {
//       usersIndex
//         .saveObject({
//           objectID: user._id,
//           avatar: user.profilePicUrl,
//           name: user.name,
//           username: user.username,
//           followers: user.follower ? user.follower.length : 0,
//         })
//         .then(console.log)
//         .catch(console.error);
//     });
//   })
//   .catch(console.log);

module.exports = { usersIndex, addUser };
