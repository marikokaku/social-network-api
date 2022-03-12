const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thought-controller');

router
.route('/')
.get(getAllThoughts);

router
.route('/:userId')
.post(createThought);

router
.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought);

router
.route('/thoughts/:thoughtId/reactions')
.post(addReaction)

router
.route('/thoughts/:thoughtId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;