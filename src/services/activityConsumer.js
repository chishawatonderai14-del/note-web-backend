const { Kafka } = require('kafkajs');
const prisma = require('../prisma/client');

const kafka = new Kafka({
  clientId: 'note-app',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'note-group'});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'note-events', fromBeginning: true});

  await consumer.run({
    eachMessage: async ({ message }) => {
      const noteEvent = JSON.parse(message.value.toString());
      const result = await prisma.activityLog.create({
        data: {
          eventType: noteEvent.eventType,
          eventId: noteEvent.eventId,
          icon : noteEvent.icon,
          action: noteEvent.action,
          textBody: noteEvent.textBody,
          timestamp: noteEvent.timestamp
        }
      })
      console.log("Received event: ", noteEvent);
    }
  });
}
run()