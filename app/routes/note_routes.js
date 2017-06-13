// routes/note_routes.js

module.exports = function(app, con) {
    app.post('/addstatcar/:uid/:useruid/:statuid', function(req, res) {
        var datetime = (new Date()).toISOString().substring(0, 10);

        try {
          sensorsObject = JSON.parse(req.body.sensors);
        }
        catch (e) {
            // console.log(e);
        }

        if (sensorsObject != undefined) {
            const uid = req.params.uid;
            const userUid = req.params.useruid;
            const statUid = req.params.statuid;

            var sqlIdCar = "SELECT c.id, s.* FROM car c, user u, stat s WHERE c.uuid = '" + uid + "' AND u.uuid = '" + userUid + "' AND s.uuid = '" + statUid + "'";
            con.query(sqlIdCar, function (errIdCar, carReq) {
                console.log("select");
                if (errIdCar) throw res.json({code:500,data:errIdCar});
                if (carReq[0]) {
                    var stat = {};
                    stat.id = carReq[0].id;
                    stat.value = carReq[0].value;
                    stat.value = stat.value.substring(0, stat.value.length - 1);
                    sensorsSend = stat.value + concatSensor(0);

                    var sqlUpdateStat = "UPDATE stat SET value = '" + sensorsSend + "' WHERE id = " + stat.id;
                    con.query(sqlUpdateStat, function (errUpdate, update) {
                        if (errUpdate) throw res.json({code:500,data:errUpdate});
                        console.log("update");
                        res.json({code:200});
                    });
                }else {
                    var sqlGetCar = "SELECT c.id FROM car c, user u WHERE c.uuid = '" + uid + "' AND u.uuid = '" + userUid + "'";
                    con.query(sqlGetCar, function (errGetCar, car) {
                        console.log("select");
                        if (errGetCar) throw res.json({code:500,data:errGetCar});

                        if (car != undefined) {
                            var sqlInsert = "INSERT INTO stat (id, car_id, date, uuid, value) VALUES (NULL, '" + car[0].id + "', '" + datetime + "', '" + statUid + "', '" + concatSensor(1) + "')";
                            con.query(sqlInsert, function (errInsert, resultInsert) {
                                if (errInsert) throw res.json({code:500,data:errInsert});
                                console.log("insert");
                                res.json({code:200});
                            });
                        }else {
                            res.json({code:204});
                        }
                    });
                }
            });
        }
    });

    function concatSensor(test) {
        if (test == 1) {
            var sensors = "[";

            for (var variable in sensorsObject) {
                sensors += JSON.stringify(sensorsObject[variable]) + ",";
            }
            sensors = sensors.substring(0, sensors.length - 1);

            sensors += "]";
        }else {
            var sensors = ",";

            for (var variable in sensorsObject) {
                sensors += JSON.stringify(sensorsObject[variable]) + ",";
            }
            sensors = sensors.substring(0, sensors.length - 1);

            sensors += "]";
        }
        return sensors;
    }
};
