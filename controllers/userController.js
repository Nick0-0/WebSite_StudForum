const User = require('../models/User');
const bcrypt = require('bcrypt');
const CryptoHelper = require('../models/CryptoHelper');

const userController = {
    //displaying the login/registration page
    renderAuth: (req, res) => {
        let errorMsg = null;

        if (req.query.error === 'register_error') errorMsg = 'Register error';
        if (req.query.error === 'invalid_credentials') errorMsg = 'Invalid login or password';
        if (req.query.error === 'session_error') errorMsg = 'Create session error';
        if (req.query.error === 'server_error') errorMsg = 'Server error';

        res.render('auth', {error: errorMsg});
    }, 

    //student registration processing
    register: async (req, res) => {
        try {
            if (req.body.login) {
                req.body.login = CryptoHelper.encrypt(req.body.login);
            }

            const userId = await User.createStudent(req.body);

            req.session.userId = userId.id;
            req.session.role = 'student';

            req.session.save((err) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/auth?error=session_error');
                } 
                res.redirect('/profile');
            });
        } catch (error) {
            res.redirect('/auth?error=register_error');
        }
    },

    //login processing (universal for students and admins)
    login: async (req, res) => {
        const {login, password} = req.body;
        try {
            const users = await User.getAllRaw();
            const user = users.find(u => CryptoHelper.decrypt(u.login) === login);

            if (user) {
                //old version without admin login ->|
                // const isMatch = await bcrypt.compare(password, user.password);
                let isMatch = false;

                if (user.role === 'admin') {
                    isMatch = (password === user.password);
                } else {
                    isMatch = await bcrypt.compare(password, user.password);
                }

                if (isMatch) {
                    req.session.userId = user.id;
                    req.session.role = user.role;
                    return req.session.save(() => {
                        res.redirect('/profile');
                    });
                }
            }
            res.redirect('/auth?error=invalid_credentials');
        } catch (error) {
            res.redirect('/auth?error=server_error');
        }
    },

    //profile
    getProfile: async (req, res) => {
        try {
            const user = await User.getById(req.session.userId, req.session.role);

            if (!user) return res.redirect('/auth');

            if (user.login) {
                user.login = CryptoHelper.decrypt(user.login);
            }

            res.render('profile', {
                user: user, role: req.session.role
            });
        } catch (error) {
            res.redirect('/auth');
        }
    },

    //update of profile (saving the settings)
    updateProfile: async (req, res) => {
        try {
            const rawData = {
                description: req.body.description,
                group_number: req.body.group_number,
                faculty: req.body.faculty,
                course: req.body.course,
                phone_number: req.body.phone_number,
                email: req.body.email,
                last_name: req.body.last_name,
                first_name: req.body.first_name
            };

            const updateData = {};
            Object.keys(rawData).forEach(key => {
                if (rawData[key] !== undefined && rawData[key] !== '') {
                    updateData[key] = rawData[key];
                }
            });

            if (req.session.role === 'admin' && updateData.description !== undefined) {
                delete updateData.description;
            }
            
            if (req.file) {
                updateData.photo = req.file.buffer;
            }

            if (Object.keys(updateData).length === 0) {
                return res.redirect('/profile');
            }

            await User.updateProfile(req.session.userId, req.session.role, updateData);
            res.redirect('/profile');
        } catch (error) {
            console.error("Update profile error: ", error);
            res.status(500).send('Update profile error');
        }
    },

    //logout
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    },

    createNote: async (req, res) => {
        const Note = require('../models/Note');
        try {
            const {description} = req.body;
            const studentId = req.session.userId;

            await Note.create(studentId, description);
            res.json({success: true});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, error: 'Database save not error'});
        }
    },

    deleteNote: async (req, res) => {
        const Note = require('../models/Note');
        try {
            const noteId = req.params.id;
            const studentId = req.session.userId;
            await Note.delete(noteId, studentId);
            res.json({success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, error: 'Datbase delete note error'});
        }
    }
};

module.exports = userController;