// log 函数
var log = function() {
    console.log.apply(console, arguments)
}

var e = (sel) => document.querySelector(sel)


var bindBlur = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('blur', function(){
        log('container blur', event, event.target)
        var target = event.target
        var taskContent = target.parentElement
        var todoDiv = taskContent.parentElement
        var index = indexOfElement(todoDiv)
        todoList[index].task = target.innerHTML
        saveTodos()
        target.setAttribute('contenteditable', 'false')
    }, true)
}

var bindAddButton = function() {
    // 给 add button 绑定添加 todo 事件
    var addButton = e('#id-button-add')
    addButton.addEventListener('click', function(){
        // 获得 input.value
        var todoInput = e('#id-input-todo')
        var task = todoInput.value
        // 生成 todo 对象
        var todo = {
            'task': task,
            'time': currentTime(),
            'finish': false,
        }
        todoList.push(todo)
        saveTodos()
        insertTodo(todo)
    })
}

var bindAddkeyUp = function() {
    var input = e('#id-input-todo')
    input.addEventListener('keyup', function(event){
        log('keyup')
        if (input.value.length > 0) {
            e('#id-button-add').removeAttribute('disabled')
        } else {
            e('#id-button-add').setAttribute('disabled', '')
        }
    })

}

var bindUpdateKeyEnter = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('keydown', function(event){
        log('container keydown', event, event.target)
        var target = event.target
        if(event.key === 'Enter') {
            log('按了回车')
            // 失去焦点
            target.blur()
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            var taskContent = target.parentElement
            var todoDiv = taskContent.parentElement
            var index = indexOfElement(todoDiv)
            log('update index',  index)
            // 把元素在 todoList 中更新
            todoList[index].task = target.innerHTML
            saveTodos()

        }
    })
}

var bindDoneDeleteEdit = function() {
    var todoContainer = e('#id-div-container')
    todoContainer.addEventListener('click', function(event){
        var target = event.target
        var todoDiv = target.parentElement
        var index = indexOfElement(todoDiv)
        log('index is', index)
        if(target.classList.contains('todo-done')) {
            log('done')
            // 给 todo div 开关一个状态 class
            toggleClass(todoDiv, 'done')
            todoList[index].finish = todoDiv.classList.contains('done') ? true : false
            saveTodos()
            // log(todoList[index])
        } else if (target.classList.contains('todo-delete')) {
            log('delete')
            todoDiv.remove()
            todoList.splice(index, 1)
            saveTodos()
        } else if(target.classList.contains('todo-edit')) {
            log('edit')
            var s = todoDiv.children[3].children[1]
            log('span is', s)
            s.setAttribute('contenteditable', 'true')
            s.focus()
        }
    })
}

var insertTodo = function(todo) {
    // 添加到 container 中
    var todoContainer = e('#id-div-container')
    var t = templateTodo(todo)
    // 添加元素
    todoContainer.insertAdjacentHTML('beforeend', t);
}

var templateTodo = function(todo) {
    var i = todo.finish ? 'done' : ''
    var t = `
        <div class='todo-cell ${i}'>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>更新</button>
            <span class='todo-content'>
                <span class='task-time' >${todo.time}</span>
                <span contenteditable='false'>${todo.task}</span>
            </span>
        </div>
    `
    return t
}

// 保存 todoList
var saveTodos = function() {
    var s = JSON.stringify(todoList)
    localStorage.todoList = s
}

var loadTodos = function() {
    var s = localStorage.todoList
    return (s == undefined) ? [] : JSON.parse(s)
}

// 返回自己在父元素中的下标
var indexOfElement = function(element) {
    var parent = element.parentElement
    // log('parent', parent)
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}

// 开关元素的某个 class
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var zfill = function(string) {
    var s = String(string)
    if (s.length == 1) {
        s = '0' + s
    }
    return s
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

// 程序加载后, 加载 todoList 并且添加到页面中
var initBrower = function() {
    todoList = loadTodos()
    for (var i = 0; i < todoList.length; i++) {
        var todo = todoList[i]
        insertTodo(todo)
    }
}

var bindEvents = function() {
    bindAddButton()

    bindUpdateKeyEnter()

    bindDoneDeleteEdit()

    bindBlur()

    bindAddkeyUp()
}

var todoList = []

var __main = function() {
    initBrower()
    bindEvents()
}

__main()
