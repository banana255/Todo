const templateTodos = function(items) {
    let r = ''
    for (var i = 0; i < items.length; i++) {
        let cell  = items[i]
        r += templateTodo(cell)
    }
    return r
}

const templateTodo = function(item) {
    var i = item.finish ? 'done' : ''
    var time = timeFormat(item.remind_time).split(' ')[0]
    var t = `
        <div class='todo-cell ${i}' data-id=${item.id} data-remind-time=${item.remind_time}>
            <span class='todo-content'>
                <span class='todo-task' contenteditable='false'>${item.task}</span>
                <span class='task-time'>${time}</span>
            </span>
            <span class="todo-cell-button-group">
                <button class='todo-done btn btn-default'>完成</button>
                <button class='todo-delete btn btn-default'>删除</button>
                <button class='todo-edit btn btn-default'>更新</button>
            </span>
        </div>
    `
    return t
}

const templateProject = function(p) {
    let open = {
        sm: 'show-open',
        // hh 为隐藏 project-container
        hh: ''
    }
    if (p.isSort) {
        open.sm = ''
        open.hh = 'hide-height'
    }
    let todos, containHeight
    if (p.todos) {
        todos = templateTodos(p.todos)
        containHeight = 2 + 3 * p.todos.length
    } else {
        todos = ''
        containHeight = ''
    }
    let t = `
    <div class="project-item" id="p${p.id}" data-id=${p.id}>
        <div class="project-header">
            <span class="project-name">${p.name}</span>
            <span class="proj-button-group">
                <button class='proj-done btn btn-default'>完成</button>
                <button class='proj-delete btn btn-default'>删除</button>
                <button class='proj-edit btn btn-default'>编辑</button>
            </span>
            <span class="cannot-select show-more ${open.sm}"> < </span>
        </div>
        <div class="project-item-container ${open.hh}" style='height: ${containHeight}rem'>
            <div class="todo-add">
                <input class='input-todo' placeholder="请输入新任务">
                <input type="date" class="remind-time">
                <button class="button-add-todo">添加</button>
            </div>
            <div class="project-todos">
                ${todos}
            </div>
        </div>
    </div>
    `
    return t
}

const getDataFromTodoCell = function(target) {
    let d = {}
    d.todoDiv = target.parentElement.parentElement
    d.projectDiv = d.todoDiv.parentElement.parentElement.parentElement
    d.proId = Number(d.projectDiv.dataset.id)
    d.todoId = Number(d.todoDiv.dataset.id)
    d.pItem = objectByKeyFromArray({id: d.proId}, window.todo.projectList)
    // log('pItem', pItem)
    d.tItem = objectByKeyFromArray({id: d.todoId}, d.pItem.todos)
    // log('tItem', tItem)
    return d
}

const insertTodo = function(item, tDiv) {
    log('insertTodo', tDiv)
    // 添加到 container 中
    var t = templateTodo(item)
    // 添加元素
    tDiv.insertAdjacentHTML('afterbegin', t)
}

const updateTodo = function(target) {
    var d = getDataFromTodoCell(target)
    // 把元素在 todoList 中更新
    var item = {
        task: target.innerHTML,
        id: d.todoDiv.dataset.id,
    }
    log('item', item)
    target.setAttribute('contenteditable', 'false')
    window.todo.tUpdate(item, function(res){
        // console.log(res)
        let r = JSON.parse(res)
        d.tItem.task = r.task
    })
}

const updateTodoHeight = function(tsDiv, pItem) {
    let h = pItem.todos.length * 3 + 2
    // console.log('updateTodoHeight', tsDiv, h);
    tsDiv.parentElement.style.height = h + 'rem'
}


const getDataFromProjHead = function(target) {
    let d = {}
    d.pDiv = target.parentElement.parentElement.parentElement
    d.pId = Number(d.pDiv.dataset.id)
    d.pItem = objectByKeyFromArray({id: d.pId}, window.todo.projectList)
    return d

}

