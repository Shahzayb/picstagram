const Comment = require('../model/comment');

const validators = require('./comment.validator');

exports.deleteComment = [
  validators.deleteComment,
  async (req, res) => {
    try {
      const { deletedCount } = await Comment.deleteOne({
        _id: req.params.commentId,
        userId: req.user._id
      });

      if (!deletedCount) {
        return res.status(422).send('you can only delete your own comment');
      }

      res.send('comment is deleted successfully');
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
