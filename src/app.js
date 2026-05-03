require('dotenv').config();

const express = require('express');
const cors = require('cors');
// import routes
const noteRoutes = require('./routes/note.routes');
const categoryRoutes = require('./routes/category.routes');
// create an Express application 
const app = express();


// Middleware to parse Json bodies in requests and use note routes for handling api requests to /api endpoint 
app.use(express.json());
app.use(cors());
app.use('/api', noteRoutes);
app.use('/api', categoryRoutes);
app.use('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy'});
});

module.exports = {
    app
}