const insertProject = function(p) {
    let projectContainer = e('#id-project-container')
    let t = templateProject(p)
    projectContainer.insertAdjacentHTML('afterbegin', t)
    // 给 input timedate-local 初始化时间
    // es('.remind-time').forEach(function(item){
    //     item.valueAsDate = new Date()
    // })
}

const updateProj = function(target) {
    let pDiv = target.parentElement.parentElement
    let pId = pDiv.dataset.id
    let pItem = objectByKeyFromArray({id: pId}, window.todo.projectList)
    // 把元素在 todoList 中更新
    let item = {
        name: target.innerText,
        id: pId,
    }
    // log('item', item)
    target.setAttribute('contenteditable', 'false')
    window.todo.pUpdate(item, function(res){
        // console.log(res)
        let r = JSON.parse(res)
        pItem.task = r.task
    })
}


const bindTodoBlur = function() {
    e('#id-project-container').addEventListener('blur', function(event){
        // log('container blur', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-task')) {
            updateTodo(target)
        }
    }, true)
}

const bindTodoAddButton = function() {
    // 给 add button 绑定添加 todo 事件
    e('.project-main').addEventListener('click', function(event){
        let t = event.target
        if (t.classList.contains('button-add-todo')) {
            // 获得 input.value
            let addbutton = t
            let pDiv = t.parentElement.parentElement.parentElement
            let pId = pDiv.dataset.id
            let pItem = objectByKeyFromArray({id: pId}, window.todo.projectList)
            // console.log('pItem', pItem);
            let todoInput = pDiv.querySelector('.input-todo')
            let timeInputValue = pDiv.querySelector('.remind-time').value || null
            let task = todoInput.value
            let remindTime
            if (timeInputValue) {
                remindTime = Math.floor(new Date(timeInputValue.split('-').join('/')).getTime() / 1000)
            } else {
                remindTime = null
            }
            if (task.length == 0) {
                return
            }
            // 生成 todo 对象
            let item = {
                'task': task,
                'project_id': pId,
                'remind_time': remindTime,
            }
            console.log(item);
            // log('todo-add', item, pItem)
            addbutton.setAttribute('disabled', '')
            // console.log(pItem, 'id', pId, 'pDiv', pDiv);
            window.todo.tAdd(item, function(res){
                let r = JSON.parse(res)
                // log('add todo', res)
                pItem.todos.push(r)
                todoInput.value = ''
                addbutton.removeAttribute('disabled')
                let tsDiv = pDiv.querySelector('.project-todos')
                insertTodo(r, tsDiv)
                updateTodoHeight(tsDiv, pItem)
            })
        }
    })
}

const bindTodoUpdateKeyEnter = function() {
    var container = e('#id-project-container')
    container.addEventListener('keydown', function(event){
        // log('container keydown', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-task')) {
            if(event.keyCode === 13) {
                log('按了回车')
                // 阻止默认行为的发生, 不插入回车
                event.preventDefault()
                // 触发 blur 事件
                target.blur()
                // updateTodo(target)
            }
        }
    })
}

const bindTodoDoneDeleteEdit = function() {
    var projContainer = e('#id-project-container')
    projContainer.addEventListener('click', function(event){
        var target = event.target
        // 按了 完成 按钮
        if(target.classList.contains('todo-done')) {
            log('done')
            var d = getDataFromTodoCell(target)
            var item = {
                id: d.todoId,
            }
            item.finish = d.todoDiv.classList.contains('done') ? false : true
            // log('item is', item)
            window.todo.tUpdate(item, function(res){
                var i = JSON.parse(res)
                d.tItem.finish = i.finish
                toggleClass(d.todoDiv, 'done')
            })
        // 按了 删除 按钮
        } else if (target.classList.contains('todo-delete')) {
            log('delete')
            var d = getDataFromTodoCell(target)
            var item = {
                id: d.todoId,
            }
            window.todo.tDele(item, function(res){
                var i = JSON.parse(res)
                // log('delete', i)
                window.todo.pAll(function(res){
                    var i = JSON.parse(res)
                    window.todo.projectList = i
                    d.pItem.todos.splice(0, 1)
                    updateTodoHeight(d.todoDiv.parentElement, d.pItem)
                    d.todoDiv.remove()
                })
            })
        // 按了 编辑 按钮
        } else if(target.classList.contains('todo-edit')) {
            log('edit')
            var d = getDataFromTodoCell(target)
            var s = d.todoDiv.querySelector('.todo-task')
            // var s = d.todoDiv.children[3].children[1]
            // log('span is', s)
            s.setAttribute('contenteditable', 'true')
            s.focus()
            // var selection = getSelection()
        }
    })
}


