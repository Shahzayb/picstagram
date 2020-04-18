const { getSignature } = require('../util/cloudinary');
const Photo = require('../model/photo');
const User = require('../model/user');
const Ticket = require('../model/ticket');

exports.getSignature = (req, res) => {
  const signature = getSignature(req.user._id.toString());
  res.json(signature);
};

exports.postTicket = async (req, res) => {
  try {
    const { publicId, title } = req.body;
    if (!title) {
      return res.status(422).send({ msg: 'title is required' });
    } else if (title.trim().length > 120) {
      return res
        .status(422)
        .send({ msg: 'title should have characters between 1 and 120' });
    } else if (!publicId || !publicId.trim()) {
      return res.status(422).send({ msg: 'publicId is required' });
    }

    await Ticket.create({
      publicId,
      title,
    });

    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

exports.postWebhook = async (req, res) => {
  try {
    const { body } = req;

    if (body.notification_type === 'upload') {
      const ticket = await Ticket.findOne({ publicId: body.public_id }).lean();

      if (!ticket) {
        await cloudinary.uploader.destroy(body.public_id);
        return res.status(422).send({ msg: 'This asset is not expected here' });
      }

      const userId = body.public_id.split('/')[1];

      const user = await User.exists({ _id: userId });

      if (!user) {
        return res.status(422).json({ msg: 'user does not exist' });
      }

      const photo = new Photo({
        tags: body.tags,
        photoUrl: body.secure_url,
        cloudinaryPublicId: body.public_id,
        userId,
        title: ticket.title,
      });

      await photo.save();
      await Ticket.deleteOne({ publicId: body.public_id });
      return res.send();
    }
    // else if (body.notification_type === 'moderation') {
    //   if (body.moderation_status === 'approved') {
    //   } else {
    //   }
    // }

    res.status(422).send({ msg: 'not expecting this event' });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
