var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    highlighting: {
        type: Schema.ObjectId,
        required: 'Highlighting is required'
    },
    user: {
        type: Schema.ObjectId,
	      required: 'User is required'
    },
    date: {
        type: Date,
        default: function() { return Date.now() }
    },
});

module.exports = mongoose.model('Reports', ReportSchema);
