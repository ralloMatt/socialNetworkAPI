const router = require('express').Router();

const {
    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
} = require('../../controllers/thoughtController.js');

router.route('/').get(getAllThoughts).post(createThought);

router.route('/:thoughtId').get(getOneThought).put(updateThought).delete(deleteThought);

module.exports = router;
