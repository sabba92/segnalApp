var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Category = mongoose.model('Categories');
var Level = mongoose.model('Levels');
var Highlighting = mongoose.model('Highlightings');
var Comment = mongoose.model('Comments');
var Report = mongoose.model('Reports');
var ObjectId = mongoose.Types.ObjectId;

function insertLevels() {
    var f = require('../lib/functions.js')
    for (var i = 1; i <= 20; i++)
    {
        var newLevel = new Level( f.levelToPoint(i) );
        newLevel.save(function(err, level) {
            if(err)
                console.log(err);
            else
                console.log(level);
        });
    }
}

exports.getIndex = function(req, res) {
    //insertLevels();
    res.sendFile(appRoot + "/www/index.html");
};

exports.login = function(req, res) {
    User.findOne( { email: req.body.email }, { __v: 0, email: 0 }, function(err, user) {
        if(err)
            res.send(err);
        else if(user == null)
            res.send( { code: 1, message: "E-mail non registrata" } );
        else if(user.password != req.body.password)
            res.send( { code: 2, message: "Password errata" } );
        else if(user.banned == true)
            res.send( {code: 4, message: "Utente bannato" } );
        else
            res.send( { code: 3, message: user } );
    });
};

exports.register = function(req, res) {
    User.find( { email: req.body.email }, { _id: 1 }, function(err, user) {
        if(err)
            res.send(err);
        else if(user.length != 0)
            res.send( { code: 1, message: "E-mail già registrata" } );
        else
            User.find( { username: req.body.username }, { _id: 1 }, function(err, user) {
                if(err)
                    res.send(err);
                else if(user.length != 0)
                    res.send( { code: 2, message: "Username già in uso" } );
                else
                {
                    var newUser = new User(req.body);
                    newUser.save(function(err, user) {
                        if(err)
                            res.send(err);
                        res.send( { code: 3, message: req.body.username } );
                    });
                }
            });
    });
};

exports.getCategories = function(req, res) {
    Category.find( { }, function(err, cats) {
        if(err)
            res.send(err);
        else
            res.json(cats);
    });
};

exports.categoryById = function(req, res) {
    Category.findById(req.body.id, { name: 1 }, function(err, cat) {
        if(err)
            res.send(err);
        else
            res.json(cat);
    });
};

exports.upload = function(req, res) {
    Highlighting.aggregate( [
          { $geoNear: { limit: 1, maxDistance: 500,
                        query: { category: req.body.category },
                        near: req.body.location,
                        distanceField: "dist" } } ], function(err, r) {
        if(err)
            res.send(err);
        else if (r.length != 0)
            res.send( { code: 1, id: r[0]._id } );
        else {
            var newH = new Highlighting( req.body );
            newH.save(function(err, h) {
                if(err)
                    res.send(err);
                else
                {
                    User.updateOne( { _id: req.body.user }, { $inc : { highlightings: -1 } }, function(err, r) {
                        if(err)
                            res.send(err);
                        else
                            res.send( { code: "OK" } );
                    });
                }
            });
        }
    });
};

exports.comment = function(req, res) {
    var newC = new Comment( req.body );
    newC.save(function(err, h) {
        if(err)
            res.send(err);
        else
        {
            User.updateOne( { _id: req.body.user }, { $inc : { comments: -req.body.points } }, function(err, r) {
                if(err)
                    res.send(err);
                else
                    res.send( { message: "OK" } );
            });
        }
    });
};

exports.report = function(req, res) {
    var newR = new Report( req.body );
    newR.save(function(err, h) {
        if(err)
            res.send(err);
        else
        {
            Highlighting.updateOne( { _id: req.body.highlighting }, { $set : { status: "signaled" } }, function(err, r) {
                if(err)
                    res.send(err);
                else
                    res.send( { message: "OK" } );
            });
        }
    });
};

exports.getPoints = function(req, res) {
    var points = 0;
    var completed = 0;
    var rep = 0;
    Highlighting.find( { user: ObjectId(req.body.user) }, { _id: 1, status: 1 }, function (err, r) {
        if(err)
            res.send(err);
        else if(r.length > 0)
        {
            var hList = [];
            r.forEach(function (obj) {
                points += 3;
                if (obj.status == "closed")
                {
                    completed++;
                    points += 10;
                    rep += 20;
                }
                hList.push(ObjectId(obj._id));
            });
            Comment.aggregate( [ { $match: { highlighting: { $in: hList }, points: { $gt: 0 } } }, { $group: { _id: null, sum: { $sum: "$points" }, count: { $sum: 1} } } ], function(err, r) {
                if(r.length != 0)
                {
                    points += (5 * r[0].count);
                    rep += r[0].sum;
                }
                Comment.countDocuments( { user: ObjectId(req.body.user) }, function(err, c) {
                    points += c;
                    res.send( { points: points, completed: completed, rep: rep } );
                });
            });
        }
        else {
            res.send( { points: points, completed: completed, rep: rep } );
        }
    });
};

