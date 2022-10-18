const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let usuarios = [];
let socketIds = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('novo usuario','Um novo usuário se conectou!'); //Notifica apenas outros sockets (usuarios conectados)

    socket.on('new-user', (data) => {
        if (usuarios.indexOf(data) != -1) {
            socket.emit('new-user', { success: false });
        } else {
            usuarios.push(data);
            socketIds.push(socket.id);

            socket.emit('new-user', { sucess: true });
        }
    });

    socket.on('disconnect', () => { //Notifica quando o usuario se desconectou
        let id = sockeIds.indexOf(socket.id);
        socketIds.splice(id, 1);
        usuarios.splice(id, 1);

        console.log('Desconectado.');
    });

    socket.on('chat-message', (model) => {
        if (usuarios.indexOf(model.name) != -1 && usuarios.indexOf(model.nome) == socketIds.indexOf(socket.id)) {
            io.emit('chat-message', model);
        } else {
            console.log('Error: Voce nao tem permissao para executar essa açao!')
        }
    });
})

const port = 3000
http.listen(port, () => {
  console.log('listening on localhost:3000');
});