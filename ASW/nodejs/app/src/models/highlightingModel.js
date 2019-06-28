var mongoose = require('mongoose');
var GeoJSON = require('../lib/mongoose-geojson-schema/index.js');
var Schema = mongoose.Schema;

var HighlightingSchema = new Schema({
    user: {
        type: Schema.ObjectId,
	      required: 'User is required'
    },
    category: {
        type: String,
	      required: 'Category is required'
    },
    image: {
        type: String,
        required: 'Image is required'
    },
    desc: {
        type: String,
        required: 'Description is required'
    },
    location: {
        type: { type: String },
        coordinates: [Number],
    },
    status: {
        type: String,
        default: 'open'
    },
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    date: {
        type: Date,
        default: function() { return Date.now() }
    },        
});

HighlightingSchema.index( { "location": "2dsphere" } );

module.exports = mongoose.model('Highlightings', HighlightingSchema);
