//============================== IMPORTS =====================
require('dotenv').config;
const { parse } = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
//const { sendEvent } = require('../services/producer');
const {
    createNoteResponse,
    ReqValid,
    pushNote,
    getAllNotes,
    createNoteEvent,
    formatActivities,
    sortCategory,
    getCategoryId
} = require('../services/note.service');

//============================== Auth Controllers =====================
const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password ) return res.status(400).json({message: "No data Provided."});
        // check email   
        const user = await prisma.user.findUnique({
            where: {
                email: email 
            }
        });
        if (user == null) return res.status(404).json({message: "User not found!"});
        const verifyPassword = await bcrypt.compare(
            password, 
            user.password
        );
        if (!verifyPassword) return res.status(401).json({message: "Invalid credentials"});
        // create the JWT token
        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '7d'});
        const {password: _, ...userNoPassword} = user;
        res.status(200).json(
            {
                jwt: token,
                user: userNoPassword
            }
        ); 
    
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to login!!", message: err});
    }
}
const signup = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if (!name || !email || !password ) return res.status(400).json({message: "No data Provided."});
        // check email 
        const checkEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(checkEmail) return res.status(400).json({message: "email already used", error: checkEmail});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                role: "user",
                password: hashedPassword
            }
        });
        const userNoPass = {
            name: user.name,
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
        // create the JWT token
        const token = jwt.sign(userNoPass, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json(
            {
                jwt: token,
                user: userNoPass
            }
        );
    
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to login!!", message: err});
    }
}

//============================== UPDATE NOTE =====================
const updateNotes = async (req, res) => {
    try{
        const { id, title, content, pinned, favourite, trash, category } = req.body;
        const reqNote = {
            id: id,
            title: title,
            favourite: favourite,
            trash: trash,
            content: content,
            pinned: pinned, 
            category: category
        };  
        // check if req is valid 
        if (!ReqValid(reqNote)) {
            res.status(400).json({ error: 'content provided'});
        }
        const categoryId = await getCategoryId(category);
        // update the note
        let note = await prisma.note.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title: title,
                content: content,
                categoryId: categoryId,
                favourite: favourite,
                pinned: pinned,
                trash: trash
            }
        });
        // create noteEvent 
        const noteEvent = createNoteEvent(note, "updateNote");
        // format note
        note = await createNoteResponse(note);
        res.status(201).json(
            {message: 'Note updated successfully', note: note}
        );
        // Send event to Kafka
        //await sendEvent(noteEvent);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update note', message: err});
    }
}
//============================== CREATE NOTE =====================
const createNote = async (req, res) => {
    try{
        const { title, content, pinned, userId, favourite, category } = req.body;
        const reqNote = {
            title: title,
            favourite: favourite,
            content: content,
            userId: userId,
            pinned: pinned, 
            category: category
        }; 
        // check if req is valid 
        if (!ReqValid(reqNote)) {
            res.status(400).json({ error: 'content provided'});
        }

        // create the note
        let note = await pushNote(reqNote);
        // create noteEvent 
        const noteEvent = createNoteEvent(note, "createNote");
        // format note
        note = await createNoteResponse(note);
        res.status(201).json(
            {message: 'Note created successfully', note: note}
        );
        // Send event to Kafka
        //await sendEvent(noteEvent);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create note'});
    }
}
//==================================== GET NOTES ===============================
const getNotes = async (req, res) => {
    try{
        const userId = req.params.id;
        const notes = await getAllNotes(parseInt(userId));
        console.log(notes);
        res.status(200).json({message: "Successfully retrieved notes", notes: notes});
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Failed to retrive notes"});
    }
}
//============================== PIN NOTE =====================
const pinNote = async (req, res) => {
    try{
        const { noteId, pinned } = req.body;
        const note = await prisma.note.update({
            where: {
                id: noteId 
            },
            data: {
                pinned: !pinned
            }
        });
        updatedNote = await createNoteResponse(note);
        // format note
        let message = "";
        if (pinned){
            message = "Note Unpinned Succefully"
        }else {
            message = "Noted Pinned Succefully";
        }
        res.status(200).json({message: message, note: updatedNote});
        //kafka event activitity
        const noteEvent = createNoteEvent(note, "updatedNote");
        //await sendEvent(noteEvent);
    } catch(err) {
        res.status(500).json({error: "!!NOTE UPDATE FAILED!!"});
    }
}
//============================== ADD FAVOURITE NOTE =====================
const addFav = async (req, res) => {
    try{
        const { noteId, favourite } = req.body;
        const note = await prisma.note.update({
            where: {
                id: noteId 
            },
            data: {
                favourite: !favourite
            }
        });
        let updatedNote = await createNoteResponse(note);
        let message = "";
        if (favourite){
            message = "Note Removed From Favourites"
        }else {
            message = "Noted Added To Favourites";
        }
        res.status(200).json({message: message, note: updatedNote});
        const noteEvent = createNoteEvent(note, "addToFavourite");
        //await sendEvent(noteEvent);
    } catch(err) {
        res.status(500).json({error: "!!NOTE UPDATE FAILED!!"});
    }
}
//============================== DELETE NOTE =====================
const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) return res.status(400).json({ error: 'No id provided'});

        const note = await prisma.note.update({
            where: {
                id: parseInt(id)
            },
            data: {
                trash: true
            }
        });
        res.status(200).json({ message: 'Note deleted successfully', note: note});
        const noteEvent = createNoteEvent(note, "deleteNote");
        //await sendEvent(noteEvent);
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Failed to delete note"});
    }  
}
//============================== GET USER ACTIVITY =====================
const getActivities = async (req, res) => {
    try{
        const userId = req.params.id;
        const activities = await prisma.activityLog.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                id: 'desc'
            }
        });
        const formatedActivities = await formatActivities(activities);
        res.status(200).json({message: "Activities where retrieved successfully",activities: formatedActivities});
        
    }catch(err) { 
        res.status(500).json({error: "Failed to get user Activities"});
    }
}
 
//============================== GET CATEGORIES =====================
const getCategories = async (req, res) => {
    try {
        const userId = req.params.id;
        const notes = await prisma.note.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: {
                id: 'desc'
            }
        });
        const formatedCategory = await sortCategory(notes);
        res.status(200).json({message: "Categories Retrived Successfully",categories: formatedCategory});

    }catch (err) {
        res.status(500).json({error: "Failed to retrive Categories"});
    }
}
const getCateg = async (req, res) => {
    try {
        const category = await prisma.category.findMany({
            orderBy: {
                id: 'desc'
            }
        });
        const formatedCategory = category;
        res.status(200).json({message: "Categories Retrived Successfully",categories: formatedCategory});

    }catch (err) {
        res.status(500).json({error: "Failed to retrive Categories"});
    }
}
module.exports = {
    createNote,
    getNotes,
    deleteNote,
    pinNote,
    addFav,
    getActivities,
    getCategories ,
    getCateg,
    updateNotes,
    login,
    signup
}