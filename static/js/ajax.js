// var ajax = function(request) {
//     /*
//     request 是一个 object, 有如下属性
//         method, 请求的方法, string
//         url, 请求的路径, string
//         data, 请求发送的数据, 如果是 GET 方法则没这个值, JSOPstring
//         callback, 响应回调, function
//     */
//     // log(request)
//     var r = new XMLHttpRequest()
//     r.open(request.method, request.url, true)
//     if (request.contentType !== undefined) {
//         r.setRequestHeader('Content-Type', request.contentType)
//     }
//     r.onreadystatechange = function(event) {
//         if(r.readyState === 4) {
//             request.callback(r.response)
//         }
//     }
//     if (request.method === 'GET') {
//         r.send()
//     } else {
//         r.send(request.data)
//     }
// }
//
// var add = function() {
//     var request = {
//         method: 'POST',
//         url: '/api/todo/add',
//         contentType: 'application/json',
//         callback: function(response){
//             console.log('response', response);
//             var r = JSON.parse(response)
//             console.log('r', r);
//         },
//         data: JSON.stringify({
//             task: '1',
//             finish: false,
//         }),
//     }
//     ajax(request)
// }
//
// var all = function() {
//     var request = {
//         method: 'GET',
//         url: '/api/todo/all',
//         callback: function(response){
//             console.log('response', response);
//             var r = JSON.parse(response)
//             console.log('r', r);
//         },
//     }
//     ajax(request)
// }
//
// var update = function() {
//     var request = {
//         method: 'POST',
//         url: '/api/todo/update',
//         contentType: 'application/json',
//         callback: function(response){
//             console.log('response', response);
//             var r = JSON.parse(response)
//             console.log('r', r);
//         },
//         data: JSON.stringify({
//             task: '2',
//             finish: false,
//             id: 1,
//         }),
//     }
//     ajax(request)
// }
//
// var dele = function() {
//     var request = {
//         method: 'POST',
//         url: '/api/todo/delete',
//         contentType: 'application/json',
//         callback: function(response){
//             console.log('response', response);
//             var r = JSON.parse(response)
//             console.log('r', r);
//         },
//         data: JSON.stringify({
//             task: '3',
//             finish: false,
//             id: 1,
//         }),
//     }
//     ajax(request)
// }

var callback = function(response) {
        console.log('response', response);
        var r = JSON.parse(response)
        console.log('r', r);
}

var Todo = function() {
    this.todoList=[]
}

Todo.prototype.ajax = function(request) {
    /*
    request 是一个 object, 有如下属性
        method, 请求的方法, string
        url, 请求的路径, string
        data, 请求发送的数据, 如果是 GET 方法则没这个值, JSOPstring
        callback, 响应回调, function
    */
    // log(request)
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

Todo.prototype.add = function(form, callback) {
    var request = {
        method: 'POST',
        url: '/api/todo/add',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.all = function(callback) {
    var request = {
        method: 'GET',
        url: '/api/todo/all',
        callback:callback,
    }
    this.ajax(request)
}

Todo.prototype.update = function(form, callback) {
    var request = {
        method: 'POST',
        url: '/api/todo/update',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.dele = function(form, callback) {
    var request = {
        method: 'POST',
        url: '/api/todo/delete',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}
