var log = function() {
    console.log.apply(console, arguments)
}

var e = (sel) => document.querySelector(sel)

var es = (sel) => document.querySelectorAll(sel)

var inputRequired = function(input, button) {
    input.addEventListener('keyup', function(event){
        // log('keyup')
        if (input.value.length > 0) {
            button.removeAttribute('disabled')
        } else {
            button.setAttribute('disabled', '')
        }
    })
}

// 开关元素的某个 class
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var currentTime = function() {
    var d = new Date()
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

var timeFormat = function(time) {
    var d = new Date(time * 1000)
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

var callback = function(response) {
        console.log('response', response);
        var r = JSON.parse(response)
        console.log('r', r);
}

var ajax = function(request) {
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
