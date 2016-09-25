var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = mongoose.Schema({
    date       : {type: Date, default: Date.now},
    amount     : Number,
    source       : String
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getFeeds = function(callback) {

    var feeds = [];

    // Query the db, using skip and limit to achieve page chunks
    Feed.find({}).sort({date: 'desc'}).exec(function(err,docs){

        // If everything is cool...
        if(!err) {
            feeds = docs;  // We got tweets
        }
        // Pass them back to the specified callback
        callback(feeds);

    });

};

schema.statics.getFeedsToday = function(callback) {

    var feeds = [];

    var startTime = new Date();
    startTime.setHours(0,0,0,0);

    var endTime = new Date();
    endTime.setHours(23,59,59,999);

    // Query the db, using skip and limit to achieve page chunks
    Feed.find({date: {$gte: startTime, $lt: endTime}}).sort({date: 'desc'}).exec(function(err,docs){

        // If everything is cool...
        if(!err) {
            feeds = docs;  // We got tweets
        }

        // Pass them back to the specified callback
        callback(feeds);

    });

};

// Return a Tweet model based upon the defined schema
module.exports = Feed = mongoose.model('Feed', schema);