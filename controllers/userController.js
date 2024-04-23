const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true, runValidators: true }  // Ensures the response contains the updated document and runs schema validations
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user found with this ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
  // Delete a user and all associated thoughts
  deleteUser(req, res) {
    const userId = req.params.userId;

    // First, find the user to ensure they exist and to retrieve the list of thoughts
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
                return Promise.reject('abort');  // This stops the promise chain
            }
            // Delete all thoughts associated with the user
            return Thought.deleteMany({ _id: { $in: user.thoughts } });
        })
        .then(() => {
            // Then delete the user
            return User.findByIdAndDelete(userId);
        })
        .then(() => {
            res.json({ message: 'User and associated thoughts deleted successfully!' });
        })
        .catch(err => {
            if (err !== 'abort') {
                console.error(err);
                res.status(500).json({ message: 'Failed to delete user and associated thoughts', error: err });
            }
        });
},
  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
  // Delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  }
};
