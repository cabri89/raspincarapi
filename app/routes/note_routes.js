// routes/note_routes.js
module.exports = function(app, con) {
    app.post('/car/:uid/:useruid', (req, res) => {
        const uid = req.params.uid;
        const userUid = req.params.useruid;

        console.log(uid);
        console.log(userUid);
        console.log(req.body);

        res.send(req.body);
    });
};
