const { Kafka, Partitioners} = require('kafkajs');

const kafka = new Kafka({
  clientId: 'note-app',
  brokers: ['kafka:9092']
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
const sendEvent = async (noteEvent) => {
  await producer.connect();
  await producer.send({
    topic: "note-events",
    messages: [
      {
        key: String(noteEvent.eventId),
        value: JSON.stringify({
          eventType: noteEvent.eventType,
          eventId: noteEvent.eventId,
          icon: noteEvent.icon,
          action: noteEvent.action,
          textBody: noteEvent.textBody,
          timestamp: noteEvent.timestamp
        })
      }
    ]
  });
  await producer.disconnect();
}
module.exports = {
  sendEvent
}