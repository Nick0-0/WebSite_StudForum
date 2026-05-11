const User = require('../4models/User');
const bcrypt = require('bcrypt');

const userController = {
    //displaying the login/registration page
    renderAuth: (req, res) => {
        res.render('auth', {error: null});
    }, 

    //student registration processing
    register: async (req, res) => {
        try {
            const userId = await User.createStudent(req.body);

            req.session.userId = userId.id;
            req.session.role = 'student';
            res.redirect('/profile');
        } catch (error) {
            res.render('auth', {error: 'Register error'});
        }
    },

    //login processing (universal for students and admins)
    login: async (req, res) => {
        const {login, password} = req.body;
        try {
            const user = await User.findByLogin(login);

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    req.session.userId = user.id;
                    req.session.role = user.role;
                    return res.redirect('/profile');
                }
            }
            res.render('auth', {error: 'Invalid login or password'});
        } catch (error) {
            res.status(500).send('Server error');
        }
    },

    //profile
    getProfile: async (req, res) => {
        try {
            const user = await User.getById(req.session.userId, req.session.role);

            if (!user) return res.redirect('/auth');

            res.render('profile', {
                user, role: req.session.role,
                layout: 'layout'
            });
        } catch (error) {
            res.redirect('/auth');
        }
    },

    //update of profile (saving the settings)
    updateProfile: async (req, res) => {
        try {
            const updateData = {
                description: req.body.description,
                photo: req.body.photo,
                group_number: req.body.group_number,
                faculty: req.body.faculty,
                course: req.body.course,
                phone_number: req.body.phone_number,
                email: req.body.email,
                last_name: req.body.last_name,
                first_name: req.body.first_name
            };

            await User.updateProfile(req.session.userId, req.session.role, updateData);
            res.redirect('/profile');
        } catch (error) {
            res.status(500).send('Update profile error');
        }
    },

    //logout
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
};

module.exports = userController;