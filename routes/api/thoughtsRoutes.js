const express = require('express');
const router = express.Router();
const { getThoughts, createThought, getSingleThought, updateThought, deleteThought, addReaction, deleteReaction  } = require ('../../controllers/thoughtController')

router.route('/').get(getThoughts).post(createThought);
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction)
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction)

module.exports = router;
