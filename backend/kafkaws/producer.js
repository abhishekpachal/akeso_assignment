const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
}

async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

module.exports = { connectProducer, sendMessage };
