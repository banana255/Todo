const todo = require('../model/todo')
/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

var all = {
    path: '/api/todo/all',
    method: 'get',
    func: function(req, res) {
        var todos = todo.all()
        console.log('request api/todo/all');
        var r = JSON.stringify(todos)
        res.send(r)
    }
}

var add = {
    path: '/api/todo/add',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/todo/add', form);
        var t = todo.new(form)
        var r = JSON.stringify(t)
        res.send(r)
    }
}

var dele = {
    path: '/api/todo/delete',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/todo/dele',form);
        var t = todo.dele(form)
        var r = JSON.stringify(t)
        res.send(r)
    }
}

var update = {
    path: '/api/todo/update',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/todo/update',form);
        var t = todo.update(form)
        var r = JSON.stringify(t)
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
