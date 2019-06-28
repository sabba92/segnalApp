var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    highlighting: {
        type: Schema.ObjectId,
        required: 'Highlighting is required'
    },
    user: {
        type: Schema.ObjectId,
	      required: 'User is required'
    },
    points: {
        type: Number,
	      required: 'Points are required'
    },
    comment: {
        type: String,
        required: 'Image is required'
    },
    date: {
        type: Date,
        default: function() { return Date.now() }
    },        
});

module.exports = mongoose.model('Comments', CommentSchema);
