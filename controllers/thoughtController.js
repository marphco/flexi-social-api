const { Thought, User } = require('../models');

module.exports = {
    createThought(req, res) {
        // Implementation for creating a thought
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { username: req.body.username },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                  );
            })
            .then((user) => {
                res.json("Thought created")
            })
            .catch((err) => res.status(500).json(err));
            
    },
    getThoughts(req, res) {
        // Implementation for getting all thoughts
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        // Implementation for getting a single thought by ID
        Thought.findById(req.params.thoughtId)
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        // Implementation for updating a thought
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $set: req.body },
            { new: true, runValidators: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with this ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : Application.deleteMany({ _id: { $in: thought.applications } })
      )
      .then(() => res.json({ message: 'Thought and associated apps deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req,res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  }
};
