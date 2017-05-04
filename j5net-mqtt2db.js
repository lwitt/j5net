var nodes = {};
var nodeinfos = {};

var models = null;
var NodeModel = null;
var NodeDataModel = null;
var NodeInfoModel = null;



module.exports = (app) => {

    models = app.get('db');
    NodeModel = models.node;
    NodeDataModel = models.nodedata;
    NodeInfoModel = models.nodeinfo;

    NodeInfoModel.find({}, function (err,res){
        if (!err && res) {
            for (var i in res) {
                var obj = {name : res[i].name};
                nodeinfos[res[i].id] = obj;
            }
        }
    });

    var broker = app.get("mqtt_broker");

    broker.subscribe(app.get("mqtt_node_base")+"#");

    broker.on("message", function(topic,data) {

        if (topic.startsWith(app.get("mqtt_node_base"))) {
            var id = topic.split("/").pop();

            console.log((new Date().toLocaleTimeString() + " - [database] node=" + id + " " + data).yellow);

            NodeModel.findOne({id : id}, function (err, res){
                if (!err) {
                    // existing node
                    if (res) {
                        res.lastUpdate = new Date();
                        res.lastData = data;
                        res.save(function(err) {
                            if (err)
                            console.log(err);
                        });

                        // ugly object clone :(
                        var obj = JSON.parse(JSON.stringify(res));
                        delete obj._id;
                        delete obj.__v;
                        obj.lastData = JSON.parse(obj.lastData);
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
                        var n1 = new NodeModel({ id: id, lastData : data});
                        n1.save(function(err) {
                            if (err)
                            console.log(err);
                        });

                        // ugly object clone :(
                        var obj = JSON.parse(JSON.stringify(n1));
                        delete obj.id;
                        delete obj._id;
                        obj.lastData = JSON.parse(obj.lastData);
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

            var nodedata = new NodeDataModel({ id: id, data: data});

            nodedata.save(function (err, savednode) {
                if (err) console.error(err);
            });
        }


    });
};
