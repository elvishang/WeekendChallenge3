var express = require('express');
var pg = require('pg');
var pool = require('../modules/pool.js');

var router = express.Router();


//Get data from db
router.get('/', function (req, res) {
    pool.connect(function (errorConnectingToDB, db, done) {
        if (errorConnectingToDB) {
            console.log('error connecting to db', errorConnectingToDB);
            res.sendStatus(500);
        } else {
            var queryText = 'SELECT * FROM todolist ORDER BY "status" DESC, "duedate" DESC';
            db.query(queryText, function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('error making query', errorMakingQuery, result)
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

router.post('/', function (req, res) {
    var task = req.body;
    console.log(task);

    pool.connect(function (errorConnectingToDB, db, done) {
        if (errorConnectingToDB) {
            console.log('error connecting to db', errorConnectingToDB);
            res.sendStatus(500);
        } else {
            var queryText = 'INSERT INTO "todolist" ("tasks", "priority", "startdate", "duedate", "status") VALUES ($1 , $2, $3, $4, $5)RETURNING id;';
            db.query(queryText, [task.tasks, task.priority, task.startdate, task.duedate, task.status], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('error making query', errorMakingQuery, result);
                    res.sendStatus(500);
                } else {
                    // return the new inserted id
                    res.send(result.rows[0].id + '');
                }
            });
        }
    });
});

//Updates tasks route
router.put('/:id', function (req, res) {
    var taskId = req.params.id;
    var task = req.body;
    console.log(task);
    console.log('task edit test', taskId, task);
    pool.connect(function (errorConnectingToDB, db, done) {
        if (errorConnectingToDB) {
            console.log('error connecting to db', errorConnectingToDB);
            res.sendStatus(500);
        } else {
            var queryText = 'UPDATE "todolist" SET "tasks" = $1, "priority" = $2, "startdate" = $3, "duedate" = $4, "status" = $5 WHERE "id" = $6;';
            db.query(queryText, [task.tasks, task.priority, task.startdate, task.duedate, task.status, taskId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('error making query', errorMakingQuery, result);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});

//Get from ids to select
router.get('/:id', function (req, res) {
    var taskId = req.params.id;
    console.log('GETting task #' + taskId);
    pool.connect(function (errorConnectingToDB, db, done) {
        if (errorConnectingToDB) {
            console.log('error connecting to db', errorConnectingToDB);
            res.sendStatus(500);
        } else {
            var queryText = 'SELECT * FROM "todolist" WHERE "id" = $1';
            db.query(queryText, [taskId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('error making query', errorMakingQuery, result)
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

//Delete ids of tasks
router.delete('/:id', function (req, res) {
    var taskId = req.params.id;
    pool.connect(function (errorConnectingToDB, db, done) {
        if (errorConnectingToDB) {
            console.log('error connecting to db', errorConnectingToDB);
            res.sendStatus(500);
        } else {
            var queryText = 'DELETE FROM "todolist" WHERE "id" = $1';
            db.query(queryText, [taskId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('error making query', errorMakingQuery, result)
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});


module.exports = router;