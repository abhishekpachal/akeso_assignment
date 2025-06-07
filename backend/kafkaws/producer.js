const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

async function connectProducer(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log("Kafka producer connected");
      return;
    } catch (err) {
      console.warn(`⏳ Kafka producer retry ${i + 1}/${retries}`);
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

module.exports = { connectProducer, sendMessage };
