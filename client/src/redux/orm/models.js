import { Model, attr, fk, many } from 'redux-orm';

class Photo extends Model {
  static modelName = 'Photo';
  static fields = {
    id: attr(),
    tags: attr(),
    likeCount: attr(),
    photoUrl: attr(),
    cloudinaryPublicId: attr(),
    title: attr(),
    createdAt: attr(),
    updatedAt: attr(),
    user: fk('User', 'photos'),
    isComplete: attr(),
  };
}

class User extends Model {
  static modelName = 'User';
  static fields = {
    id: attr(),
    username: attr(),
    name: attr(),
    bio: attr(),
    profilePicUrl: attr(),
    followerCount: attr(),
    followingCount: attr(),
    photoCount: attr(),
    following: many('User', 'followers'),
    timeline: many('Photo', 'timelines'),
    isFollowedByMe: attr(),
    isComplete: attr(),
  };
}

class Comment extends Model {
  static modelName = 'Comment';
  static fields = {
    id: attr(),
    user: fk('User', 'comments'),
    photo: fk('Photo', 'comments'),
    comment: attr(),
  };
}

export { User, Photo, Comment };
