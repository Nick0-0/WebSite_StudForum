const Event = require('../4models/Event');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('dotenv').config().parsed;

exports.createEvent = async (req, res) => {
    try {
        const {name, start_date, end_date, description} = req.body;

        const newEvent = new Event({
            name, start_date, end_date, description
        });

        const event = await newEvent.create();
        res.status(201).json({message: 'Event was successfuly created'});
    } catch (error) {
        res.status(500).json({error: 'Create event error'});
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }

        res.json(event.toObject());
    } catch (error) {
        res.status(500).json({error: 'Get event by id error'});
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json({events: events.map(event => event.toObject())});
    } catch (error) {
        res.status(500).json({error: 'Get events error'});
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }

        const {name, start_date, end_date, description} = req.body;
        event.name = name;
        event.start_date = start_date;
        event.end_date = end_date;
        event.description = description;

        await event.update();
        res.json({message: 'Event was successfuly updated'});
    } catch (error) {
        res.status(500).json({error: 'Update event error'});
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({error: 'Event not found'});

            await event.delete();
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({error: 'Delete event error'});
    }
};