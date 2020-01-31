const app = require('../index');
const supertest = require('supertest');

const User = require('../model/user');
const Photo = require('../model/photo');
const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('PATCH /api/user/:username/follow', () => {
  test('user can follow other user', async done => {
    // create user 1
    let user1 = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: '123456789',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    // create user 2
    let user2 = await User.create({
      name: 'shahzaib1',
      username: 'shahzaib1',
      password: '123456789',
      email: 'imshahzayb1@gmail.com',
      profilePicUrl: 'asfsfs1'
    });
    // create jwt by { username } of user 2
    const jwtToken = createToken({ username: user2.username });

    // follow user 1
    await req
      .patch(`/api/user/${user1.username}/follow`)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);

    user1 = await User.findById(user1.id, { follower: 1 }).lean();
    user2 = await User.findById(user2.id, { following: 1 }).lean();

    // user 2 is following user 1
    expect(user2.following[0].toString()).toEqual(user1._id.toString());
    // user 1 is followed by user 2
    expect(user1.follower[0].toString()).toEqual(user2._id.toString());

    done();
  });

  test('user cannot follow itself', async done => {
    // create user
    const user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: '123456789',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    // create jwt by { username }
    const jwtToken = createToken({ username: user.username });
    // follow endpoint
    await req
      .patch(`/api/user/${user.username}/follow`)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(422);

    expect(user.following.length).toEqual(0);
    expect(user.follower.length).toEqual(0);

    done();
  });
});

describe('PATCH /api/user/:username/unfollow', () => {
  test('user can unfollow other user', async done => {
    // create user 1
    let user1 = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: '123456789',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    // create user 2
    let user2 = await User.create({
      name: 'shahzaib1',
      username: 'shahzaib1',
      password: '123456789',
      email: 'imshahzayb1@gmail.com',
      profilePicUrl: 'asfsfs1'
    });
    // create jwt of user 1
    const jwtToken = createToken({ username: user1.username });
    // user 1 follow user 2
    user1.following.push(user2._id);
    user2.follower.push(user1._id);

    await user1.save();
    await user2.save();
    // user 1 unfollow user 2
    const res = await req
      .patch(`/api/user/${user2.username}/unfollow`)
      .set('Authorization', `Bearer ${jwtToken}`);

    user1 = await User.findById(user1._id, { following: 1 }).lean();
    user2 = await User.findById(user2._id, { follower: 1 }).lean();

    expect(res.status).toEqual(200);
    expect(user1.following.length).toEqual(0);
    expect(user2.follower.length).toEqual(0);
    // test
    done();
  });
});

describe('GET /api/user/:username/photo', () => {
  test('can get photos by username with pagination', async done => {
    let user = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: '123456789',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });

    let photo1 = await Photo.create({
      photoUrl: 'url1',
      userId: user._id,
      title: '1'
    });

    let res = await req.get(`/api/user/${user.username}/photo?page=1&size=10`);

    expect(res.body[0]._id.toString()).toEqual(photo1._id.toString());

    res = await req.get(`/api/user/${user.username}/photo?page=2&size=10`);

    expect(res.body.length).toEqual(0);

    done();
  });
});

describe('GET /api/user/:username/following', () => {
  test('can get followings of a user', async done => {
    // create user 1
    let user1 = await User.create({
      name: 'shahzaib',
      username: 'shahzaib',
      password: '123456789',
      email: 'imshahzayb@gmail.com',
      profilePicUrl: 'asfsfs'
    });
    // create user 2
    let user2 = await User.create({
      name: 'shahzaib1',
      username: 'shahzaib1',
      password: '123456789',
      email: 'imshahzayb1@gmail.com',
      profilePicUrl: 'asfsfs1'
    });
    // create user 3
    let user3 = await User.create({
      name: 'shahzaib2',
      username: 'shahzaib2',
      password: '123456789',
      email: 'imshahzayb2@gmail.com',
      profilePicUrl: 'asfsfs1'
    });
    // create user 3
    let user4 = await User.create({
      name: 'shahzaib3',
      username: 'shahzaib3',
      password: '123456789',
      email: 'imshahzayb3@gmail.com',
      profilePicUrl: 'asfsfs1'
    });
    // user 4 follows user1, user2, and user 3
    user4.following = [user1._id, user2._id, user3._id];
    user1.follower = [user4._id];
    user2.follower = [user4._id];
    user3.follower = [user4._id];

    await user4.save();
    await user3.save();
    await user2.save();
    await user1.save();

    // get following of user4
    const res = await req.get(`/api/user/${user4.username}/following`).query({
      page: 1,
      size: 2
    });

    expect(res.body[0].username).toBe(user1.username);
    expect(res.body[1].username).toBe(user2.username);

    done();
  });
});
