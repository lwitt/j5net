//const weather = require('./j5net-weather-yahoo.js');
const weatherplugin = require('./j5net-weather-wunderground.js');
const CronJob = require('cron').CronJob;
const https = require('https');


var broker = null;
var dest_base = "";

module.exports = (app,config) => {

      broker = app.get('mqtt_broker');
      weather_dest_base = app.get("config").mqtt_shared_base+"weather/";
      // utctime_dest_base = app.get("config").mqtt_shared_base+"utctime";

      const cbPublishWeather = function (city,current,forecasts,astronomy) {

            dest = weather_dest_base+"city";
            broker.publish(dest,city,{qos:2,retain:true});

            dest = weather_dest_base+"current";
            broker.publish(dest,JSON.stringify(current),{qos:2,retain:true});

            dest = weather_dest_base+"forecasts";
            broker.publish(dest,JSON.stringify(forecasts),{qos:2,retain:true});

            dest = weather_dest_base+"last_update";
            broker.publish(dest,Math.floor(Date.now()/1000).toString(),{qos:2,retain:true});

            dest = weather_dest_base+"astronomy";
            broker.publish(dest,JSON.stringify(astronomy),{qos:2,retain:true});
      };

      var myweather = weatherplugin(cbPublishWeather,
                                    config.wunderground_home_country,
                                    config.wunderground_home_city,
                                    config.wunderground_obs_country,
                                    config.wunderground_obs_city,
                                    config.wunderground_key);

      // var publishUTCTime = function() {
      //       broker.publish(utctime_dest_base,Math.floor(Date.now()/1000-new Date().getTimezoneOffset()*60).toString(),{qos:2,retain:false});
      // };

//       var getTrafic = function() {
//             console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [trafic] getting trafic from Google Maps Directions').white);
//             var URL =   "https://maps.googleapis.com/maps/api/directions/json" +
//                         "?origin=place_id:ChIJIzZLUzGQkUcR_GWyDDkkSQ4" +
//                         "&destination=place_id:ChIJZfy0R9WEkUcRH4oBdcHhoBw" +
//                         "&waypoints=via:place_id:ChIJwUc76KmakUcRjuEnp1klER4" +
//                         "&key=AIzaSyC5-mTXh_p0umfRxLsp9oa63tK62xRRVyg";
//
//             console.log(URL);
//
// // https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJZfy0R9WEkUcRH4oBdcHhoBw&destination=place_id:ChIJIzZLUzGQkUcR_GWyDDkkSQ4&waypoints=via:place_id:ChIJwUc76KmakUcRjuEnp1klER4&key=AIzaSyC5-mTXh_p0umfRxLsp9oa63tK62xRRVyg
//
//             var jsondata = "";
//
//             https.get(URL,function (res) {
//                   if (res.statusCode==200) {
//                         res.on('data', function (chunk) {
//                               jsondata+=chunk;
//                         });
//
//                         res.on('end', function() {
//                               // console.log(jsondata);
//                               var j = JSON.parse(jsondata);
//
//                               if (j && j.status=="OK" && j.routes) {
//                                     console.log(j.routes[0].legs[0].distance);
//                                     console.log(j.routes[0].legs[0].duration);
//                                     console.log(j.routes[0].summary);
//                               }
//                         });
//                   }
//             });
//       };

      //var j1 = new CronJob('0 0 * * * *', myweather.getData,null,true,'Europe/Paris');
      //var j2 = new CronJob('0 * * * * *', publishUTCTime,null,true,'Europe/Paris');
      //var j3 = new CronJob('0 */5 * * * *', getTrafic,null,true,'Europe/Paris',null,true);
      //myweather.getData();
      //publishUTCTime();
}
