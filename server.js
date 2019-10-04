/*   DEPENDENCIES */
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

// Require scraping tools
const axios = require('axios');
const cheerio = require('cheerio');

// Require all models
const db = require('./models');

const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Configure Middleware
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public folder the static folder
app.use(express.statis('public'));

// Connect to MongoDB
mongoose.connect('mongoose://localhost/newsscraper', { useNewUrlParser: true });

// Routes

// GET route for scraping NYT site
app.get('/scrape', res => {
    // Grab the body of the html with axios
    axios.get('https://www.rollingstone.com/politics/').then(response => {
        // Then load into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        // Grab every header with a c-card__header class
        $('header.c-card__header').each((i, element) => {
            // Save to an empty result object
            let result = {};

            // Add title, intro, & link and save them as properties of the result object
            result.title = $(this)
                .children('h3')
                .text();
            result.intro = $(this)
                .children('p')
                .text();
            result.link = $(this)
                .parent('a')
                .attr('href');

            // Create a new Article collection using the result object built from scraping
            db.Article.create(result)
                .then(dbArticle => {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(err => console.log(err));
        });

        // Send message to client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from db
app.get('/articles', res => {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => { throw err })
});

// Route for grabbing a specific Article by id & populate it with a note
app.get('/articles/:id', (req, res) => {
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id }).populate('note')
        .then(dbArticle => res.json(dbArticle))
        .catch(err => { throw err });
});

//Route for saving/updating an Article's associated Note
app.post('articles/:id', (req, res) => {
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note

    /* Add model methods here if needed
    var note = new Note();
    note.method(); */
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(dbArticle => res.json(dbArticle))
        .catch(err => { throw err });
});

// server is listening
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT)
});