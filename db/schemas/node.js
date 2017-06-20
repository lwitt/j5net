const mongoose = require('mongoose');

var nodeSchema = mongoose.Schema({
    id : {
        type:       Number,
        required :  true,
        unique :    true,
        index : true
    },
    lastData : {
        type:       String,
    },
    lastUpdate : {
        type:       Date,
        required :  true,
        default:    Date.now
    },
    firstSeen : {
        type:       Date,
        required :  true,
        default:    Date.now
    }
});

var NodeModel = mongoose.model('Node', nodeSchema);

module.exports = NodeModel;
