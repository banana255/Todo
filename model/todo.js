const login = require('./login')

const fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

// var todoFilePath = './db/todo.json'
const Path = './db/todo.json'

const ModelTodo = function(form) {
    this.task = form.task || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.finish = form.finish || false
    this.project_id = Number(form.project_id) || null
    this.remind_time = Number(form.remind_time) || null
}

const loadTodos = function(path) {
    var content = fs.readFileSync(path, 'utf8')
    var todos = content ? JSON.parse(content) : []
    return todos
}

// const loadPathFromLogin = function(form) {
//     /*
//         验证 用户， 若该用户 存在 则返回 该用户的 todo path
//     */
//     var u = login.findByKey(form)
//     // console.log('loadPathFromLogin', u);
//     if (u) {
//         // console.log('find user', u);
//         return u.todoPath
//     } else {
//         console.log('ERR 未找的该用户');
//     }
// }

var t = {
    // loadTodos 只执行一次
    data: loadTodos(Path)
}

t.all = function(form) {
    // this.path = loadPathFromLogin(form)
    // console.log('todo path', this.path);
    // if (this.path == undefined) {
    //     return
    // }
    // this.data = loadTodos(this.path)
    // this.data = loadTodos(Path)
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

    let todos = this.data

    // 给 todo 添加相应的 comments
    const comment = require('./comment')
    for (var i = 0; i < todos.length; i++) {
        let t = todos[i]
        t.comments = comment.commentsByTodoId(t.id)
    }
    return todos
}

t.new = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    // this.all(form)
    var m = new ModelTodo(form)
    // var last = this.data[this.data.length-1]
    var last = this.data[0]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }
    // this.data.push(m)
    this.data.unshift(m)
    this.save()
    m.comments = []
    return m
}

t.save = function() {
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(Path, s, (err) => {
        err ? console.log(err) : console.log('todo 保存成功');
    })
}

t.indexOfTodos = function(id) {
    id = Number(id)
    for (var i = 0; i < this.data.length; i++) {
        if(t.data[i].id == id) {
            // console.log('indexOfTodos', i);
            return  i
        }
    }
    console.log('id is no found in Todos!');
    return false
}

t.dele = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    // this.all(form)
    if (!form.id) {
        console.log('delete id is no defined in Todos!');
        return false
    } else {
        var index = this.indexOfTodos(form.id)
        if (index !== false) {
            var item = this.data[index]
            this.data.splice(index, 1)
            this.save()
            return  item
        }
    }
}

t.update = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }
    // this.all(form)
    if (!form.id) {
        console.log('update id is no defined in Todos!');
        return false
    } else {
        var index = this.indexOfTodos(form.id)
        if (index !== false) {
            this.data[index].task = form.task || this.data[index].task
            this.data[index].finish = (form.finish !== undefined) ? form.finish : this.data[index].finish
            this.save()
            return this.data[index]
        }
    }
}

t.deleTodoByProId = function(form) {
    /*
        form:
           key: key,
           'project_id': project_id,
    */
    // this.all(form)
    for (let i = 0; i < this.data.length; i++) {
        let t = this.data[i]
        if (t.project_id == form.project_id) {
            this.data.splice(i, 1)
            i--
        }
    }
    this.save()
}

t.todosByProId = function(project_id) {
    let ts = []
    for (let i = 0; i < this.data.length; i++) {
        let t = this.data[i]
        // console.log(project_id, t.project_id, i);
        if(project_id == t.project_id) {
            ts.push(t)
        }
    }
    // console.log('todos', ts);
    return ts
}

module.exports = t
