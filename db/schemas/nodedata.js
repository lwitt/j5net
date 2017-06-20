const mongoose = require('mongoose');

var nodeDataSchema = mongoose.Schema({
    id : {
        type:       Number,
        required :  true
    },
    data : {
        type:       String,
        required :  true
    },
    time : {
        type:       Date,
        required :  true,
        default:    Date.now
    }
});

var NodeDataModel = mongoose.model('NodeData', nodeDataSchema);

module.exports = NodeDataModel;
