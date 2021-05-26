const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

const User = require('../models/User');
const Order = require('../models/Order');
const Item = require('../models/Item');

// @route   POST api/orders
// @desc    Add items to cart
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { 'cart': req.body } },
            {
                new: true,
                runValidators: true
            }
        );
        res.json(user.cart);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/buy
// @desc    Place order and add those items to order_item
// @access  Private
router.get('/buy', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        let loc_assign = await Promise.all(user.cart.map(async (element) => {
            const item = await Item.findById(element._id);
            const address = item.address;
            const random_loc = address[Math.floor(Math.random() * address.length)];
            console.log("Random Loacation: " + random_loc);
            return random_loc;
        }));

        console.log("loc_assign: " + loc_assign);

        const order = await Order.create({
            cust_id: req.user.id,
            order_item: user.cart,
            order_stage: 'Task Created',
            pickup_loc: loc_assign
        });

        await User.findByIdAndUpdate(
            req.user.id,
            { $set: { 'cart': [] } },
            {
                new: true,
                runValidators: true
            }
        );

        res.json(order);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders
// @desc    Get all orders &delivery persons
// @access  Private/Admin
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        // Only orders that have 'Task Created' as the order status will be retrieved from database
        const order = await Order.find({ order_stage: 'Task Created' });
        const del_person = await User.find({ role: 'delivery_person' }).select('-password');

        res.json({ 'orders': order, 'delivery': del_person });

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/orders/assign
// @desc    Assign orders to delivery person
// @access  Private/Admin
router.post('/assign', auth, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.body.order_id,
            { $set: { 'delPerson_id': req.body.delivery_id } },
            {
                new: true,
                runValidators: true
            }
        );
        res.json(order);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/orders/status
// @desc    Update status of delivery
// @access  Private/Delivery_person
router.post('/status', auth, authorize('delivery_person'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.body.order_id,
            { $set: { 'order_stage': req.body.status } },
            {
                new: true,
                runValidators: true
            }
        );
        res.json(order);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;