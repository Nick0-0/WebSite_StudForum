class Document {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.userId = data.userId;
    }

    static async create(doc) {
        //logic of document creating
    }
}

module.exports = Document;