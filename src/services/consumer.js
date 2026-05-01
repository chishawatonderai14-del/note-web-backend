const { Kafka } = require('kafkajs');

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
      console.log("Received event: ", noteEvent);
    }
  });
}
run()