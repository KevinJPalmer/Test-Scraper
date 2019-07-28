const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Import the model (cat.js) to use its database functions.
const db = require("../models/index.js");
const SCRAPE_URL = "https://www.si.com";

// Create all our routes and set up logic within those routes where required.
router.get(["/","/articles"], function (req, res) {
  db.Article.find({})
    .then(function (articles) {
      // If we were able to successfully find Articles, send them back to the client
      const hbsObject = { articles };
      res.render("home", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A GET route for scraping the echoJS website
router.get("/scraped", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get(SCRAPE_URL).then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".article-info .media-heading").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text()
        .trim();
      result.link = SCRAPE_URL + $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  })
  .then(function() {
    res.render("scraped");
  })
});


// retrieve saved articles
router.get("/saved", function (req, res) {
  db.Article.find({ saved: true })
    .then(function (savedArticles) {
      // If we were able to successfully find Articles, send them back to the client
      const hbsObject = { savedArticles };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
