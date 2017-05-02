const log = function() {
    console.log.apply(console, arguments)
}

const e = (sel) => document.querySelector(sel)

// e.prototype.on = document.querySelector.prototype.addEventListener

const es = (sel) => document.querySelectorAll(sel)

const inputRequired = function(input, button) {
    input.addEventListener('input', function(event){
        // log('keyup')
        if (input.value.length > 0) {
            button.removeAttribute('disabled')
        } else {
            button.setAttribute('disabled', '')
        }
    })
}

// 开关元素的某个 class
const toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

const currentTime = function() {
    var d = new Date()
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

const timeFormat = function(time) {
    var d = new Date(time * 1000)
    var month = zfill(d.getMonth() + 1)
    var date = zfill(d.getDate())
    var hours = zfill(d.getHours())
    var minutes = zfill(d.getMinutes())
    var seconds = zfill(d.getSeconds())
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}

// log response
const callback = function(response) {
    console.log('response', response);
    var r = JSON.parse(response)
    console.log('r', r);
}

const ajax = function(request) {
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
        r.send(request.data)
    }
}

// 通过 某一 Obj.key=xx 从 Array 中找出 符合条件的条件的 Object 并返回
const objectByKeyFromArray = function(keyWord, array) {
    // keyworrd: { id: 2}
    // log('objectByKeyFromArray', keyWord, array)
    let key = Object.keys(keyWord)[0]
    for (var i = 0; i < array.length; i++) {
        let a = array[i]
        if (a[key] == keyWord[key]) {
            return a
        }
    }
    return false
}
// test
// var a = [{a: 1},{a: 2}]
// var k = {a:1}
// objectByKeyFromArray(k, a)

// 补全，将 string 用 key 补全左边，直至长度为 length
const zfill = function(string, length=2, key='0') {
    let s = String(string)
    let l = Number(length) - s.length
    for (let i = 0; i < l; i++) {
        s = key + s
    }
    return s
}

const timeOfDay = function(seconds) {
    /**
     * 给定时间戳
     * 返回 时间戳 代表那天的 0:00 的时间戳
     */
    seconds = Number(seconds)
    let hoursSeconds = 60 * 60
    let day = Math.floor((seconds + 8 * hoursSeconds) / (24 * hoursSeconds))
    let t = day * (24 * hoursSeconds) - (8 * hoursSeconds)
    return t
}

const appendHtml = function(sel, html, position="beforeend") {
    e(sel).insertAdjacentHTML(position, html)
}
