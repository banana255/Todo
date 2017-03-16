const project = require('../model/project')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

var all = {
    path: '/api/project/all',
    method: 'post',
    func: function(req, res) {
        console.log('request api/project/all', req.body);
        var projects = project.all(req.body)
        var r = JSON.stringify(projects)
        res.send(r)
    }
}

var add = {
    path: '/api/project/add',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/project/add', form);
        var t = project.new(form)
        var r = JSON.stringify(t)
        res.send(r)
    }
}

var dele = {
    path: '/api/project/delete',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/project/dele',form);
        var t = project.dele(form)
        var r = JSON.stringify(t)
        res.send(r)
    }
}

var update = {
    path: '/api/project/update',
    method: 'post',
    func: function(req, res) {
        var form = req.body
        console.log('request api/project/update',form);
        var t = project.update(form)
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
