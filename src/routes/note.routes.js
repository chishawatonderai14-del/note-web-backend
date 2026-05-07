const router = require('express').Router();
const { 
    createNote,
    getActivities,
    getCategories,
    getNotes,
    deleteNote,
    pinNote,
    addFav,
    getCateg,
    updateNotes
} = require('../controllers/note.controller');

// The get note route
router.post('/create-note', createNote);
router.get('/get-notes', getNotes);
router.delete('/delete-note/:id', deleteNote);
router.put('/pin-note', pinNote);
router.get('/get-categories', getCategories);
router.get('/get-activities', getActivities);
router.put('/add-fav', addFav);
router.get('/get-categ', getCateg);
router.put('/update-note', updateNotes);

module.exports = router;