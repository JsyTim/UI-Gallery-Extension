const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('about', {title: 'Mobile UI Gallery - About'});
});

module.exports = router;
