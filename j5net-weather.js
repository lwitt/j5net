const weather = require('./j5net-weather-yahoo.js');
const schedule = require('node-schedule');

var broker = null;
var dest_base = "";

const cbPublishWeather = function (city,code,temp,forecast1,forecast2,forecast3,forecast4,forecast5) {

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

    dest = dest_base+"forecast1";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + forecast1 + " on " + dest);
    broker.publish(dest,forecast1,{qos:2});

    dest = dest_base+"forecast2";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + forecast2 + " on " + dest);
    broker.publish(dest,forecast2,{qos:2});

    dest = dest_base+"forecast3";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + forecast3 + " on " + dest);
    broker.publish(dest,forecast3,{qos:2});

    dest = dest_base+"forecast4";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + forecast4 + " on " + dest);
    broker.publish(dest,forecast4,{qos:2});

    dest = dest_base+"forecast5";
    console.log(new Date().toLocaleTimeString() + " - [mqtt] publishing " + forecast5 + " on " + dest);
    broker.publish(dest,forecast5,{qos:2});
};

module.exports = (app) => {
    broker = app.get('mqtt_broker');
    dest_base = app.get("mqtt_shared_base");

    var myweather = weather(cbPublishWeather);
    var j = schedule.scheduleJob('*/10 * * * *', myweather.getYahooWeather);
}
