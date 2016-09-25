var React = require('react');
var MilkLogger = require('./components/FeedLogger.react.js');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML)

// Render the components, picking up where react left off on the server
React.renderComponent(
    <MilkLogger feeds={initialState}/>,
    document.getElementById('react-app')
);