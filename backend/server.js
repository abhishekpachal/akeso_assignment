require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const { startConsumer } = require("./kafkaws/consumer");
const { connectProducer } = require("./kafkaws/producer");
const { setupWebSocket, sendToUser } = require("./kafkaws/websocket");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
setupWebSocket(server);
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API");
});

const PORT = process.env.PORT || 5000;

console.time("Kafka startup");

(async () => {
  await connectProducer();
  await startConsumer((msg) => {
    const { userId, payload } = msg;
    sendToUser(userId, payload);
  });

  server.listen(PORT, () => {
    console.timeEnd("Kafka startup");
    console.log(`Server listening on port ${PORT}`);
  });
})();