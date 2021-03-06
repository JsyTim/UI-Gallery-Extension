const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
//const Widget = mongoose.model('Widget');
const Company = mongoose.model('Company');
const Util = require('../util/util');

//const _developer = ["All","JimRoal", "Mobile2ds", "Yoshihiro Saotome",  "Malaysia Airlines", "Allied Irish Banks, Public Limited Company", "BIT LABS LLC", "Huckleberry Games", "GK Apps", "GK Soft",  "Android Antivirus", "Cobo Dev Team", "Tour Tracker LLC"];
const _btnTypeArr = ["All", "Button", "CheckBox", "Chronometer", "CompoundButton", "ImageButton", "ProgressBar", "RadioButton", "RatingBar", "SeekBar", "Spinner", "Switch", "ToggleButton"];
//"EditText", "View"
const _sortTypeDict = {
    appDownloads: "Descending Number of Application Downloads",
    appAlpbAsc: "Descending Alphabetical Order"
};
const _colArr = ["All", "Red", "Yellow", "Green", "Blue", "Cyan", "Black", "White", "Lime", "Magenta"];
const _catArr = ["All", "EDUCATION", "LIFESTYLE", "ENTERTAINMENT", "MUSIC_AND_AUDIO", "TOOLS", "PERSONALIZATION", "TRAVEL_AND_LOCAL", "NEWS_AND_MAGAZINES", "BOOKS_AND_REFERENCE", "BUSINESS", "FINANCE", "GAME_CASUAL", "SPORTS", "GAME_PUZZLE", "PRODUCTIVITY", "PHOTOGRAPHY", "HEALTH_AND_FITNESS", "TRANSPORTATION", "COMMUNICATION", "GAME_EDUCATIONAL", "SOCIAL", "MEDIA_AND_VIDEO", "SHOPPING", "GAME_ARCADE", "GAME_SIMULATION", "GAME_ACTION", "MEDICAL", "GAME_CARD", "WEATHER", "GAME_RACING", "GAME_BOARD", "GAME_SPORTS", "GAME_CASINO", "GAME_WORD", "GAME_TRIVIA", "GAME_ADVENTURE", "GAME_STRATEGY", "GAME_ROLE_PLAYING", "GAME_MUSIC", "LIBRARIES_AND_DEMO", "COMICS"];
const displayPerPage = 1001; 

/* GET compare pageff */
router.get('/', function (req, res, next) {
    res.render('compare', {
        title: 'MobDile UI Gallery - Compare',
        url: req.originalUrl,
        //developer:_developer,
        btnTypeArr: _btnTypeArr,
        sortTypeDict: _sortTypeDict,
        colArr: _colArr,
        catArr: _catArr,
        query: req.query,
    });
});

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
        if (req.body.developer !== 'All') {
            findObj.developer = req.body.developer;
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
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('compare', {title: 'Mobile UI Gallery - Compare'});
});

module.exports = router;
