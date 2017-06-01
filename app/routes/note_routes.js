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

    app.post('/addstatcar/:uid/:useruid', function(req, res) {
        var datetime = (new Date()).toISOString().substring(0, 10);
        console.log(req.body.temps);
        console.log('{' + req.body.temps + '}');
        temps = JSON.parse('{' + req.body.temps + '}');

        for (var temp in temps) {
            console.log(temps[temp]);
        }

        const uid = req.params.uid;
        const userUid = req.params.useruid;

        var sqlIdCar = "SELECT c.id FROM car c, user u WHERE c.uuid = '" + uid + "' AND u.uuid = '" + userUid + "'";
        con.query(sqlIdCar, function (errIdCar, car) {
            if (errIdCar) throw errIdCar;
            var sqlCheckStat = "SELECT * FROM stat WHERE car_id = " + car[0].id + " AND date = '" + datetime + "' GROUP BY id";
            con.query(sqlCheckStat, function (errCheckStat, stat) {
                stat = stat[0];
                if (errCheckStat) throw errCheckStat;
                    if (stat) {
                        var sqlUpdateStat = "UPDATE stat SET localisation = '" + stat.localisation + req.body.stat + "' WHERE id = " + stat.id;
                        con.query(sqlUpdateStat, function (errUpdate, update) {
                            if (errUpdate) throw errUpdate;
                            console.log("update");
                        });
                    }else {
                        var sqlInsert = "INSERT INTO stat (id, car_id, date, localisation, consommation, temperature) VALUES (NULL, " + car[0].id + ", '" + datetime + "', '" + req.body.stat + "', '" + req.body.stat + "', '" + req.body.stat + "')";

                        con.query(sqlInsert, function (errInsert, resultInsert) {
                            if (errInsert) throw errInsert;
                            console.log("insert");
                        });
                    }
            });


        });

    });
};
