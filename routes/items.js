const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

const Items = require('../models/Item');

// @route   POST api/items
// @desc    Create items
// @access  Private/Admin
router.post('/', auth, authorize('admin'), async (req, res) => {

    try {
        const items = await Items.create(req.body);
        res.json(items);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/items
// @desc    Get all items from database
// @access  Public
router.get('/', async (req, res) => {

    try {
        const items = await Items.find();

        res.json({ items });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;