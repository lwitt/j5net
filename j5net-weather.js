//const weather = require('./j5net-weather-yahoo.js');
const weatherplugin = require('./j5net-weather-wunderground.js');
const schedule = require('node-schedule');

var broker = null;
var dest_base = "";

module.exports = (app,config) => {

      broker = app.get('mqtt_broker');
      dest_base = app.get("mqtt_shared_base")+"weather/";

      const cbPublishWeather = function (city,code,temp,forecasts) {

            dest = dest_base+"current_temp";
            broker.publish(dest,temp.toString(),{qos:2,retain:true});

            dest = dest_base+"city";
            broker.publish(dest,city,{qos:2,retain:true});

            dest = dest_base+"current_code";
            broker.publish(dest,code.toString(),{qos:2,retain:true});

            // for (var i=1;i<6;i++) {
            //       dest = dest_base+"forecast"+i;
            //       broker.publish(dest,JSON.stringify(forecasts[i-1]),{qos:2,retain:true});
            // }

            dest = dest_base+"forecasts";
            broker.publish(dest,JSON.stringify(forecasts),{qos:2,retain:true});

            dest = dest_base+"last_update";
            broker.publish(dest,Date.now().toString(),{qos:2,retain:true});
      };

      var myweather = weatherplugin(cbPublishWeather,
                                    config.wunderground_home_country,
                                    config.wunderground_home_city,
                                    config.wunderground_obs_country,
                                    config.wunderground_obs_city,
                                    config.wunderground_key);

      var j = schedule.scheduleJob('0 * * * *', myweather.getData);
      myweather.getData();
}
