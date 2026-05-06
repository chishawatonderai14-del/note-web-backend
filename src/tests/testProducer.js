const { sendEvent } = require('../services/producer');
const { createNoteEvent } = require('../services/note.service');
const data = {
    eventType: "NOTE_CREATED",
    eventId: 1,
    icon : "create",
    action: "Create 'Talk to boss'",
    textBody: "You created a note",
    timestamp: new Date()
};
const note = {
    id: 45,
    title: "Testing Events",
    content: "new content",
    pinned: false,
    createdAt: new Date()
}
sendEvent(createNoteEvent(note, "createNote"));