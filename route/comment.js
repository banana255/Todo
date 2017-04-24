const comment = require('../model/comment')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

var all = {
    path: '/api/comment/all',
    method: 'post',
    func: function(req, res) {
        console.log('request api/comment/all', req.body);
        var comments = comment.all(req.body)
        var r = JSON.stringify(comments)
        res.send(r)
    }
}

var add = {
    path: '/api/comment/add',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/comment/add', form);
        var c = comment.new(form)
        var r = JSON.stringify(c)
        res.send(r)
    }
}

var dele = {
    path: '/api/comment/delete',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/comment/dele',form);
        var c = comment.dele(form)
        var r = JSON.stringify(c)
        res.send(r)
    }
}

var update = {
    path: '/api/comment/update',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/comment/update',form);
        var c = comment.update(form)
        var r = JSON.stringify(c)
        res.send(r)
    }
}

var routes = [
    all,
    add,
    dele,
    update,
]

module.exports = routes
