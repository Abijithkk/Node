const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/usermodel'); // Ensure you have the correct path to your user model

exports.register = async (req, res) => {
    const { userName, email, password } = req.body;

    // Debugging: Log the request body
    console.log("Received body:", req.body);

    try {
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!userName) {
            return res.status(400).json({ message: "userName is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists! Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({
            userName,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json(newUser); // 201 for resource creation
    } catch (err) {
        res.status(500).json({ message: `Register API failed: ${err.message}` }); // 500 for server error
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Debugging: Log the request body
    console.log("Received body:", req.body);

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Incorrect email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(404).json({ message: "Incorrect email or password." });
        }

        // Login success - token generate
        const token = jwt.sign({ _id: existingUser._id }, "supersecretkey123", { expiresIn: '1h' }); // Token expires in 1 hour
        console.log(token);
        res.status(200).json({
            user: existingUser,
            token
        });
    } catch (err) {
        res.status(500).json({ message: `Login API failed: ${err.message}` }); // 500 for server error
    }
};
