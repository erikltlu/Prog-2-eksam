
(function(){
    var element = function (id){
        return document.getElementById(id);
    }

    var celement = function (a){
        return document.getElementsByClassName(a);
    }

    // Get Elements
    var status = element('status');
    var createBtn = element('create');
    var messages = element('game-container');
    var username = element('username');
    var id = 0;
    // Set default status
    var statusDefault = status.textContent;

    var setStatus = function(s){
        //Set status
        status.textContent = s;

        if(s !== statusDefault){
            var delay = setTimeout(function(){
                setStatus(statusDefault);
            }, 4000);
        }
    }

    // Connect to socket.io
    var socket = io.connect('http://127.0.0.1:4000');

    // Check for connection
    if(socket !== undefined){
        console.log('Connected to socket...');
        
        // Handle output
        socket.on('output', function(data){
            console.log(data);
            if(data.length){
                for(var i = 0; i < data.length; i++){
                    // Build out message div
                    id++;
                    var message = document.createElement('div');
                    message.setAttribute('class', 'game-room');
                    /*message.setAttribute('onClick', 'reply_click(this.id)')*/
                    message.style.border = "1px solid black";
                    message.innerHTML ='<a class="link" href="ruum.html" >'+data[i].name+'</a><button class="delete" id="'+id+'">DEL</button>';
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
                var clickedId;

                var reply_click = function(){
                    clickedId = this.id;
                    console.log(clickedId);
                    console.log(data[clickedId-1]._id);
                    delId = data[clickedId-1]._id;
                    socket.emit('clear', {
                        id: delId
                    });
                    var celement = document.getElementById(clickedId);
                    celement.parentNode.parentNode.removeChild(celement.parentNode);
                }

                for(x = 1; x <= data.length; x++){
                    document.getElementById(x).onclick = reply_click;
                }
                
            }
        });

        // Get status from server
        socket.on('status', function(data){
            // get message status
            setStatus((typeof data === 'object')? data.name : data);

        });

        // Handle Input
        createBtn.addEventListener('click', function(event){
            socket.emit('inputA', {
                name: username.value
            });

            event.preventDefault();
        });

        // Clear message
        socket.on('cleared', function(){
            messages.textContent = '';
        });
    }
})();