const {Student, Admin} = require('../4models/User');//import User
const bcrypt = require('bcrypt');//import library bcrypt from Node.js
const jwt = require('jsonwebtoken');//import ...
const {JWT_SECRET, JWT_EXPIRES_IN} = require('dotenv').config().parsed;

//user registration
exports.register = async (req, res) => {
    try {
        //getting data from request
        const {
            login, password, role, email
        } = req.body;

       if (!['admin', 'student'].includes(role)) {
        return res.status(400).json({message: 'Invalid role'});
       }

       let userModel = role === 'admin' ? Admin : Student;

        //checking of exist
        const existingUser = await userModel.findByLogin(login);
        if (existingUser) {
            return res.status(409).json({message: 'User with this login is already exists'});
        }

        //heshing the pass
        const hashedPassword = await bcrypt.hash(password, 10);
        //creating new user
        const newUser = new userModel({
            login,
            password: hashedPassword,
            role, email,
            ...req.body
        });
        await newUser.create();

        //token generation
        const token = jwt.sign({
            id: newUser.id,
            role: newUser.role
        }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(201).json({
            message: 'User has been Successful registrated',
            token
        });
    } catch (error) {
        res.status(500).json({error: 'Registration error'});
    }
};

//user authorization
exports.login = async (req, res) => {
    try {
        //getting data from request
        const {login, password} = req.body;

        let user = null;

        user = await Admin.findByLogin(login);
        if (!user) {
            user = await Student.findByLogin(login);
        }
        if (!user) {
            return res.status(401).json({message: 'Ivalid login or password'});
        }
        //comparing pass
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({error: 'Invalid login or password'});
        }

        //creating JWT token
        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        //returning token and user's data
        res.json({
            message: 'Successful authorized',
            token
        });
    } catch (error) {
        res.status(500).json({error: 'Auth error'});
    }
};

//getting users list
exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        let userModel;

        if (req.user.role === 'admin') {
            userModel = Admin;
        } else {
            userModel = Student;
        }

        const user = await User.FindById(userId);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const {password, ...userData} = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({error: 'Get user data error'});
    }
};

//updating user
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        //checking access rights
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return req.status(403).json({message: 'No access rights'});
        }

        let userModel;
        if (req.user.role === 'admin') {
            userModel = Admin;
        } else {
            userModel = Student;
        }

        //updating
        const user = await userModel.FindById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        Object.assign(user, updateData);

        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 10);
        }

        await user.update();
        res.json({message: 'Successful data updated'});
    } catch (error) {
        res.status(500).json({error: 'Update user error'});
    }
};

//deleting user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not access rights' });
        }

        let userModel;
        if (req.user.role === 'admin') {
            userModel = Admin;
        } else {
            userModel = Student;
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.delete();
        res.json({ message: 'User was deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete user error', error: error.message });
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

    exports.logout = async (req, res) => {
        try {
            res.json({ message: 'Successful logout' });
        } catch (error) {
            res.status(500).json({ message: 'logout error', error: error.message });
        }
    };

    //template for future recovery func
    exports.passwordRecovery = async (req, res) => {
        try {
            const {email} = req.body;

            let user = await Admin.findByEmail(email);
            if (!user) {
                user = await Student.findByEmail(email);
            }

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            res.json({message: 'Recovery Request received'});
        } catch (error) {
            res.status(500).json({message: 'Recovery error'});
        }
    };

    //getting the all users list
    exports.getAllUsers = async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({message: 'Not access rights'});
            }

            const admins = await Admin.find();
            const students = await Student.find();

            res.json({
                admins: admins.map(admin => admin.toObject()),
                students: students.map(student => student.toObject())
            });
        } catch (error) {
            res.status(500).json({message: 'Get all users list error', error: error.message});
        }
    };

    //getting students list
    exports.getAllStudents = async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({message: 'Not access rights'});
            }

            const students = await Student.find();

            res.json({
                students: students.map(student => student.toObject())
            });
        } catch (error) {
            res.status(500).json({message: 'Get all students list error', error: error.message});
        }
    };

    //getting admins list
    exports.getAllAdmins = async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({message: 'Not access rights'});
            }

            const admins = await Admin.find();

            res.json({
                admins: admins.map(admin => admin.toObject())
            });
        } catch (error) {
            res.status(500).json({message: 'Get all admins list error', error: error.message});
        }
    };

    //searching user by email
    exports.findByEmail = async (req, res) => {
        try {
            const {email} = req.body;

            if (!email) {
                return res.status(400).json({message: 'Email does not exist'});
            }

            let user = await Admin.findByEmail(email);
            if (!user) {
                user = await Student.findByEmail(email);
            }
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            const {password, ...userData} = user.toObject();
            res.json(userData);
        } catch (error) {
            res.status(500).json({message: 'Find user by email error', error: error.message});
        }
    };
};