import socketIo from 'socket.io-client'

const socket = socketIo('https://chatt-app-backend-qrai.onrender.com/', { transports: ['websocket'] });
// const socket = socketIo('http://localhost:5000/', { transports: ['websocket'] });

export default socket;
