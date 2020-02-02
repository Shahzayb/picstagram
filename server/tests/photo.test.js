const app = require('../index');
const supertest = require('supertest');

require('./util/db').setup();

const User = require('../model/user');
const Photo = require('../model/photo');
const Like = require('../model/like');

const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('patch /api/photo/:photoId/like', () => {
  test('user can like a photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title'
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${photo._id}/like`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.body.like.photoId.toString()).toBe(photo._id.toString());
    expect(res.body.like.userId.toString()).toBe(user._id.toString());
    expect(res.body.likeCount).toBe(1);

    done();
  });

  test('user cannot like already liked photo', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    let photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title'
    });
    const like = await Like.create({
      photoId: photo._id,
      userId: user._id
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .patch(`/api/photo/${like.photoId}/like`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(422);

    done();
  });
});
