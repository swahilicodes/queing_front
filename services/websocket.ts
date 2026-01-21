// services/websocketService.ts

import WebSocket from 'websocket';

const socketUrl = 'ws://192.168.30.246:500'; // Replace with your WebSocket server URL

//let client: WebSocket | null = null;
let client:any

export const connectWebSocket = () => {
    client = new WebSocket.client();

    client.on('connectFailed', (error: { toString: () => string; }) => {
        console.error('WebSocket connection error: ' + error.toString());
    });

    client.on('connect', (connection:any) => {
        console.log('WebSocket client connected');

        connection.on('error', (error:any) => {
            console.error('Connection Error: ' + error.toString());
        });

        connection.on('close', () => {
            console.log('WebSocket client disconnected');
        });

        connection.on('message', (message:any) => {
            if (message.type === 'utf8') {
                console.log('Received: ' + message.utf8Data);
                // Handle incoming message data here
            }
        });
    });

    client.connect(socketUrl);
};

export const disconnectWebSocket = () => {
    if (client) {
        client.abort();
        client = null;
    }
};
