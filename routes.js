var JSX = require('node-jsx').install(),
    React = require('react'),
    Feed = require('./models/milk');

module.exports = {

    feeds: function(req, res) {
        // Call static model method to get tweets in the db
        Feed.getFeeds(function (feeds) {
            // Render React to a string, passing in our fetched tweets
            res.json(feeds);

        });
    },

    add_feed: function(req, res) {
        var newFeed = new Feed({ amount: req.body.amount, source: req.body.source, });
        console.log('add feed')
        newFeed.save(function (err, newFeed) {
            if (err) return console.error(err);
        });
    }

}