exports.handler = function (event, context, callback) {
  console.log("Hi Everyone");
  return callback (null, "hello");
}
