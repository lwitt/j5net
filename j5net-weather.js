//const weather = require('./j5net-weather-yahoo.js');
const weatherplugin = require('./j5net-weather-wunderground.js');
const CronJob = require('cron').CronJob;

var broker = null;
var dest_base = "";

module.exports = (app,config) => {

      broker = app.get('mqtt_broker');
      dest_base = app.get("config").mqtt_shared_base+"weather/";

      const cbPublishWeather = function (city,current,forecasts,astronomy) {

            dest = dest_base+"city";
            broker.publish(dest,city,{qos:2,retain:true});

            dest = dest_base+"current";
            broker.publish(dest,JSON.stringify(current),{qos:2,retain:true});

            dest = dest_base+"forecasts";
            broker.publish(dest,JSON.stringify(forecasts),{qos:2,retain:true});

            dest = dest_base+"last_update";
            broker.publish(dest,Date.now().toString(),{qos:2,retain:true});

            dest = dest_base+"astronomy";
            broker.publish(dest,JSON.stringify(astronomy),{qos:2,retain:true});
      };

      var myweather = weatherplugin(cbPublishWeather,
                                    config.wunderground_home_country,
                                    config.wunderground_home_city,
                                    config.wunderground_obs_country,
                                    config.wunderground_obs_city,
                                    config.wunderground_key);

      var j = new CronJob('0 0 * * * *', myweather.getData,null,true,'Europe/Paris');
      //myweather.getData();
}
