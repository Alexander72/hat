class WebSocketService {
    socket;
    scheme;
    port;
    connectionUrl;
    reconnectAttempt = 0;
    isTryingToReconnect = false;
    messagesQueue = [];

    send(message) {
        console.log('WebSocketService: sending message: ');
        console.log(message);
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.log('WebSocketService: sending message is not possible due to socket status: ' + this.socket.readyState + '. Storing message in the queue for the future sending.');
            this.messagesQueue.push(message);
        }
    }

    connect(connectionUrl) {
        this.connectionUrl = connectionUrl ? connectionUrl : this.getDefaultConnectionUrl();
        console.log('WebSocketService: Opening WS connection to ' + this.connectionUrl);

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocketService: Socket is already connected, do nothing");
            return;
        }

        const self = this;
        this.socket = new WebSocket(this.connectionUrl);
        this.socket.onopen = function (event) {
            self.logSocketStatus(event);
            self.reconnectAttempt = 0;
            console.log("WebSocketService: socket opened successfully! Trying to resend queued messages.");
            setTimeout(function () {
                while (self.messagesQueue.length) {
                    self.send(self.messagesQueue.shift());
                }
            }, 10);
        };
        this.socket.onclose = function (event) {
            console.log("WebSocketService: onclose handler triggered");
            self.logSocketStatus(event);
            self.reconnect();
        };
        this.socket.onerror = function (event) {
            console.log("WebSocketService: onerror handler triggered");
            self.logSocketStatus(event);
            self.reconnect();
        };
        this.socket.onmessage = function (event) {
            console.log('WebSocketService: Received message: ');
            console.log(event);
        };
    }

    close() {
        console.info("WebSocketService: Closing connection");
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocketService: Socket not connected, unable to close!");
            return;
        }
        this.socket.close(1000, "Closing from client");
        console.info("WebSocketService: Connection closed");
    }

    reconnect() {
        if (this.isTryingToReconnect) {
            console.log('WebSocketService: already trying to reconnect, wait for reconnect finishes');
            return;
        }

        this.isTryingToReconnect = true;

        if (this.reconnectAttempt >= 10) {
            console.error('WebSocketService: reconnect attempt limit has been reached')
            return;
        }
        this.reconnectAttempt++;
        console.log('WebSocketService: reconnect attempt: ' + this.reconnectAttempt);

        let self = this;
        setTimeout(function () {
            self.doReconnect();
            self.isTryingToReconnect = false;
        }, 100);
    }

    doReconnect() {
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

    logSocketStatus() {
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