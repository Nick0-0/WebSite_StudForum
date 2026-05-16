const Event = require('../4models/Event');

const calendarController = {
    //displaying event-calendar
    renderCalendar: async (req, res) => {
        try {
            const monthFilter = req.query.month;
            let events;

            if (monthFilter) {
                events = await Event.getByMonth(monthFilter);
            } else {
                events = await Event.getAll();
            }

            res.render('calendar', {
                events,
                currentMonth: monthFilter || 'All time'
            });
        } catch (error) {
            res.status(500).send('Loading calendar error');
        }
    },

    //student's suggestion of an event
    suggestEvent: async (req, res) => {
        try {
            const eventData = {
                name: req.body.name,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                description: req.body.description
            };
            await Event.suggest(eventData, req.session.userId);

            res.redirect('/calendar?suggested');
        } catch (error) {
            res.status(500).send('Send event error');
        }
    },

    //pending events for admin
    renderPendingEvents: async (req, res) => {
        if (req.session.role !== 'admin') return res.status(403).send('Not access rights');

        try {
            const pending = await Event.getPending();
            res.render('pending-events', {pending, role: 'admin'});
        } catch (error) {
            res.status(500).send('Loading pending events error');
        }
    },

    //helper func
    getPendingEventsJSON: async (req, res) => {
        if (req.session.role !== 'admin') {
            return res.status(403).json({error: 'Not access rights'});
        }
        try {
            const pending = await Event.getPending();
            res.json(pending);
        } catch (error) {
            res.status(500).json({error: 'API error'});
        }
    },

    //publication events by admin
    approveEvent: async (req, res) => {
        if (req.session.role !== 'admin') return res.status(403).send('Not access rights');

        try {
            const {journalId, name, start_date, end_date, description} = req.body;

            await Event.create(name, start_date, end_date, description);
            await Event.deleteJournalEntry(journalId);
            res.json({success: true});
        } catch (error) {
            console.error("APPROVE_EVENT ERROR:", error);
            res.status(500).json({success: false, error: 'Publication event error'});
        }
    },

    deleteEvent: async (req, res) => {
        if (req.session.role !== 'admin') return res.status(403).send('Not access rights');

        try {
            await Event.deleteJournalEntry(req.params.id);
            res.json({success: true});
        } catch (error) {
            console.error("DELETE_EVENT ERROR:", error);
            res.status(500).json({success: false, error: 'Delete error'});
        }
    }
};

module.exports = calendarController;