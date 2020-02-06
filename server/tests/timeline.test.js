const app = require('../index');
const supertest = require('supertest');

require('./util/db').setup();

const User = require('../model/user');
const Photo = require('../model/photo');
const Like = require('../model/like');
const Comment = require('../model/comment');

const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('get /api/timeline', () => {
  test('should get timeline', async done => {
    const user = [];

    for (let i = 0; i < 5; i++) {
      user[i] = await User.create({
        name: 'shahzaib' + i,
        username: 'shahzaib' + i,
        password: 'dummy hash password',
        email: `imshahzayb${i}@gmail.com`,
        profilePicUrl: 'asfsfs'
      });
    }

    // user[0] follows user[1..4]
    user[0].following = [];
    for (let i = 1; i < 5; i++) {
      user[0].following.push(user[i]._id);
      user[i].follower = [user[0]._id];
      await user[i].save();
    }
    await user[0].save();

    // every user except 0 uploads 2 photos
    for (let i = 1; i < 5; i++) {
      await Photo.create({
        photoUrl: 'dummy url',
        tags: ['a', 'b'],
        userId: user[i]._id,
        title: `user[${i}] photo 0`
      });
    }
    for (let i = 1; i < 5; i++) {
      await Photo.create({
        photoUrl: 'dummy url',
        tags: ['a', 'b', 'c'],
        userId: user[i]._id,
        title: `user[${i}] photo 1`
      });
    }

    const jwtToken = createToken({ username: user[0].username });

    const res = await req
      .get(`/api/timeline`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .query({ page: 1, size: 8 });

    const photo = await Photo.find({})
      .sort({ _id: -1 })
      .lean();

    for (let i = 0; i < photo.length; i++) {
      expect(photo[i]._id.toString()).toBe(res.body[i]._id.toString());
    }

    done();
  });
});
