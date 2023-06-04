// IMPORTS
import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // GET DATA
    const users = await User.find().select("-password").lean();
    // CONFIRM DATA
    if (!users?.length) {
        return res.status(400).json({ message: "No users found" });
    }
    // SEND DATA
    res.status(200).json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    // GET DATA
    const { username, password, roles } = req.body;
    // CONFIRM DATA
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // DUPLICATE DATA
    const duplicate = await User.findOne({ username: username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" });
    }
    // CREATE DATA
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, roles });
    const result = await newUser.save();
    // SEND DATA
    if (result) {
        return res.status(201).json({ message: `User ${result.username} created :)` });
    }
    else {
        return res.status(400).json({ message: "Creation failed :(" });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    // GET DATA
    const { id, username, roles, active, password } = req.body;
    // CONFIRM DATA
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: "All fields are required, except password" });
    }
    // FIND DATA
    const user = User.findById(id).exec();
    if (!user) {
        return res.status(404).send({ message: "User does not exist" });
    }
    // DUPLICATE DATA
    const duplicate = await User.findOne({ username: username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" });
    }
    // CREATE DATA
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    // SEND DATA
    const updatedUser = await user.save()
    res.status(200).json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    // GET DATA
    const { id } = req.body;
    // CONFIRM DATA
    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    }
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }
    // FIND DATA
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    // DELETE & SEND RESULT
    const result = await user.deleteOne();
    res.status(200).json({ message: `User ${result.username} with ID ${result._id} deleted` });
});

export { getAllUsers, createNewUser, updateUser, deleteUser };