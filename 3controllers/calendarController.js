const Event = require('../4models/Event');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        res.render('calendar', {events});
    } catch (error) {
        res.status(500).json({error: 'Get events error'});
    }
};