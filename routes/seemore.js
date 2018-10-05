const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
//const Widget = mongoose.model('Widget');
const Company = mongoose.model('Company');
const Util = require('../util/util');

const _btnTypeArr = ["All"];
const _sortTypeDict = {
    appDownloads: "Descending Number of Application Downloads",
    appAlpbAsc: "Descending Alphabetical Order"
};
const _colArr = ["All"];
const _catArr = ["All"];
const displayPerPage = 1001;

router.post('/', function (req, res, next) {
    if (!Util.isPositiveInteger(req.body.page) && req.body.page) {
        return next(new Error('Page is not a positive integer'));
    } else {
        let findObj = {};
        if (req.body.btnType === 'All') {
            findObj = {};
        } else {
            findObj.widget_class = new RegExp(req.body.btnType + '\\d?');
            // findObj.widget_class = req.body.btnType;
        }
        if (req.body.color !== 'All') {
            findObj.color = req.body.color;
        }
        if (req.body.category !== 'All') {
            findObj.category = req.body.category;
        }
        if (req.body.text !== '') {
            findObj.text = new RegExp(req.body.text);
        }
        // Checking and parsing of width and height
        let _widthArr = req.body.width.split(';').slice(0, 2);
        if (_widthArr.every(function (value) {
            return (value >= 0 && value <= 800);
        })) {
            findObj['dimensions.width'] = {"$gte": _widthArr[0], "$lte": _widthArr[1]};
        } else {
            return next(new Error('Invalid width.'));
        }
        let _heightArr = req.body.height.split(';').slice(0, 2);
        if (_heightArr.every(function (value) {
            return (value >= 0 && value <= 1280);
        })) {
            findObj['dimensions.height'] = {"$gte": _heightArr[0], "$lte": _heightArr[1]};
        } else {
            return next(new Error('Invalid height.'));
        }

        switch (req.body.sortType) {
            case 'appDownloads':
                _sortType = {
                    downloads: -1,
                    color: 1
                };
                break;
            case 'appAlpbAsc':
                _sortType = {
                    application_name: 1,
                    color: 1
                };
                break;
            default:
                break
        }

        Company.find(findObj)
            .sort(_sortType)
            .skip((req.body.page - 1) * displayPerPage)
            .limit(displayPerPage)
            .exec(function (err, doc) {
                if (err) {
                    return next(err);
                }
                res.json(doc);
            });
    }
});

/* GET seemore pageff */
router.get('/', function (req, res, next) {
    res.render('seemore', {
        title: 'Mobile UI Gallery - Seemore for widgets',
        url: req.originalUrl,
        btnTypeArr: _btnTypeArr,
        sortTypeDict: _sortTypeDict,
        colArr: _colArr,
        catArr: _catArr,
        query: req.query,
    });
});

module.exports = router;