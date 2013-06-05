
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var usuarios = new Array();
io.sockets.on("connection", conexion);


function conexion(socket){
    // Recibe un nombre
    socket.on("nombreNuevo", function (nombre){
        usuarios[nombre] = socket.id;
        var data = {
                nombre : nombre,
                id     : socket.id
        };
        // Emite un nombre
        io.sockets.emit("nombreRecibido",data);
    });

    // Recibe un incremento
    socket.on("incrementar", function (nombre){
        // Emite un incremento
        io.sockets.socket(usuarios[nombre]).emit('incrementoRecibido', 1);
    });

    // Recibe un Mensaje
    socket.on("enviarMensaje", function (data){
        // Emite un incremento
        io.sockets.socket(usuarios[data.para]).emit('mensajeRecibido', data);
    });
}



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
