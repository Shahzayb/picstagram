const app = require('../index');
const supertest = require('supertest');

require('./util/db').setup();

const User = require('../model/user');
const Photo = require('../model/photo');
const Comment = require('../model/comment');

const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('delete /api/comment/:commentId', () => {
  test('user can delete its own comment', async done => {
    const user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    const photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const comment = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceee'
    });

    const jwtToken = createToken({ username: user.username });

    const res = await req
      .delete(`/api/comment/${comment._id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    const commentExist = await Comment.exists({ _id: comment._id });

    expect(commentExist).toBe(false);

    done();
  });

  test('user cannot delete others comment', async done => {
    const user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: 'dummy hash password',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    const user1 = await User.create({
      name: 'shahzaib1',
      username: 'shahzaib1',
      password: 'dummy hash password',
      email: 'imshahzayb1@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    const photo = await Photo.create({
      photoUrl: 'dummy url',
      tags: ['a', 'b'],
      userId: user._id,
      title: 'a title',
      cloudinaryPublicId: 'sdfsdfsd sd'
    });

    const comment = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment: 'noiceee'
    });

    const jwtToken = createToken({ username: user1.username });

    const res = await req
      .delete(`/api/comment/${comment._id}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    const commentExist = await Comment.exists({ _id: comment._id });

    expect(commentExist).toBe(true);
    expect(res.status).toBe(422);

    done();
  });
});
