var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(express.static('static'))
app.use(bodyParser.json())

const registerRoutes = function(app, routes) {
    /*
    route = {
        method,
        path,
        func,
    }
    */
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeModules = [
    './route/index',
    './route/todo',

]

for (let i = 0; i < routeModules.length; i++) {
    /*
        routes = [
            route1,
            route2,
            route3,
            ...
        ]
    */
    let routes = require(routeModules[i])
    registerRoutes(app, routes)
}

const server = app.listen(80, function(){
    var host = server.address().address
    var port = server.address().port

    console.log('todo 开启, 访问地址为 http://%s:%s', host, port);
})
