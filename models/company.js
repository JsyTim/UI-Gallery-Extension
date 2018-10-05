const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {type: String, required: true, max: 100},
    color: {type: String, max: 50},
    coordinates: {
        from: [Number],
        to: [Number]
    },
    dimensions: {
        height: Number,
        width: Number
    },
    package_name: {type: String, required: true, max: 100},
    text: {type: String, max: 200},
    category: {type: String, max: 50},
    widget_class: {type: String, required: true},
    
    application_name: {type: String, required: true, max: 100},
    downloads: String,
    url: String,
    src: {type: String, required: true},
    
},{ collection: "companys" });//指定需要操作的collections，如果不指定，其默认搜寻默认表？则将会得到空数组



module.exports = mongoose.model('Company', companySchema);
