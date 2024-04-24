const { Thought, User } = require('../models');

module.exports = {
    createThought(req, res) {
        // Implementation for creating a thought and linking it to a user
        Thought.create(req.body)
            .then(thought => {
                return User.findOneAndUpdate(
                    { username: req.body.username },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this username' });
                }
                res.json({ message: "Thought created and added to the user." });
            })
            .catch(err => res.status(500).json(err));
    },

    getThoughts(req, res) {
        // Implementation for getting all thoughts
        Thought.find()
            .then(thoughts => res.json(thoughts))
            .catch(err => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        // Implementation for getting a single thought by ID
        Thought.findById(req.params.thoughtId)
            .then(thought => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought with that ID' });
                }
                res.json(thought);
            })
            .catch(err => res.status(500).json(err));
    },

    updateThought(req, res) {
        // Implementation for updating a thought
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $set: req.body },
            { new: true, runValidators: true }
        )
        .then(thought => {
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this ID' });
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    },

    deleteThought(req, res) {
        // Implementation for deleting a thought
        Thought.findByIdAndDelete(req.params.thoughtId)
            .then(thought => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this ID' });
                }
                res.json({ message: 'Thought deleted successfully!' });
            })
            .catch(err => res.status(500).json(err));
    },

    addReaction(req, res) {
        // Implementation for adding a reaction to a thought
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then(thought => {
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        // Implementation for deleting a reaction from a thought
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(thought => {
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    }
};
