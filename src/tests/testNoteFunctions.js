const { createNoteEvent

 } = require('../services/note.service');
const eventTypes = require('../utils/eventType');
function testCreateNoteEvent() {
    console.log("================= TESTING THE CREATE NOTE EVENT FUNCTION ===============");
    console.log();
    const item = {
        id: 1,
        title: 'testing',
        createdAt: new Date()
    }
    const eventType = "createNote";
    const result = createNoteEvent(item, eventType);
    const testPassed = result.eventId == 1 && result.icon == "create" && result.eventType == 'NOTE_CREATED'; 
    console.log(result);
    if (testPassed){
        console.log("TEST PASSED!!");
    }else{
        console.log("TEST FAILED!!");
    }
}
function testEventType(){
    console.log("================= TESTING THE EVENT TYPE EXPORT ===============");

    const getType = eventTypes.NOTE_CREATED;
    if (getType == 'NOTE_CREATED'){
        console.log("TEST PASSED!!");
    }else {
        console.log("TEST FAILED!!!");
    }
}
testCreateNoteEvent();