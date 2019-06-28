var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    email: {
        type: String,
	      required: 'E-mail is required'
    },
    password: {
        type: String,
	      required: 'Password is required'
    },
    username: {
        type: String,
	      required: 'Username is required'
    },
    regDate: {
        type: Date,
        default: function() { return Date.now() }
    },
    lastUp: {
        type: Date,
        default: function() { return Date.now() }
    },
    comments: {
        type: Number,
        default: 10
    },
    highlightings: {
        type: Number,
        default: 2
    },
    banned: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', UserSchema);
