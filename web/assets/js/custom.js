$(document).ready(function(){

        var nuevoEvento;

        console.log('Funcionando...');

        $('#calendar').fullCalendar({
            header: {
              left: 'prev,next,today,Boton1',
              center: 'title',
              right: 'month,agendaWeek,agendaDay,listMonth'
            },
            customButtons:{
                Boton1:{
                    text: 'Detalle',
                    click: function(){
                        alert('Hacer algo!!');
                    }
                }
            },
            dayClick: function(date, jsEvent, view){
                $('#start').val(date.format());
                $('#end').val(date.format());
                $('#modalForm').modal();
            },

            events: {
                url: 'http://localhost/app-calendario/web/app_dev.php/events',
                type: 'GET',
                error: function(){
                    console.log('Hay un error en la petición GET de eventos...');
                }
            },
            eventClick: function(calEvent, jsEvent, view){ 
                // h5
                $('#titleEvent').html(calEvent.title);

                // Mostrar información del evento en el modal
                $('#id').val(calEvent.id);
                $('#title').val(calEvent.title);
                $('#description').val(calEvent.description);
                $('#color').val(calEvent.color);

                // Fecha y hora comienzo
                FechaStart = calEvent.start._i.split(' '); // Partimos por el espacio
                $('#start').val(FechaStart[0]);
                $('#startHour').val(FechaStart[1]);
                // Fecha y hora fin
                FechaEnd = calEvent.end._i.split(' '); // Parto por el espacio
                $('#end').val(FechaEnd[0]);
                $('#endHour').val(FechaEnd[1]);

                $('#modalForm').modal('toggle');
            },
            displayEventTime: false,
            editable: true, // Hace que el evento se pueda editar (drop)
            eventDrop: function(calEvent){
                // Información del evento
                $('#id').val(calEvent.id);
                $('#title').val(calEvent.title);
                $('#description').val(calEvent.description);
                $('#color').val(calEvent.color);

                // Fecha y hora
                var FechaHora = calEvent.start.format().split('T'); // Partimos por la 'T'
                $('#start').val(FechaHora[0]);
                $('#startHour').val(FechaHora[1]);

                recolectarDatosGUI(); // Recoge los datos del formulario y rellena el objetoEvento
                enviarInformacion('edit', objetoEvento); // Envía los datos por AJAX acción crear y envía el objeto ya creado
            }


        });

        $('#btn-crear').click(function(){

            recolectarDatosGUI(); // Recoge los datos del formulario y rellena el objeto nuevoEvento
            enviarInformacion('create', objetoEvento); // Envía los datos por AJAX acción crear y envía el objeto ya creado

        });

        $('#btn-actualizar').click(function(){

            recolectarDatosGUI(); // Recoge los datos del formulario y rellena el objetoEvento
            enviarInformacion('edit', objetoEvento, true); // Envía los datos por AJAX acción crear y envía el objeto ya creado

        });

        $('#btn-eliminar').click(function(){

            recolectarDatosGUI(); // Recoge los datos del formulario y rellena el objetoEvento
            enviarInformacion('delete', objetoEvento); // Envía los datos por AJAX acción crear y envía el objeto ya creado

        });


        // Información del formulario del modal
        function recolectarDatosGUI(){

            objetoEvento = {
                id: $('#id').val(),
                title: $('#title').val(),
                start: $('#start').val()+ ' '+$('#startHour').val(),
                end: $('#end').val()+ ' '+$('#endHour').val(),
                color: $('#color').val(),
                description: $('#description').val(),
                textColor: '#FFFFFF',
            }
        }

        function enviarInformacion(action, objetoEvento, modal){

            $.ajax({
                type: 'POST',
                url: 'http://localhost/app-calendario/web/app_dev.php/events?action=' + action,
                data: objetoEvento,
                success: function(message){
                    // Si la respuesta es true
                    if(message){
                        $('#calendar').fullCalendar('refetchEvents');    // Renderiza los eventos
                        // Si modal está a false
//                        if(!modal){
                            $('#modalForm').modal('toggle');    // Cierra el modal
//                        }
                    }

                },
                error: function(){
                    alert('Hay un error en la petición');
                }
            });
        }

});
