// routes/note_routes.js

module.exports = function(app, con) {
    app.get('/car/:uid/:useruid', function(req, res) {
        const uid = req.params.uid;
        const userUid = req.params.useruid;
        var sql = "SELECT * FROM car c, user u WHERE c.uuid = '" + uid + "' AND u.uuid = '" + userUid + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });

    app.post('/addstatcar/:uid/:useruid/:statuid', function(req, res) {
        var datetime = (new Date()).toISOString().substring(0, 10);

        tempsArray = req.body.temps;
        temps = JSON.parse(req.body.temps);

        const uid = req.params.uid;
        const userUid = req.params.useruid;
        const statUid = req.params.statuid;

        var sqlIdCar = "SELECT c.id, s.* FROM car c, user u, stat s WHERE c.uuid = '" + uid + "' AND u.uuid = '" + userUid + "' AND s.uuid = '" + statUid + "'";
        con.query(sqlIdCar, function (errIdCar, carReq) {
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
                var sqlInsert = "INSERT INTO stat (id, car_id, date, uuid, value) VALUES (NULL, " + carReq[0].car_id + ", '" + datetime + "', '" + statUid + "', '" + concatSensor(1) + "')";

                con.query(sqlInsert, function (errInsert, resultInsert) {
                    if (errInsert) throw res.json({code:500,data:errInsert});
                    console.log("insert");
                    res.json({code:200});
                });
            }
        });
    });

    function concatSensor(test) {
        if (test == 1) {
            var sensors = "[";

            for (var variable in temps) {
                sensors += JSON.stringify(temps[variable]) + ",";
            }
            sensors = sensors.substring(0, sensors.length - 1);

            sensors += "]";
        }else {
            var sensors = ",";

            for (var variable in temps) {
                sensors += JSON.stringify(temps[variable]) + ",";
            }
            sensors = sensors.substring(0, sensors.length - 1);

            sensors += "]";
        }
        return sensors;
    }
};
