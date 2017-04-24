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

const Todo = function() {
    this.todoList=[]
    this.projectList=[]
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
    if (request.data == undefined) {
        r.send()
    } else {
        // console.log(request.data);
        r.send(request.data)
    }
}

Todo.prototype.tAdd = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/todo/add',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    console.log(request);
    this.ajax(request)
}

Todo.prototype.tAll = function(callback) {
    var form = {
        key: todo.key,
    }
    var request = {
        method: 'POST',
        url: '/api/todo/all',
        callback:callback,
        contentType: 'application/json',
        data: JSON.stringify(form),
    }
    // log(request)
    this.ajax(request)
}

Todo.prototype.tUpdate = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/todo/update',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.tDele = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/todo/delete',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.pAdd = function(form, callback) {
    form.key = todo.key
    // TODO: users
    form.users = [form.key]
    var request = {
        method: 'POST',
        url: '/api/project/add',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.pAll = function(callback) {
    var form = {
        key: todo.key,
    }
    var request = {
        method: 'POST',
        url: '/api/project/all',
        callback:callback,
        contentType: 'application/json',
        data: JSON.stringify(form),
    }
    // log(request)
    this.ajax(request)
}

Todo.prototype.pUpdate = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/project/update',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.pDele = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/project/delete',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}


Todo.prototype.cAdd = function(form, callback) {
    form.key = todo.key
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}

Todo.prototype.cAll = function(callback) {
    var form = {
        key: todo.key,
    }
    var request = {
        method: 'POST',
        url: '/api/comment/all',
        callback:callback,
        contentType: 'application/json',
        data: JSON.stringify(form),
    }
    // log(request)
    this.ajax(request)
}


Todo.prototype.login = function(form, callback) {
    /*form = {
        key: value
    }

    response = {
        isKey: true/false
    }
    */
    var request = {
        method: 'POST',
        url: '/api/login',
        contentType: 'application/json',
        callback: callback,
        data: JSON.stringify(form),
    }
    this.ajax(request)
}


const c = function(response){
    console.log('response', response);
    var r = JSON.parse(response)
    console.log('r', r);
}
