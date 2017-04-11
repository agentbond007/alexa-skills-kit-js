#using Node6.1js
'use strict';

console.log('Loading function');

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Hello World!');
    console.log('We Received ' + JSON.stringify(event));
    callback(null, event.key1);  // Echo back the first key value
    //callback('Something went wrong');
};
