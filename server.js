'use strict';
require('./loadConfig.js');


const Hapi = require('hapi');
var sigfox = require('./sigfox.js');

const auth = function (request, username, password, callback) {
    callback(null, (username === process.env.LOGIN && password===process.env.PASSWORD), { });
};
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});




server.register([{register:require('vision')}, {register:require('inert')}], (err) => {
  if (err){
    throw err;
  }
  server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });
});

server.register(require('hapi-auth-basic'), (err) => {

  server.auth.strategy('simple', 'basic', { validateFunc: auth });
  // Add the route
  server.route({
      method: 'GET',
      path:'/',
      config:{auth:'simple'},
      handler:function(request, reply){
        console.log('[%s] %s', request.method, request.path);
        sigfox.getGroupMessages(/unahack/i)
       .then(function(deviceTypes){
         reply.view('index', {deviceTypes:deviceTypes});
       })
       .catch(function(err){
         reply(err.message);
        });
      }
  });
  server.route({
      method: 'GET',
      path: '/{file}.css',
      handler: function (request, reply) {
        reply.file("./static/css/"+request.params.file+".css");
      }
  });
  server.route({
      method: 'GET',
      path: '/{file}.js',
      handler: function (request, reply) {
        reply.file("./static/js/"+request.params.file+".js");
      }
  });
});
// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
