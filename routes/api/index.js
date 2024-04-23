const express = require('express');
const router = express.Router();
const { User, Thought } = require('../../models');

// Import sub-routers
const usersRoutes = require('./usersRoutes');
const thoughtsRoutes = require('./thoughtsRoutes');

// Mount sub-routers
router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);

module.exports = router;
