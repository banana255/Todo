const login = require('../model/login')

var find = {
    path: '/api/todo/login',
    method: 'post',
    func: function(req, res) {
        console.log('request api/todo/login', req.body);
        var isKey = login.findByKey(req.body)
        var r = JSON.stringify(isKey)
        res.send(r)
    }
}

var routes = [
    find,
]

// login.new({key:'234'})

module.exports = routes