exports.levelPoints = function(req, res) {
    var p = req.body.points;
    Level.find( { min: { $lte: p }, max: { $gte: p } }, { __v: 0 }, function(err, l) {
        if(err)
            res.send(err);
        else
            res.json(l[0]);
    });
};

exports.getHighlightings = function(req, res) {
    Highlighting.find( { }, function(err, h) {
        if(err)
            res.send(err);
        else
            res.json(h);
    });
};

exports.getHighlightingInfo = function(req, res) {
    Highlighting.findById(ObjectId(req.body.id), function(err, h) {
        if(err)
            res.send(err);
        else
            res.send( { h: h } );
    });
};

exports.getHighlighting = function(req, res) {
    Highlighting.findById(req.body.id, function(err, h) {
        if(err)
            res.send(err);
        else
            Comment.find( { highlighting: ObjectId(h._id) }, function(err, comm) {
                Report.find( { highlighting: ObjectId(h._id) }, function(err, reps) {
                    res.send( { h: h, comments: comm, reports: reps } );
                });
            });
    });
};

exports.getReports = function(req, res) {
    Report.aggregate( [ { $group: { _id: "$highlighting", count: { $sum: 1 } } },
                        { $lookup: { from: "highlightings", localField: "_id", foreignField: "_id", as: "details" } },
                        { $unwind: "$details" },
                        { $match: { "details.status": "signaled" } }
                      ], function(err, r) {
        if(err)
            res.send(err);
        else {
            Highlighting.find( { status: "open" }, function(err, l) {
                res.send( { r: r, l: l } );
            });
        }
    });
};

exports.ban = function(req, res) {
    Highlighting.updateOne( { _id: req.body.highlighting }, { $set: { status: "banned" } }, function(err, q) {
        if(err)
            res.send(err);
        else
            User.updateOne( { _id: ObjectId(req.body.user) }, { $set: { banned: true } }, function(err, q) {
                if(err)
                    res.send(err);
                else
                    res.send( { message: "OK" } );
            });
    });
};

exports.close = function(req, res) {
    Highlighting.updateOne( { _id: req.body.highlighting }, { $set: { status: "closed" } }, function(err, q) {
        if(err)
            res.send(err);
        else
            res.send( { message: "OK" } );
    });
};

exports.userUploads = function(req, res) {
    Highlighting.find( { user: ObjectId(req.body.user) }, null, { sort: { date : -1 } }, function(err, h) {
        if(err)
            res.send(err);
        else
            Comment.aggregate( [
                            { $match: { user: ObjectId(req.body.user) } },
                            { $lookup: { from: "highlightings", localField: "highlighting", foreignField: "_id", as: "details" } },
                            { $sort: { date: -1} }
                          ], function(err, c) {
                if(err)
                    res.send(err);
                else
                    Report.aggregate( [
                                    { $match: { user: ObjectId(req.body.user) } },
                                    { $lookup: { from: "highlightings", localField: "highlighting", foreignField: "_id", as: "details" } },
                                    { $sort: { date: -1} }
                                  ], function(err, r) {

                        res.send( { h: h, c: c, r: r } );
                    });
            });
    });
};

exports.findComment = function(req, res) {
    Comment.countDocuments(req.body, function(err, count) {
        if (count == 0)
            Report.countDocuments(req.body, function(err, count) {
                res.send( { count: count } );
            });
        else
            res.send( { count: count } );
    });
};

exports.updateUser = function(req, res) {
    User.findById(req.body.user, function(err, user) {
        if (err)
            res.send(err);
        else
        {
            var diff = new Date() - new Date(user.lastUp);
            var level = req.body.level;
            if (diff > 1000 * 60 * 60 * 24)
                User.updateOne( { _id: user._id }, { $set:
                                { comments: level * 10, highlightings: level * 2, lastUp: new Date() } },
                                  function(err, r) {
                    User.findById(user._id, function(err, user) {
                        res.send( { user: user } );
                    });
                });
            else
                res.send( { user: user } );
        }
    });
};
