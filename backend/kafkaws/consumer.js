const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const consumer = kafka.consumer({ groupId: "ws-group" });

async function startConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: "task-updates", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      onMessage(data);
    },
  });
}

module.exports = { startConsumer };
