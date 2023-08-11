const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length) {
        return res.status(400).json({ message: 'No users found'});
    }
    res.json(users);
});

exports.createNewUser = asyncHandler(async (req, res) => {
    try {
        const { email, username, password, role, firstName, lastName } = req.body;
        console.log(req.body);

        if (!email || !username || !password || !role || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required'});
        }
    
        // Create a new user
        const newUser = new User({
        email,
        username,
        password,
        role,
        firstName,
        lastName,
        });
    
        // Register the user with passport-local-mongoose
        await User.register(newUser, password);
    
        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        if (err.name === 'UserExistsError') {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
        }
    
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
});

exports.getOneUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('*******************');
        console.log(`received data retrieval request: user ${userId}`);
        console.log('*******************');

        const user = await User.findOne({_id: userId}).select('-password');

        console.log('Retrieval successful! Sending data...');
        console.log('*******************');

        console.log(user);
        console.log('*******************');

        res.status(200).json({ user });
        console.log('Data is now Available');
        console.log('*******************');

    } catch (error) {
        console.error('Error retrieving users:', error.message);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

exports.getOneUserAndUpdate = asyncHandler(async (req, res) => {
    try{
        const userId = req.params.userId;

        console.log('******************');
        console.log('Received ---- request for: ',userId);
        console.log('******************');

        const updateFields = {...req.body};

        console.log('This is the received data:');
        console.log('*******************');
        console.log(req.body);
        console.log('*******************');

        console.log('*******************');
        console.log('Processing to update');
        console.log('*******************');

        const updatedUser  = await User.findByIdAndUpdate(userId,
            updateFields);

        if (!updatedUser) {
        console.log('*******************');
        console.log(`user ${userId} not found`);
        console.log('*******************');
        return res.status(404).json({ message: 'user not found' });
        } else {
        console.log('*******************');
        console.log('This is the updated user:');
        console.log('*******************');
        console.log(updatedUser);
        console.log('*******************');
        }

        console.log('*******************');
        console.log(`user ${userId} update successful!`);
        console.log('*******************');

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Error updating the user' });
    }

});

exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log('******************');
        console.log('Received deletion request for: ',userId);
        console.log('******************');

        const user  = await User.findByIdAndDelete({_id: userId});

        if (!user) {
            console.log('*******************');
            console.log(`user ${userId} not found`);
            console.log('*******************');
            return res.status(404).json({ error: 'user not found' });
        } else {
            console.log('*******************');
            console.log(`user ${userId} has been deleted`);
            console.log('*******************');
        }

        res.json({ message: `User with ID ${userId} has been deleted successfully.` });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Error deleting the user' });
    }

});

exports.loginUser = (req, res) => {
    
    const user = req.user;
    const { rememberMe } = req.body;

    // Set token expiration times based on Remember Me checkbox
    const accessTokenExpiration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const refreshTokenExpiration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: accessTokenExpiration,
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: refreshTokenExpiration,
    });

    const userWithoutPassword = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    };

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: accessTokenExpiration });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: refreshTokenExpiration });

    console.log(userWithoutPassword);
    res.json({ message: 'Logged in successfully', user: userWithoutPassword, accessToken, refreshToken });
}

exports.logoutUser = (req, res) => {
    res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true });
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true });
    res.status(200).json({ message: 'Logout successful' });
}