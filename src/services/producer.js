const { Kafka} = require('kafkajs');
const eventType = require('../utils/eventType');

const kafka = new Kafka({
  clientId: 'note-app',
  brokers: ['kafka:9092']
});
const producer = kafka.producer();
const sendEvent = async () => {
  await producer.connect();
  await producer.send({
    topic: "note-events",
    messages: [
      {
        key: '1',
        value: JSON.stringify({
          eventType: eventType.NOTE_CREATED,
          content: 'Hello, this is the test note content.'
        })
      }
    ]
  });
  await producer.disconnect();
}
module.exports = {
  sendEvent
}