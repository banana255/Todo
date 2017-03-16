var login = require('./login')

var fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

// var todoFilePath = './db/todo.json'

const ModelTodo = function(form) {
    this.task = form.task || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.finish = form.finish || false
    this.project_id = form.project_id || null
}

const loadTodos = function(path) {
    var content = fs.readFileSync(path, 'utf8')
    var todos = content ? JSON.parse(content) : []
    return todos
}

const loadPathFromLogin = function(form) {
    /*
        验证 用户， 若该用户 存在 则返回 该用户的 todo path
    */
    var u = login.findByKey(form)
    // console.log('loadPathFromLogin', u);
    if (u) {
        // console.log('find user', u);
        return u.todoPath
    } else {
        console.log('ERR 未找的该用户');
    }
}

var t = {
    // loadTodos 只执行一次
    // data: loadTodos()
}

t.all = function(form) {
    this.path = loadPathFromLogin(form)
    // console.log('todo path', this.path);
    if (this.path == undefined) {
        return
    }
    this.data = loadTodos(this.path)
    var todos = this.data
    return todos
}

t.new = function(form) {
    this.all(form)
    var m = new ModelTodo(form)
    var last = this.data[this.data.length-1]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }
    this.data.push(m)
    this.save()
    return m
}

t.save = function() {
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(this.path, s, (err) => {
        err ? console.log(err) : console.log('todo 保存成功');
    })
}

t.indexOfTodos = function(id) {
    for (var i = 0; i < this.data.length; i++) {
        if(t.data[i].id == id) {
            // console.log('indexOfTodos', i);
            return  i
        }
    }
    console.log('id is no found in Todos');
    return false
}

t.dele = function(form) {
    this.all(form)
    if (!form.id) {
        console.log('delete id is no defined!');
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
    this.all(form)
    if (!form.id) {
        console.log('update id is no defined!');
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
    this.all(form)

    for (let i = 0; i < this.data.length; i++) {
        let t = this.data[i]
        if (t.project_id == form.project_id) {
            this.data.splice(i, 1)
            i--
        }
    }
    this.save()
}

module.exports = t
