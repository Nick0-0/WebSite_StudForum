const Document = require('../4models/Document');

exports.getDocument = async (req, res) => {
    try {
        const documents = await Document.getAll();
        res.json(documents);
    } catch (error) {
        res.status(500).json({error: 'Get document error'});
    }
};

exports.createDocument = async (req, res) => {
    //logic of document create
}