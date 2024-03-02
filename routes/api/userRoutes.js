const router = require('express').Router();

const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../../controllers/userController.js');

router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;
