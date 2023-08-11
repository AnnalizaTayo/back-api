const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageViewSchema = new Schema({
    sessionId: String,
    pageViews: Number
},
{
    timestamps :true,
});

module.exports = mongoose.model('PageView', PageViewSchema);
