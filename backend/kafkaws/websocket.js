const WebSocket = require("ws");

let wss;
const userSockets = new Map();

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === "auth" && data.userId) {
          userSockets.set(data.userId, ws);
          ws.userId = data.userId;
            console.log(`User ${data.userId} connected`);
            // sendToUser(data.userId, { type: "welcome", message: "You are now connected" });
        }
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    });

    ws.on("close", () => {
      if (ws.userId) userSockets.delete(ws.userId);
    });
  });
}

function sendToUser(userId, data) {
  const ws = userSockets.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

module.exports = { setupWebSocket, sendToUser };
