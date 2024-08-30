const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/usermodel'); // Ensure you have the correct path to your user model

// Hardcoded admin credentials
const adminCredentials = {
    userName: "admin",
    email: "admin@example.com",
    password: "admin123" // Store this in a secure way in production
};



// --------------------------------------------user------------------------------------
// Registration endpoint for regular users
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

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists! Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            userName,
            email,
            password: hashedPassword,
            role: 'user' // Default role is 'user'
        });
        await newUser.save();
        res.status(201).json(newUser); // 201 for resource creation
    } catch (err) {
        res.status(500).json({ message: `Register API failed: ${err.message}` }); // 500 for server error
    }
};

// Login endpoint
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Debugging: Log the request body
    console.log("Received body:", req.body);

    try {
        // Check if the login is for the hardcoded admin
        if (email === adminCredentials.email) {
            if (password === adminCredentials.password) {
                // Generate token for admin
                const token = jwt.sign({ role: 'admin', userName: adminCredentials.userName }, "supersecretkey123", { expiresIn: '1h' });
                return res.status(200).json({
                    user: { userName: adminCredentials.userName, email: adminCredentials.email, role: 'admin' },
                    token
                });
            } else {
                return res.status(400).json({ message: "Incorrect admin password." });
            }
        }

        // For regular users
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        // Login success - generate token for regular users
        const token = jwt.sign({ _id: existingUser._id, role: existingUser.role }, "supersecretkey123", { expiresIn: '1h' }); // Token includes user role
        res.status(200).json({
            user: existingUser,
            token
        });
    } catch (err) {
        res.status(500).json({ message: `Login API failed: ${err.message}` }); 
    }
};

// Get all users endpoint
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const allUsers = await user.find();

        // Get the total count of users
        const totalUsers = await user.countDocuments();

        // Respond with the total count and user data
        res.status(200).json({
            total: totalUsers,
            user: allUsers
        });
    } catch (err) {
        res.status(500).json({ message: `Get all users API failed: ${err.message}` });
    }
};


// Delete user endpoint
exports.deleteUser = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters

    // Debugging: Log the userId
    console.log("Received userId:", userId);

    try {
        // Find and delete the user by ID
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." }); // 404 if user not found
        }

        // Respond with a success message
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: `Delete user API failed: ${err.message}` }); // 500 for server error
    }
};



// Edit user details endpoint
exports.editUser = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { userName, email, password } = req.body; // Extract fields to be updated

    // Debugging: Log the request body and userId
    console.log("Received body:", req.body);
    console.log("Received userId:", userId);

    try {
        // Find the user by ID
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the user details only if provided
        if (userName) existingUser.userName = userName;
        if (email) existingUser.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
            existingUser.password = hashedPassword;
        }

        // Save the updated user
        await existingUser.save();

        // Respond with the updated user details
        res.status(200).json({ message: "User updated successfully", user: existingUser });
    } catch (err) {
        res.status(500).json({ message: `Edit user API failed: ${err.message}` }); // 500 for server error
    }
};








