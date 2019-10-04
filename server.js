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

    })
})

// server is listening
app.listen(PORT, function() {
    console.log("App listening on http://localhost:" + PORT)
});