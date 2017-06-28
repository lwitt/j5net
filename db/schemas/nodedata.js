const mongoose = require('mongoose');

var nodeDataSchema = mongoose.Schema({
      id : {
            type:       Number,
            required :  true
      },
      data : {
            t     :     {type:   Number},
            h     :     {type:   Number},
            w     :     {type:   Number},
            bat   :     {type:   Number},
            seq   :     {type:   Number, required : true}
      },
      time : {
            type:       Date,
            required :  true,
            default:    Date.now
      }
});

var NodeDataModel = mongoose.model('NodeData', nodeDataSchema);

module.exports = NodeDataModel;
