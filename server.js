const WebSocket = require('ws')
const PORT = 5000
var clients=[]

const wsServer = new WebSocket.Server({
    port: PORT
})

wsServer.on('connection', function (conn) {
    clients.push(conn)
    // Some feedback on the console
    console.log("New connection id: " + JSON.stringify(conn.index))

    // Attach some behavior to the incoming socket
    conn.on('message', function (msg) {
        console.log("Received message from client: "  + msg)
        // socket.send("Take this back: " + msg)

        // Broadcast that message to all connected clients
        wsServer.clients.forEach(function (client) {
            client.send(msg);       
        })

    })

})

console.log( (new Date()) + " Server is listening on port " + PORT)