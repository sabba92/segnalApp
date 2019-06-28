var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LevelSchema = new Schema({
    _id: {
        type: Number,
	      required: 'Id is required'
    },
    min: {
        type: Number,
	      required: 'Min is required'
    },
    max: {
        type: Number,
	      required: 'Max is required'
    }
});

module.exports = mongoose.model('Levels', LevelSchema);
