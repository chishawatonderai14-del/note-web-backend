// helper imports 
const prisma = require('../prisma/client');
const {
    createNoteResponse,
    ReqValid,
    pushNote,
    getAllNotes
} = require('../services/note.service');
//const { sendEvent } = require('../services/producer');

// the createNote controller
const createNote = async (req, res) => {
    try{
        const { title, content, pinned, category } = req.body;
        const reqNote = {
            title: title,
            content: content,
            pinned: pinned,
            category: category
        };
        // check if req is valid 
        if (!ReqValid(reqNote)) {
            res.status(400).json({ error: 'No heading or content provided'});
        }

        // create the note
        let note = await pushNote(reqNote);
        // format note
        note = await createNoteResponse(note);
        res.status(201).json(
            {message: 'Note created successfully', note: note}
        );
        // Send event to Kafka
        //await sendEvent();
    } catch(err) {
        res.status(500).json({ error: 'Failed to create note'});
    }
}
//==================================== GET NOTES ===============================
const getNotes = async (req, res) => {
    const notes = await getAllNotes();

    res.status(200).json({ notes: notes});
}
//============================== PIN NOTE =====================
const pinNote = async (req, res) => {
    try{
        const { noteId, pinned } = req.body;
        let updatedNote = await prisma.note.update({
            where: {
                id: noteId 
            },
            data: {
                pinned: !pinned
            }
        });
        updatedNote = await createNoteResponse(updatedNote);
        res.status(200).json({message: "Update was successful", note: updatedNote});
    } catch(err) {
        res.status(500).json({error: "!!NOTE UPDATE FAILED!!"});
    }
}
const deleteNote = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'No id provided'});

    const note = await prisma.note.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.status(200).json({ message: 'Note deleted successfully', note: note});
}
module.exports = {
    createNote,
    getNotes,
    deleteNote,
    pinNote
}