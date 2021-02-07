class WebSocketService {
    socket;
    scheme;
    port;
    connectionUrl;

    send(message) {
        console.log('WebSocketService: sending message: ');
        console.log(message);
        this.socket.send(JSON.stringify(message));
    }

    connect(connectionUrl) {
        const self = this;
        const reconnectFunction = function (event) {
            self.logSocketStatus(event);
            self.reconnect();
        };

        this.connectionUrl = connectionUrl ? connectionUrl : this.getDefaultConnectionUrl();
        console.log('WebSocketService: Opening WS connection to ' + this.connectionUrl);

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocketService: Socket is already connected, do nothing");
            return;
        }

        this.socket = new WebSocket(this.connectionUrl);

        this.socket.onopen = this.logSocketStatus;
        this.socket.onclose = reconnectFunction;
        this.socket.onerror = reconnectFunction

        this.socket.onmessage = function (event) {
            console.log('WebSocketService: Received message: ');
            console.log(event);
        };
    }

    close() {
        console.info("WebSocketService: Closing connection");
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocketService: Socket not connected, unable to close!");
        }
        this.socket.close(1000, "Closing from client");
        console.info("WebSocketService: Connection closed");
    }

    reconnect() {
        console.log('WebSocketService: Trying to reconnect');
        this.close();
        this.connect();
        console.log('WebSocketService: Reconnected');
    }

    getDefaultConnectionUrl() {
        if (!this.connectionUrl) {
            this.scheme = document.location.protocol === "https:" ? "wss" : "ws";
            this.port = document.location.port ? (":" + document.location.port) : "";

            this.connectionUrl = this.scheme + "://" +
                document.location.hostname + this.port +
                "/ws/game/" + window.location.pathname.split('/')[1];
        }

        return this.connectionUrl;
    }

    logSocketStatus(event) {
        console.log(event);
        if (!this.socket) {
            console.log('WebSocketService: Socket is not initialized');
        } else {
            switch (this.socket.readyState) {
                case WebSocket.CLOSED:
                    console.log('WebSocketService: Socket status: Closed.');
                    break;
                case WebSocket.CLOSING:
                    console.log('WebSocketService: Socket status: Closing...');
                    break;
                case WebSocket.CONNECTING:
                    console.log('WebSocketService: Socket status: Connecting...');
                    break;
                case WebSocket.OPEN:
                    console.log('WebSocketService: Socket status: Open.');
                    break;
                default:
                    console.log('WebSocketService: Unknown WebSocket State: ' + this.socket.readyState);
                    break;
            }
        }
    }
}

module.exports = WebSocketService;