const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(users => {
        const usersWithFriendCount = users.map(user => {
          const userObj = user.toObject(); // Convert Mongoose document to plain JavaScript object
          userObj.friendCount = user.friends.length; // Manually add friendCount
          return userObj;
        });
        res.json(usersWithFriendCount);
      })
      .catch(err => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        const userObj = user.toObject(); // Convert Mongoose document to plain JavaScript object
        userObj.friendCount = user.friends.length; // Manually add friendCount
        res.json(userObj);
      })
      .catch(err => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user.toJSON())) // Ensure virtuals like friendCount are included
      .catch(err => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true, runValidators: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        res.json(user.toJSON()); // Ensure virtuals like friendCount are included
      })
      .catch(err => res.status(500).json(err));
  },

  deleteUser(req, res) {
    const userId = req.params.userId;
    User.findById(userId)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
          return Promise.reject('abort');
        }
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => User.findByIdAndDelete(userId))
      .then(() => res.json({ message: 'User and associated thoughts deleted successfully!' }))
      .catch(err => {
        if (err !== 'abort') {
          console.error(err);
          res.status(500).json({ message: 'Failed to delete user and associated thoughts', error: err });
        }
      });
  },

  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user.toJSON()); // Ensure virtuals like friendCount are included
      })
      .catch(err => res.status(500).json(err));
  },
  
  deleteFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user.toJSON()); // Ensure virtuals like friendCount are included
      })
      .catch(err => res.status(500).json(err));
  }
};
