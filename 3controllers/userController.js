const User = require('../4models/User');//import User
const bcrypt = require('bcrypt');//import library bcrypt from Node.js
const jwt = require('jsonwebtoken');//import ...

//user registration
exports.register = async (req, res) => {
    try {
        //getting data from request
        const {
            username, password, first_name, last_name,
            email, phone_number, course, faculty,
            group_number
        } = req.body;
        //heshing the pass
        const hashedPassword = await bcrypt.hash(password, 10);
        //creating new user
        const user = await User.create({
            username, password: hashedPassword, 
            first_name, last_name,
            email, phone_number, course, faculty,
            group_number
        });
        res.status(201).json({
            id: user.id,
            login: user.login,
            first_name: user.first_name,
            last_name: user.last_name
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({error: 'User with this login or email is already exists'});
        }

        res.status(500).json({error: 'Registration error'});
    }
};

//user authorization
exports.login = async (req, res) => {
    try {
        //getting data from request
        const {login, password} = req.body;
        //searching the user by login
        const user = await User.getByLogin(login);
        //login check
        if (!user) {
            return res.status(401).json({error: 'Invalid login or password'});
        }
        //comparing pass
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({error: 'Invalid login or password'});
        }

        //creating JWT token
        const token = jwt.sign({
            id: user.id,
            login: user.login,
            role: user.role
        }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

        //returning token and user's data
        res.json({
            token, 
            user: {
                id: user.id,
                login: user.login,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        res.status(500).json({error: 'Auth error'});
    }
};

//getting users list
exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({error: 'Get users list error'});
    }
};

//getting user by ID
exports.getUserById = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.getById(id);

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({error: 'Get user error'});
    }
};

//updating user
exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const {
        first_name, last_name, email, phone_number,
        course, faculty, group_number, photo, 
        description
    } = req.body;
    try {
        const updatedUser = await User.update(id, {
            first_name, last_name, email, phone_number,
            course, faculty, group_number, photo,
            description
        });

        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json({
            message: 'User has been successfully updated',
            user: updatedUser
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({error: 'User not found'});
        }

        res.status(500).json({error: 'Update user error'});
    }
};

//deleting user
exports.deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const deletedUser = await User.delete(id);
        if (!deletedUser) {
            return req.status(404).json({error: 'User not found'});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Delete user error'});
    }
};

exports.checkUser = async (req, res, next) => {
    const {id} = req.params;
    try {
        const user = await User.getById(id);
        if (!user) {
            return req.status(404).json({error: 'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({error: 'Check user error'});
    }
};