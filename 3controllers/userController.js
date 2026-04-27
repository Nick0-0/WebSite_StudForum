const User = require('../4models/User');

exports.register = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.create({username, password});
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: 'Registration error'});
    }
};

exports.login = async (req, res) => {
    //Authorization logic
}