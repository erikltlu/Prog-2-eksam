(function(){
    var element = function (id){
        return document.getElementById(id);
    }

    // Get Elements
    var joinGame = element('join-game');
    var win = element('win');
    var betAmount = element('bet-amount');
    var creator = 1;
    var guest = 2;
    

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
        /*socket.on('output', function(data){
            if(data.length){
                document.cookie;
            }
            var game = document.createElement('div');
            var winner = Math.round((Math.random() * 1) + 1);
            console.log(winner);
            game.setAttribute('class', 'game-area');
            if(winner == 1){
                game.innerHTML ='<h1>Võitis Creator</h1>';
            } else {
                game.innerHTML ='<h1>Võitis Guest</h1>';
            }
            game.appendChild(gameContainer);
            game.insertBefore(gameContainer, game.firstChild);
        });*/

        // Get status from server
        socket.on('status', function(data){
            // get message status
            setStatus((typeof data === 'object')? data.name : data);

        });

        // Handle input
        joinGame.addEventListener('click', function(event){
            var winner = Math.round((Math.random() * 1) + 1);
            var sum = betAmount.value*2;
            console.log(winner);
            if(winner == 1){
                win.innerHTML ='Ruumi omanik võitis '+sum+'!';
            } else {
                win.innerHTML ='Külastaja võitis '+sum+'!';
            }
        });
    }
})();