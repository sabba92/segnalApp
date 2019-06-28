var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CategorySchema = new Schema({
    name: {
        type: String,
	      required: 'E-mail is required'
    },
    desc: {
        type: String,
	      required: 'Description is required'
    },
    _id: {
        type: String,
	      required: 'Id is required'
    }
});

module.exports = mongoose.model('Categories', CategorySchema);
