var nodes = {};
var nodeinfos = {};

var models = null;

module.exports = (app) => {

    models = app.get('db').models;

    models.nodeinfo.find({}, function (err,res){
        if (!err && res) {
            for (var i in res) {
                var obj = {name : res[i].name};
                nodeinfos[res[i].id] = obj;
            }
        }
    });

    var broker = app.get("mqtt_broker");

    broker.subscribe(app.get("config").mqtt_node_base+"#");

    broker.on("message", function(topic,data) {

        if (topic.startsWith(app.get("config").mqtt_node_base)) {
            var id = topic.split("/").pop();

            console.log((new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + " - [database] node=" + id + " " + data).yellow);

            models.node.findOne({id : id}, function (err, res){
                if (!err) {
                    // existing node
                    if (res) {
                        res.lastUpdate = new Date();
                        res.lastData = JSON.parse(data);
                        res.save(function(err) {
                            if (err)
                            console.log(err);
                        });

                        // ugly object clone :(
                        var obj = JSON.parse(JSON.stringify(res));
                        delete obj._id;
                        delete obj.__v;
                        if (nodeinfos[id]) {
                            obj.name = nodeinfos[id].name;
                        }
                        else {
                            obj.name = "unknown";
                        }
                        nodes[id] = obj;
                    }
                    else {
                        // node to be created
                        var n1 = new models.node({ id: id, lastData : JSON.parse(data)});
                        n1.save(function(err) {
                            if (err)
                            console.log(err);
                        });

                        // TODO ugly object clone :(
                        var obj = JSON.parse(JSON.stringify(n1));
                        delete obj.id;
                        delete obj._id;
                        if (nodeinfos[id]) {
                            obj.name = nodeinfos[id].name;
                        }
                        else {
                            obj.name = "unknown";
                        }
                        nodes[id] = obj;
                    }
                }
                else {
                    console.log("error : " + err);
                }
            });

            var nodedata = new models.nodedata({ id: id, data: JSON.parse(data)});

            nodedata.save(function (err, savednode) {
                if (err) console.error(err);
            });
        }


    });
};
