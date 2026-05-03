const router = require('express').Router();
const {
    getCategories
} = require('../controllers/category.controller');

router.get('/get-categories', getCategories);

module.exports = router;