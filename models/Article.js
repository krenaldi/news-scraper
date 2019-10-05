// Require mongoose
const mongoose = require('mongoose');

// Saved reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    /*  'note' is an object that stores a Note ID. The ref property links the ObjectId to the Note model.
        This allows us to populate the Article with an associated Note */
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }    
});

// Create Article model from above schema using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;