import orm from '../orm/index';
import * as actionTypes from '../action/type';

// This gives us a set of "tables" for our data, with the right structure
const initialState = orm.getEmptyState();

export default function entitiesReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS: {
      const session = orm.session(state);
      const { User } = session;

      User.upsert({
        ...action.payload.user,
        id: action.payload.user._id,
      });

      return session.state;
    }
    case actionTypes.FETCH_USER: {
      const session = orm.session(state);
      const { User } = session;

      User.upsert({
        ...action.payload.user,
        id: action.payload.user._id,
        isComplete: true,
      });

      return session.state;
    }
    case actionTypes.FOLLOW_USER: {
      const { follower: followerObj, followeeUsername } = action.payload;

      const session = orm.session(state);
      const { User } = session;

      const followee = User.get({ username: followeeUsername });
      const follower = User.upsert({
        ...followerObj,
        id: followerObj._id,
      });

      followee.isFollowedByMe = true;
      followee.followerCount += 1;
      followee.followers.add(follower);
      let followingCount = parseInt(follower.followingCount);
      follower.followingCount = isFinite(followingCount)
        ? followingCount + 1
        : 1;

      return session.state;
    }
    case actionTypes.UNFOLLOW_USER: {
      const { follower: followerObj, followeeUsername } = action.payload;

      const session = orm.session(state);
      const { User } = session;

      const followee = User.get({ username: followeeUsername });
      const follower = User.upsert({
        ...followerObj,
        id: followerObj._id,
      });

      followee.isFollowedByMe = false;
      followee.followerCount -= 1;
      let followingCount = parseInt(follower.followingCount);
      follower.followingCount = isFinite(followingCount)
        ? followingCount - 1
        : 0;

      const exists = followee.followers
        .toRefArray()
        .find((obj) => obj.id === follower._id);
      if (exists) {
        followee.followers.remove(follower._id);
      }

      return session.state;
    }
    case actionTypes.FETCH_USER_PHOTO: {
      const { username, photos } = action.payload;
      const session = orm.session(state);
      const { User, Photo } = session;

      const user = User.get({ username });

      photos.forEach((photo) =>
        Photo.upsert({ ...photo, id: photo._id, user })
      );

      return session.state;
    }
    case actionTypes.FETCH_PHOTO_COMMENTS: {
      const { comments } = action.payload;
      const session = orm.session(state);
      const { User, Photo, Comment } = session;

      comments.forEach((comment) => {
        const user = User.upsert({
          ...comment.user,
          id: comment.user._id,
        });
        const photo = Photo.upsert({ id: comment.photoId, user });
        Comment.upsert({
          ...comment,
          id: comment._id,
          user,
          photo,
        });
      });

      return session.state;
    }
    case actionTypes.CREATE_COMMENT: {
      const { comment } = action.payload;
      const session = orm.session(state);
      const { User, Photo, Comment } = session;

      const user = User.upsert({
        id: comment.userId,
      });

      const photo = Photo.upsert({ id: comment.photoId, user });

      Comment.upsert({
        ...comment,
        id: comment._id,
        user,
        photo,
      });

      return session.state;
    }
    case actionTypes.FETCH_PHOTO_BY_ID: {
      const { photo } = action.payload;
      const session = orm.session(state);
      const { User, Photo } = session;

      const photoUser = User.upsert({ ...photo.user, id: photo.user._id });
      Photo.upsert({
        ...photo,
        id: photo._id,
        user: photoUser,
        isComplete: true,
      });

      return session.state;
    }
    case actionTypes.FETCH_USER_FOLLOWER: {
      const { username, followers } = action.payload;
      const session = orm.session(state);
      const { User } = session;

      const user = User.get({ username });

      followers.forEach((follower) => {
        try {
          user.followers.add(User.upsert({ ...follower, id: follower._id }));
        } catch (e) {
          // if follower is already in array then simply catch the error and add next follower
          console.log(e);
        }
      });

      return session.state;
    }
    case actionTypes.FETCH_USER_FOLLOWING: {
      const { username, following } = action.payload;
      const session = orm.session(state);
      const { User } = session;

      const user = User.get({ username });

      following.forEach((following) => {
        try {
          user.following.add(User.upsert({ ...following, id: following._id }));
        } catch (e) {
          // if following is already in array then simply catch the error and add next following
          console.log(e);
        }
      });

      return session.state;
    }
    case actionTypes.FETCH_TIMELINE: {
      const { user: userObj, photos } = action.payload;
      const session = orm.session(state);
      const { User, Photo } = session;
      const user = User.upsert({ ...userObj, id: userObj._id });
      photos.forEach((photo) => {
        const photoUser = User.upsert({ ...photo.user, id: photo.user._id });

        delete photo.user;
        const timelinePhoto = Photo.upsert({
          ...photo,
          id: photo._id,
          user: photoUser,
        });

        user.timeline.add(timelinePhoto);
      });

      return session.state;
    }
    case actionTypes.LIKE_USER_PHOTO: {
      const { photoId } = action.payload;
      const session = orm.session(state);
      const { Photo } = session;
      const photo = Photo.withId(photoId);
      photo.isLikedByMe = true;
      photo.likeCount += 1;
      return session.state;
    }
    case actionTypes.UNLIKE_USER_PHOTO: {
      const { photoId } = action.payload;
      const session = orm.session(state);
      const { Photo } = session;
      const photo = Photo.withId(photoId);
      photo.isLikedByMe = false;
      photo.likeCount -= 1;
      return session.state;
    }
    case actionTypes.RESET_TIMELINE: {
      const session = orm.session(state);
      const { UserTimeline } = session;

      UserTimeline.delete();

      return session.state;
    }
    case actionTypes.RESET_ENTITIES: {
      const session = orm.session(initialState);
      return session.state;
    }
    default:
      return state;
  }
}
