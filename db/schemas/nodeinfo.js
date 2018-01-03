const mongoose = require('mongoose');

var nodeInfoSchema = mongoose.Schema({
    id : {
        type:       String,
        required :  true,
        unique :    true,
        index : true
    },
    name : {
        type:       String,
        required :  true,
    }
});

var NodeInfoModel = mongoose.model('NodeInfo', nodeInfoSchema);

module.exports = NodeInfoModel;
