import Server from 'socket.io';

/**
 1. a client sends an action to the server
 2. the server hands the action to the redux store
 3. the store calls the reducer and the reducer executes the logic related to the action.
 4. the store updates its state based on the return value of the reducer
 5. the store executes the listener function subscribed by the server.
 6. the server emits a state event
 7. all connected clients - inlcuding the one that initiated the original action - receive the new state
 **/

var port = process.env.PORT || 8090

console.log('Websocket port : ' + port);

export default function startServer(store) {
    const io = new Server().attach(port);

    // 6.
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    io.on('connection', (socket) => {
        console.log('New connection!')
        // emmit the current state of the store on connection
        socket.emit('state', store.getState().toJS());
        // receive updates from the clients, voters will be assigning votes
        // have the clients emit actions that we can feed directly into the redux store.
        // 3.
        socket.on('action', store.dispatch.bind(store));
    });

}