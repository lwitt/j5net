const mqtt = require('mqtt');
const colors = require('colors');


module.exports = (broker_url,client_id) => {

    const broker = mqtt.connect("mqtt://"+broker_url, {clientId : client_id});
    console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "] - [mqtt] connecting to " + broker_url + "..").magenta);

    broker.on('connect', () => {
        console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "] - [mqtt] connected to " + broker_url + " as " + client_id).magenta);
    });

    return broker;
}
