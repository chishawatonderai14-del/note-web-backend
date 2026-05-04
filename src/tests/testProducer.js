const { sendEvent } = require('../services/producer');
const data = {
    eventType: "NOTE_CREATED",
    eventId: 1,
    icon : "create",
    action: "Create 'Talk to boss'",
    textBody: "You created a note",
    timestamp: new Date()
};
sendEvent(data);