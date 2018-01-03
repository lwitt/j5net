const mongoose = require('mongoose');

var nodeSchema = mongoose.Schema({
    id : {
        type:       String,
        required :  true,
        unique :    true,
        index : true
    },
    lastData : {
          t     :     {type:   Number},
          h     :     {type:   Number},
          w     :     {type:   Number},
          bat   :     {type:   Number},
          seq   :     {type:   Number, required : true}
    },
    lastUpdate : {
        type:       Date,
        required :  true,
        default:    Date.now
    }
    // firstSeen : {
    //     type:       Date,
    //     required :  true,
    //     default:    Date.now
    // }
});

var NodeModel = mongoose.model('Node', nodeSchema);

module.exports = NodeModel;
