import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
  }

  connect() {
    if (!this.connected) {
      const socket = new SockJS(`${getDomain()}/ws`);
      this.client = Stomp.over(socket);
      console.log("after stomp.over")
      this.client.connect({}, () => {
        console.log("in client.connect func")
        this.connected = true;
        console.log("Connected to WebSocket server");

        // Re-subscribe to existing subscriptions
        for (const [topic, { callback, params }] of Object.entries(this.subscriptions)) {
          this.client.subscribe(topic, callback, params);
          console.log(`Subscribed to ${topic}`);
        }
      }, (error) => {
        console.error("Error connecting to WebSocket server", error);
      });

      socket.onerror = (event) => {
        console.error("WebSocket error", event);
      };
    }
  }

  disconnect() {
    if (this.connected && this.client) {
      this.client.disconnect(() => {
        console.log("Disconnected from WebSocket server");
        this.connected = false;
      });
    }
  }

  subscribe(topic, callback, payloadParams = {}) {
    if (this.connected && this.client) {
      const subscription = this.client.subscribe(topic, (message) => {
        callback(message);
      }, payloadParams);
      this.subscriptions[topic] = subscription;
      console.log(`Subscribed to ${topic}`);
    } else {
      console.warn("WebSocket is not connected. Subscription not added.");
      this.subscriptions[topic] = callback;
    }
  }

  unsubscribe(topic) {

    if (this.connected && this.client && this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe();
      delete this.subscriptions[topic];
      console.log(`Unsubscribed from ${topic}`);
    } else {
      console.warn("WebSocket is not connected or subscription does not exist.");
    }
  }

  sendMessage(endpoint, payload) {
    if (this.connected && this.client) {
      this.client.send(endpoint, {}, JSON.stringify(payload));
      console.log(`sent message to ${endpoint}`);
    } else {
      console.warn("WebSocket is not connected. Message not sent.");
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
