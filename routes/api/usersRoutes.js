const express = require('express');
const router = express.Router();
const { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require('../../controllers/userController');

// Routes for general user actions
router.route('/')
    .get(getUsers)  // GET all users
    .post(createUser);  // POST a new user

// Routes for specific user actions
router.route('/:userId')
    .get(getSingleUser)  // GET a single user by ID
    .put(updateUser)  // PUT update a user by ID
    .delete(deleteUser);  // DELETE a user by ID

// Routes for managing friendships
router.route('/:userId/friends/:friendId')
    .post(addFriend)  // POST add a new friend
    .delete(deleteFriend);  // DELETE a friend

module.exports = router;
