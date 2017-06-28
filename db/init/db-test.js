const config = require('../../config.js');
const db = require('../../db/');

const models = db.models;
const NodeModel = models["node"];
const NodeDataModel = models["nodedata"];
const NodeInfoModel = models["nodeinfo"];

// NodeDataModel.find(
//       {
//             "time"  : {"$gte": new Date("2017-06-26T22:00:00.000Z").toISOString(),"$lte" : new Date("2017-06-27T21:59:59.000Z").toISOString()},
//             "id"    : 10
//       })
//       .sort('time')
//       .exec(function(dberr,dbres) {
//             if (dberr) console.log("err"+dberr);
//             else {
//                   console.log("res="+dbres);
//             }
//       });



// AccountModel.aggregate([
//         { $match: {
//             _id: accountId
//         }},
//         { $unwind: "$records" },
//         { $group: {
//             _id: "$_id",
//             balance: { $sum: "$records.amount"  }
//         }}
//     ], function (err, result) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log(result);
//     });


console.log(new Date().getTimezoneOffset());

models.nodedata.aggregate(
      [
      {     $match:  {
                        time: {
                              $lte: new Date("2017-06-27 23:59:59"),
                              $gte: new Date("2017-06-27 00:00:00")
                              //  $lt: "2017-06-27T23:59:59.000Z"
                        },
                        id:   10
                        }
      },
      {     $group:   {
                  _id :     {     hour:     {$hour: "$time"}},
                  avg :     {     $avg :    "$data.t"}
            }
      },
      {
            $sort:     {
                  "_id.hour" :  1
            }
      }
      ],
      function (dberr,dbres) {
            if (dberr)
                  console.log("err"+dberr);
            else {
                  for (i in dbres) {
                        console.log(dbres[i]._id.hour-new Date().getTimezoneOffset()/60);
                        console.log(dbres[i].avg);
                  }
            }
            process.exit();
      });


// NodeInfoModel.remove(function(err){
//     if (!err) {
//         for (var i in nodes_db) {
//             console.log(i);
//             var n = new NodeInfoModel({
//                      id: i,
//                      name : nodes_db[i].name
//             });
//             n.save(err => {
//                 if(err)
//                     console.log("db error" + err);
//                 else
//                     console.log("node inserted!")
//             });
//         }
//     }
//     else
//         console.log ("unable to drop existing nodes");
// });