const bindProjBlur = function() {
    e('#id-project-container').addEventListener('blur', function(event){
        // log('container blur', event, event.target)
        var target = event.target
        if (target.classList.contains('project-name')) {
            updateProj(target)
        }
    }, true)
}

const bindProjAddButton = function() {
    e('#id-button-project-add').addEventListener('click', function(event){
        log('bindAddProjButton')
        // let t = event.target
        // let input = e('#id-input-project')
        // let v = input.value
        // if (v.length == 0) {
        //     return
        // }
        // let item = {
        //     name: v
        // }
        // input.setAttribute('disabled', '')
        // window.todo.pAdd(item, function(res){
        //     let r = JSON.parse(res)
        //     log('bindAddProjButton res', r)
        //     window.todo.projectList.push(r)
        //     input.removeAttribute('disabled')
        //     todo.projectList.push(r)
        //     insertProject(r)
        // })
        alertGua('newProject')
    })
}

const bindProjUpdateKeyEnter = function() {
    var container = e('#id-project-container')
    container.addEventListener('keydown', function(event){
        // log('container keydown', event, event.target)
        var target = event.target
        if (target.classList.contains('project-name')) {
            if(event.keyCode === 13) {
                log('按了回车')
                // 阻止默认行为的发生, 不插入回车
                event.preventDefault()
                // 触发 blur 事件
                target.blur()
                // updateProj(target)
            }
        }
    })
}

const bindProjDoneDeleteEdit = function() {
    var projContainer = e('#id-project-container')
    projContainer.addEventListener('click', function(event){
        var target = event.target
        // 按了 完成 按钮
        if(target.classList.contains('proj-done')) {
            log('proj-done')
            var d = getDataFromProjHead(target)
            var item = {
                id: d.pId,
            }
            item.status = d.pItem.status == 0 ? 1 : 0
            log('item is', item)
            window.todo.pUpdate(item, function(res){
                var i = JSON.parse(res)
                d.pItem.status = i.status
                log('d.pItem.status', d.pItem.status)
                // toggleClass(d.todoDiv, 'done')
            })
        // 按了 删除 按钮
        } else if (target.classList.contains('proj-delete')) {
            log('proj-delete')
            var d = getDataFromProjHead(target)
            var item = {
                id: d.pId,
            }
            // console.log('delete item', item);
            window.todo.pDele(item, function(res){
                var i = JSON.parse(res)
                // log('delete proj', i)
                window.todo.pAll(function(res){
                    var i = JSON.parse(res)
                    window.todo.projectList = i
                    d.pDiv.remove()
                })
            })
        // 按了 编辑 按钮
        } else if(target.classList.contains('proj-edit')) {
            log('proj-edit')
            var d = getDataFromProjHead(target)
            var s = d.pDiv.querySelector('.project-name')
            // var s = d.todoDiv.children[3].children[1]
            // log('span is', s)
            s.setAttribute('contenteditable', 'true')
            s.focus()
            // var selection = getSelection()
        }
    })
}

// 是否收起 工程 夹
const bindShowMore = function() {
    e('#id-project-container').addEventListener('click', function(event){
        let t = event.target
        if (t.classList.contains('show-more')) {
            t.classList.toggle('show-open')
            let pDiv = t.parentElement.parentElement
            let c = pDiv.querySelector('.project-item-container')
            // log('pDiv', pDiv, 'container', c)
            c.classList.toggle('hide-height')
            let pId = pDiv.dataset.id
            let item = {
                id: pId,
                isSort: !t.classList.contains('show-open')
            }
            // log('bindShowMore', item)
            window.todo.pUpdate(item, function(res){
                let r = JSON.parse(res)
                // console.log('project update', r);
                let pItem = objectByKeyFromArray({id: pId}, window.todo.projectList)
                pItem.isSort = r.isSort
            })
        }
    })
}

