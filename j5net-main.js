var models = null;

var nodes = {};
var nodeinfos = {};

var lat = NaN,
lng = NaN,
lastCarUpdate = NaN,
distanceFromWork = NaN,
distanceFromHome = NaN,
weather = {};


module.exports = (http,app) => {

      models = app.get('db').models;
      var config = app.get('config');

      var broker = app.get("mqtt_broker");
      broker.subscribe(app.get("config").mqtt_shared_base+"car_position/#");
      broker.subscribe(app.get("config").mqtt_shared_base+"weather/#");

      broker.on("message", function(topic,data) {
            if (topic.startsWith(app.get("config").mqtt_shared_base+"car_position")) {

                  if (topic===app.get("config").mqtt_shared_base+"car_position/latitude")
                  lat = parseFloat(data);

                  if (topic===app.get("config").mqtt_shared_base+"car_position/longitude")
                  lng = parseFloat(data);

                  if (topic===app.get("config").mqtt_shared_base+"car_position/last_update") {
                        function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
                              var R = 6371; // Radius of the earth in km
                              var dLat = deg2rad(lat2-lat1);  // deg2rad below
                              var dLon = deg2rad(lon2-lon1);
                              var a =
                              Math.sin(dLat/2) * Math.sin(dLat/2) +
                              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                              Math.sin(dLon/2) * Math.sin(dLon/2)
                              ;
                              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                              var d = R * c; // Distance in km
                              return d;
                        }

                        function deg2rad(deg) {
                              return deg * (Math.PI/180)
                        }

                        distanceFromHome = getDistanceFromLatLonInKm (lat,lng,config.home_lat,config.home_lng);
                        distanceFromWork = getDistanceFromLatLonInKm (lat,lng,config.work_lat,config.work_lng);

                        lastCarUpdate = parseInt(data.toString());
                  }
            }

            if (topic.startsWith(app.get("config").mqtt_shared_base+"weather")) {

                  if (topic===app.get("config").mqtt_shared_base+"weather/city")
                  weather.city = data.toString();

                  if (topic===app.get("config").mqtt_shared_base+"weather/current")
                  weather.current = JSON.parse(data);

                  if (topic===app.get("config").mqtt_shared_base+"weather/forecasts")
                  weather.forecasts = JSON.parse(data);

                  if (topic===app.get("config").mqtt_shared_base+"weather/last_update")
                  weather.lastUpdate = Date(data);

                  if (topic===app.get("config").mqtt_shared_base+"weather/astronomy")
                  weather.astronomy = JSON.parse(data);
            }
      });


      //load dependencies
      require('./j5net-weather.js')(app,config);
      require('./j5net-mqtt2db.js')(app);


      console.log("                     __        ______        __     ".yellow);
      console.log("  __                /\\ \\__    /\\  ___\\     /'__`\\   ".yellow);
      console.log(" /\\_\\    ___      __\\ \\ ,_\\   \\ \\ \\__/    /\\ \\/\\ \\  ".yellow);
      console.log(" \\/\\ \\ /' _ `\\  /'__`\\ \\ \\/    \\ \\___``\\  \\ \\ \\ \\ \\ ".yellow);
      console.log("  \\ \\ \\/\\ \\/\\ \\/\\  __/\\ \\ \\_    \\/\\ \\_\\ \\__\\ \\ \\_\\ \\".yellow);
      console.log("  _\\ \\ \\ \\_\\ \\_\\ \\____\\\\ \\__\\    \\ \\____/\\_\\\\ \\____/".yellow);
      console.log(" /\\ \\_\\ \\/_/\\/_/\\/____/ \\/__/     \\/___/\\/_/ \\/___/ ".yellow);
      console.log(" \\ \\____/                                           ".yellow);
      console.log("  \\/___/                                            ".yellow);


      var io = require('socket.io')(http);

      io.on('connection', function (socket) {
            console.log(('['+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [websocket] new connection').cyan);
            socket.on('node-detail', function (data) {
                  //console.log("frontend asked for details");

                  var startDate = new Date(data.start);
                  startDate.setHours(startDate.getHours()-(new Date().getTimezoneOffset()/60));

                  var endDate = new Date(data.end);
                  endDate.setHours(endDate.getHours()-(new Date().getTimezoneOffset()/60));

                  models.nodedata.aggregate(
                        [
                        {     $match:  {
                                          time: {
                                                $lte: endDate,
                                                $gte: startDate
                                                //  $lt: "2017-06-27T23:59:59.000Z"
                                          },
                                          id:   parseInt(data.id)
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

                              if (!dberr && dbres) {
                                    var res = {}, tmin, tmax;
                                    res.data = {};

                                    if (dbres[0]) {
                                          tmin = dbres[0].avg;
                                          tmax = dbres[0].avg;
                                    }

                                    for (i in dbres) {
                                          res.data[dbres[i]._id.hour-new Date().getTimezoneOffset()/60] = dbres[i].avg;

                                          if (dbres[i] && dbres[i].avg) {
                                                if (dbres[i].avg>tmax) tmax = dbres[i].avg;
                                                if (dbres[i].avg<tmin) tmin = dbres[i].avg;
                                          }
                                    }

                                    res["tmin"] = Math.round(tmin*100)/100;
                                    res["tmax"] = Math.round(tmax*100)/100;

                                    console.log(("[" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - sending node details').cyan);
                                    socket.emit('node-detail',res);
                              }
                        }
                  );


                  // models.nodedata.find(
                  //       {
                  //             "time"  : {"$gte": new Date(data.start).toISOString(),"$lte" : new Date(data.end).toISOString()},
                  //             "id"    : data.id
                  //       }
                  // )
                  // .sort('time')
                  // .exec(
                  //       function (dberr,dbres){
                  //             if (!dberr && dbres) {
                  //
                  //                   var res = {}, tmin, tmax;
                  //
                  //                   if (dbres[0] && dbres[0].data) {
                  //                         tmin = JSON.parse(dbres[0].data).t;
                  //                         tmax = JSON.parse(dbres[0].data).t;
                  //                   }
                  //
                  //                   for (i in dbres) {
                  //                         res[dbres[i].time] = dbres[i].data;
                  //                         if (dbres[i] && dbres[i].data) {
                  //                               var tres = JSON.parse(dbres[i].data).t;
                  //                               if (tres>tmax) tmax = tres;
                  //                               if (tres<tmin) tmin = tres;
                  //                         }
                  //                   }
                  //
                  //                   res["tmin"] = tmin;
                  //                   res["tmax"] = tmax;
                  //
                  //                   console.log(("[" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - sending node details').cyan);
                  //                   // console.log("tmin="+tmin);
                  //                   // console.log("tmax="+tmax);
                  //                   socket.emit('node-detail',res);
                  //             }
                  //             else
                  //             console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - query error').red);
                  //       }
                  // );
            });


            /* web client asks for node list */

            socket.on('nodes', function (data) {
                  // initialization of nodes & nodeinfos based on database

                  models.node.find({}, function (err,res){
                        if (!err && res) {
                              for (var i in res) {
                                    // ugly object clone
                                    var obj = JSON.parse(JSON.stringify(res[i]));
                                    delete obj._id;
                                    delete obj.__v;
                                    obj.lastData = obj.lastData;
                                    // console.log(obj);
                                    if (nodeinfos[obj.id]) {
                                          obj.name = nodeinfos[obj.id].name;
                                    }
                                    else {
                                          obj.name = "unknown";
                                    }
                                    nodes[obj.id] = obj;
                                    delete nodes[obj.id].id;
                              }
                              socket.emit("nodes",nodes);
                        }
                  });
            });

            socket.on('car-position', function (data) {
                  socket.emit("car-position",{lat:lat,lng:lng, lastUpdate: lastCarUpdate, distanceFromWork: distanceFromWork, distanceFromHome:distanceFromHome});
                  // console.log((new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + ' - car position asked').cyan);
            });

            socket.on('weather', function (data) {
                  socket.emit("weather",weather);
                  // console.log((new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + ' - weather asked').cyan);
            });
      });


      // initialize naming of the nodes

      models.nodeinfo.find({}, function (err,res){
            if (!err && res) {
                  for (var i in res) {
                        var obj = {name : res[i].name};
                        nodeinfos[res[i].id] = obj;
                  }
            }
      });
}
