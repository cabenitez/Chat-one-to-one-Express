var sockets = io.connect('http://127.0.0.1:3000');

$(document).ready(function(){
    
    // envio el nombre del usuario al server
    $('#formulario').on('submit', enviarNombre);
    
    // cuando recibo el nombre lo muestro
    sockets.on('nombreRecibido', mostrarNombre);
        
    // emito cuando el usuario ejecuta +1
    $(document).on('click', 'span[class="nombre"]', function(){
        sockets.emit('incrementar', $(this).attr('data'));
    });    

    // muestro el valor cuando se produce el incremento
    sockets.on('incrementoRecibido', mostrarIncremento);

    // cuando el usuario hace click en el icono del chat muestro el nombre
    $(document).on('click', 'span[class="chat"]', function(){
        $('#chat-usuario').html($(this).attr('data'));
    });

    // cuando el usuario presiona enter emite el texto
    $("#chat-text").keypress(function(event) {
        if ( event.which == 13 ) {
            
            var data = {
                    de     : $('#nombre').val(),
                    para   : $('#chat-usuario').html(),
                    mensaje: $(this).val()
            };
            sockets.emit('enviarMensaje', data);
            $(this).val('');
            $('#chat-historial').val($('#chat-historial').val() + 'yo: ' + data.mensaje + '\r\n');
        }
       
    });

    // muestro mensaje recibido del chat
    sockets.on('mensajeRecibido', mostrarMensaje);

});

function enviarNombre(e){
    e.preventDefault();
    sockets.emit('nombreNuevo', $('#nombre').val());
    $('#nombre').attr('readonly', true);
}

function mostrarNombre(data){
    if ($('span[nombre="' + data.nombre + '"]').size() == 0)
        $('#nombres').append('<div>Acaba de entrar: <b>' + data.nombre + '</b><span class="nombre" data="' + data.nombre + '">+1</span> <span class="chat" data="' + data.nombre + '">:-)</span></div>');
}

function mostrarIncremento(data){
    var incremento = parseInt($('#incremento').html()) + data;
    $('#incremento').html(incremento);
}

function mostrarMensaje(data){
    $('#chat-usuario').html(data.de);
    $('#chat-historial').val($('#chat-historial').val() + data.de + ': ' + data.mensaje + '\r\n');
}