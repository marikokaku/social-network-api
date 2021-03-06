const { Thought, User } = require('../models');

const thoughtController = {

    

    // GET to get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThought => {
                res.json(dbThought);
            })
            .catch(err => {
                res.json(err);
            });
    },

    // GET to get a single thought by its _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this Id' });
                return;
            } 
            res.json(dbThoughtData);
        })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    // POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    createThought({ body }, res) {
        Thought.create(body)
            .then((data) => {
                return User.findOneAndUpdate(
                    { _id: body.id },
                    { $push: { thoughts: data._id } },
                    { new: true });
                })
                    .then(dbThoughtData => {
                        if (!dbThoughtData) {
                            res.status(404).json({ message: 'No thought found with this id!' });
                            return;
                        }
                        res.json(dbThoughtData);
                    })
                    .catch(err => res.json(err));
    },

    // PUT to update a thought by its _id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // DELETE to remove a thought by its _id
    deleteThought({ params }, res) {
        Thought.findOneAndRemove({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                return User.findOneAndUpdate(
                    { thoughts: params.id },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // /api/thoughts/:thoughtId/reactions

    // POST to create a reaction stored in a single thought's reactions array field
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $addToSet: { reactions: body } }, 
            { new: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err))
    },

    // DELETE to pull and remove a reaction by the reaction's reactionId value
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err))
    }

};

module.exports = thoughtController;