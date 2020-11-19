import io from 'socket.io-client';

const socket = io(process.env.WEBSOCKET_SERVEUR_ENDPOINT);

export default socket;
