const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
var ObjectId = require('mongodb').ObjectID;

// Connect to mongo

mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        //let chat = db.db('mongochat').collection('chats');
        let game = db.db('mongochat').collection('games');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        /*chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });*/

        // Get chats from mongo collection
        game.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });


        socket.on('inputA', function(data){
            let name = data.name;

            // Check for name and message
            if(name == ''){
                // Send error status
                sendStatus('Please enter a name');
            } else {
                // Insert message
                game.insert({name: name}, function(){
                    client.emit('output', [data]);
                    
                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });


/*
        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);
                    
                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

*/
        // Handle clear
        socket.on('clear', function(data){
            let id = data.id
            console.log(id);
            // Remove all chats from collection
            game.deleteOne( {"_id": ObjectId(id)});
        });
    });
});
