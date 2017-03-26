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
    var time = timeFormat(item.created_time)
    var t = `
        <div class='todo-cell ${i}' data-id=${item.id}>
            <span class='todo-content'>
                <span class='todo-task' contenteditable='false'>${item.task}</span>
                <span class='task-time'>${time}</span>
            </span>
            <span class="todo-cell-button-group">
                <button class='todo-done'>完成</button>
                <button class='todo-delete'>删除</button>
                <button class='todo-edit'>更新</button>
            </span>
        </div>
    `
    return t
}

const templateProject = function(p) {
    let open = {
        sm: 'show-open',
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
    <div class="project-item" data-id=${p.id}>
        <div class="project-header">
            <span class="project-name">${p.name}</span>
            <span class="proj-button-group">
                <button class='proj-done'>完成</button>
                <button class='proj-delete'>删除</button>
                <button class='proj-edit'>编辑</button>
            </span>
            <span class="cannot-select show-more ${open.sm}"> < </span>
        </div>
        <div class="project-item-container ${open.hh}" style='height: ${containHeight}rem'>
            <div class="todo-add">
                <input class='input-todo' placeholder="请输入新任务">
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
    d.pItem = objectByKeyFromArray({id: d.proId}, todo.projectList)
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
    todo.tUpdate(item, function(res){
        // console.log(res)
        let r = JSON.parse(res)
        d.tItem.task = r.task
    })
}

const updateTodoHeight = function(tsDiv, pItem) {
    let h = pItem.todos.length * 3 + 2
    console.log('updateTodoHeight', tsDiv, h);
    tsDiv.parentElement.style.height = h + 'rem'
}


const getDataFromProjHead = function(target) {
    let d = {}
    d.pDiv = target.parentElement.parentElement.parentElement
    d.pId = Number(d.pDiv.dataset.id)
    d.pItem = objectByKeyFromArray({id: d.pId}, todo.projectList)
    return d

}

const insertProject = function(p) {
    let projectContainer = e('#id-project-container')
    let t = templateProject(p)
    projectContainer.insertAdjacentHTML('afterbegin', t)
}

const updateProj = function(target) {
    let pDiv = target.parentElement.parentElement
    let pId = pDiv.dataset.id
    let pItem = objectByKeyFromArray({id: pId}, todo.projectList)
    // 把元素在 todoList 中更新
    let item = {
        task: target.innerText,
        id: pId,
    }
    // log('item', item)
    target.setAttribute('contenteditable', 'false')
    todo.pUpdate(item, function(res){
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
            let pItem = objectByKeyFromArray({id: pId}, todo.projectList)
            let todoInput = pDiv.querySelector('.input-todo')
            let task = todoInput.value
            if (task.length == 0) {
                return
            }
            // 生成 todo 对象
            let item = {
                'task': task,
                'project_id': pId,
            }
            // log('todo-add', item)
            addbutton.setAttribute('disabled', '')
            // console.log(pItem, 'id', pId, 'pDiv', pDiv);
            todo.tAdd(item, function(res){
                let r = JSON.parse(res)
                log('add todo', res)
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
            todo.tUpdate(item, function(res){
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
            todo.tDele(item, function(res){
                var i = JSON.parse(res)
                // log('delete', i)
                todo.pAll(function(res){
                    var i = JSON.parse(res)
                    todo.projectList = i
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
        let t = event.target
        let input = e('#id-input-project')
        let v = input.value
        if (v.length == 0) {
            return
        }
        let item = {
            name: v
        }
        input.setAttribute('disabled', '')
        todo.pAdd(item, function(res){
            let r = JSON.parse(res)
            log('bindAddProjButton res', r)
            input.removeAttribute('disabled')
            insertProject(r)
        })
    })
}

const bindProjUpdateKeyEnter = function() {
    // TODO: ***************************
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
            todo.pUpdate(item, function(res){
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
            todo.pDele(item, function(res){
                var i = JSON.parse(res)
                // log('delete proj', i)
                todo.pAll(function(res){
                    var i = JSON.parse(res)
                    todo.projectList = i
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
            todo.pUpdate(item, function(res){
                let r = JSON.parse(res)
                // console.log('project update', r);
                let pItem = objectByKeyFromArray({id: pId}, todo.projectList)
                pItem.isSort = r.isSort
            })
        }
    })
}

// 程序加载后, 加载 todoList 并且添加到页面中
const initBrower = function() {
    todo.pAll((res) => {
        // log('todo',todo)
        todo.projectList = JSON.parse(res)
        for (var i = 0; i < todo.projectList.length; i++) {
            var p = todo.projectList[i]
            insertProject(p)
            // insertTodo(item)
        }
    })
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
}

const __mainTodo = function() {
    initBrower()
    bindEventsTodo()
}
