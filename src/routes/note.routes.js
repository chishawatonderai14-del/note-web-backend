const router = require('express').Router();
const verifyValid = require('../middleware/authMiddleware');
const { 
    createNote,
    getActivities,
    getCategories,
    getNotes,
    deleteNote,
    pinNote,
    addFav,
    getCateg,
    updateNotes,
    login,
    signup
} = require('../controllers/note.controller');

// The get note route
router.post('/create-note',verifyValid, createNote);
router.get('/get-notes/:id', verifyValid, getNotes); // checked
router.delete('/delete-note/:id', verifyValid, deleteNote);
router.put('/pin-note', verifyValid, pinNote);
router.get('/get-categories/:id', verifyValid, getCategories);
router.get('/get-activities/:id', verifyValid, getActivities);
router.put('/add-fav', verifyValid, addFav);
router.get('/get-categ', verifyValid, getCateg);
router.put('/update-note', verifyValid, updateNotes);
router.post('/login', login);
router.post('/signup', signup);
module.exports = router;