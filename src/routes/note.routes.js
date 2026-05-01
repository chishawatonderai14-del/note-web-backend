const router = require('express').Router();
const { createNote } = require('../controllers/note.controller');
const { getNotes } = require('../controllers/note.controller');
const { deleteNote } = require('../controllers/note.controller');

// The get note route
router.post('/create-note', createNote);
router.get('/get-notes', getNotes);
router.delete('/delete-note/:id', deleteNote);

module.exports = router;