const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const consumer = kafka.consumer({ groupId: "ws-group" });

async function startConsumer(onMessage, retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "task-updates", fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const data = JSON.parse(message.value.toString());
          onMessage(data);
        },
      });

      console.log("Kafka consumer connected");
      return;
    } catch (err) {
      console.warn(`⏳ Kafka consumer retry ${i + 1}/${retries}`);
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

module.exports = { startConsumer };
