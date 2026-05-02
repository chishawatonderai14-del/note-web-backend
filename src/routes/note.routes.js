const router = require('express').Router();
const { createNote } = require('../controllers/note.controller');
const { getNotes } = require('../controllers/note.controller');
const { deleteNote } = require('../controllers/note.controller');
const { pinNote } = require("../controllers/note.controller");
// The get note route
router.post('/create-note', createNote);
router.get('/get-notes', getNotes);
router.delete('/delete-note/:id', deleteNote);
router.put('/pin-note', pinNote);
module.exports = router;