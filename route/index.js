var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    var path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        console.log(`读取的 html 文件 ${path} 内容是`, data)
        response.send(data)
    })
}

var index = {
    path: '/',
    method: 'get',
    func: function(req, res) {
        var path = 'index.html'
        sendHtml(path, res)
    }
}

var routes = [
    index,
]

module.exports = routes