const toggleHome = function() {
    /* 清除 单个日期的 proj 样式 S */
    e('.project-form').classList.remove('hide')
    es('.project-item').forEach(function(item){
        item.classList.remove('hide')
        item.querySelector('.proj-button-group').classList.remove('hide')
    })
    es('.todo-add').forEach(function(item){
        item.classList.remove('hide')
    })
    es('.strong').forEach(function(item){
        item.classList.remove('strong')
    })
    es('.small').forEach(function(item){
        item.classList.remove('small')
    })
    es('.todo-cell-button-group').forEach(function(item){
        item.classList.remove('hide')
    })
    /* 清除 单个日期的 proj 样式 E */

    e('.project-main').classList.toggle('hide')
    e('#calendar').classList.toggle('hide')
    e('.login-exit').classList.toggle('hide')
    if (!e('.project-main').classList.contains('hide')) {
        e('.home').innerHTML = '返回'
    } else {
        e('.home').innerHTML = '我的'
        Calendar.renderMsg(todo.projectList)
    }
}

const bindShowHome = function() {
    e('.home').addEventListener('click', function(event){
        console.log('click home');
        toggleHome()
    })
}

const showProject = function(pIds, date) {
    /**
     *  根据 pIds 展示相应的 project
    */
    // console.log('showProject');
    if (pIds.length == 0) {
        swal("该日无提醒事项", "", "success")
        return
    }
    toggleHome()
    e('.project-form').classList.add('hide')
    es('.todo-add').forEach(function(item){
        item.classList.add('hide')
    })
    es('.project-item').forEach(function(item){
        if (pIds.indexOf(item.dataset.id) == -1) {
            item.classList.add('hide')
        }
        item.querySelector('.proj-button-group').classList.add('hide')
    })
    es('.todo-cell').forEach(function(item){
        item.querySelector('.todo-cell-button-group').classList.add('hide')
        if (item.dataset.remindTime == String(date)) {
            // console.log('todo-cell', item);
            item.classList.add('strong')
        } else {
            item.classList.add('small')
        }
    })
}

const showTodoItem = function(id, projectList) {
    let p = projectList
    for (var i = 0; i < p.length; i++) {
        let r = objectByKeyFromArray({id: id}, p[i].todos)
        if (r) {
            console.log('showTodoItem', r);
            return r
        }
    }
}

const bindTodoItem = function() {
    e('#id-project-container').addEventListener('click',function(event){
        let t = event.target
        if (t.classList.contains('todo-cell')) {
            console.log('click item');
            let tId = t.dataset.id
            console.log(tId);
            showTodoItem(tId, window.todo.projectList)
        }
    })
}

// 程序加载后, 加载 todoList 并且添加到页面中
const initBrower = function() {
    window.todo.pAll((res) => {
        // log('todo',todo)
        window.todo.projectList = JSON.parse(res)
        for (var i = 0; i < window.todo.projectList.length; i++) {
            var p = window.todo.projectList[i]
            insertProject(p)
            // insertTodo(item)
        }
        Calendar.renderMsg(todo.projectList)
    })

    // 渲染日历
    Calendar.init('calendar', new Date(), function(date, pIds){
        console.log('date', date, pIds);
        showProject(pIds, date)
    });
}

const bindEventsTodo = function() {

    bindTodoAddButton()
    bindTodoDoneDeleteEdit()
    bindTodoUpdateKeyEnter()
    bindTodoBlur()

    bindProjAddButton()
    bindProjDoneDeleteEdit()
    bindProjUpdateKeyEnter()
    bindProjBlur()

    bindShowMore()
    bindShowHome()

    bindTodoItem()
}

const __mainTodo = function() {
    // 所有关于时间的均以 时间戳 存储(单位 s)
    initBrower()
    bindEventsTodo()
}
