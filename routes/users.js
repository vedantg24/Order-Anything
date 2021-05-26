const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { auth } = require("../middleware/auth");

const User = require("../models/User");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {

    const { name, email, password, phoneNo, role } = req.body;

    try {
        let user = await User.findOne({ phoneNo });

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
            phoneNo,
            role,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
                expiresIn: 36000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
}
);

// @route   POST api/users/login
// @desc    Login user & get token
// @access  Public
router.post("/login", async (req, res) => {
    const { phoneNo, password } = req.body;

    try {
        let user = await User.findOne({ phoneNo });

        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;