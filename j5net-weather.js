//const weather = require('./j5net-weather-yahoo.js');
const weather = require('./j5net-weather-wunderground.js');
const schedule = require('node-schedule');

var broker = null;
var dest_base = "";

const cbPublishWeather = function (city,code,temp,forecasts) {

    // console.log(city,code,temp,forecast1,forecast2,forecast3,forecast4,forecast5);

    dest = dest_base+"current_temp";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + temp + "°C on " + dest);
    broker.publish(dest,temp.toString(),{qos:2});

    dest = dest_base+"city";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + city + " on " + dest);
    broker.publish(dest,city,{qos:2});

    dest = dest_base+"current_code";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + code + " on " + dest);
    broker.publish(dest,code.toString(),{qos:2});

    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing forecasts on " + dest + "[1-5]");
    for (var i=1;i<6;i++) {
          dest = dest_base+"forecast"+i;
          broker.publish(dest,JSON.stringify(forecasts[i-1]),{qos:2});
   }
};

module.exports = (app,config) => {
    broker = app.get('mqtt_broker');
    dest_base = app.get("mqtt_shared_base");

    var myweather = weather(cbPublishWeather,config.wunderground_country,config.wunderground_city,config.wunderground_key);
    // var j = schedule.scheduleJob('*/10 * * * *', myweather.getData);
    myweather.getData();

}
