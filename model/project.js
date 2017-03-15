var login = require('./login')

var fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

// var todoFilePath = './db/project.json'

const ModelProject = function(form) {
    this.task = form.task || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.author = form.author || ''
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
    if (u) {
        return u.projectPath
    } else {
        console.log('find project: ERR 未找的该用户');
    }
}

var p = {
    // loadTodos 只执行一次
    // data: loadTodos()
}

p.all = function(form) {
    this.path = loadPathFromLogin(form)
    this.data = loadTodos(this.path)
    var projects = this.data

    const todo = require('./todo')
    var todos = todo.all()
    for (var i = 0; i < projects.length; i++) {
        var p = projects[i]
        var ts = []
        for (var i = 0; i < todos.length; i++) {
            var t = todos[i]
            if(p.id = t.project_id) {
                ts.push(t)
            }
        }
        p.todos = ts
    }

    return projects
}

p.new = function(form) {
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

p.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(this.path, s, (err) => {
        err ? console.log(err) : console.log('保存成功');
    })
}

p.indexOfProjects = function(id) {
    for (var i = 0; i < t.data.length; i++) {
        if(t.data[i].id == id) {
            // console.log('indexOfProjects', i);
            return  i
        }
    }
    console.log('id is no found in Projects');
    return false
}

p.dele = function(form) {
    this.all(form)
    if (!form.id) {
        console.log('delete id is no defined!');
        return false
    } else {
        var index = this.indexOfProjects(form.id)
        if (index !== false) {
            var item = this.data[index]
            this.data.splice(index, 1)
            this.save()
            return  item
        }
    }
}

p.update = function(form) {
    this.all(form)
    if (!form.id) {
        console.log('update id is no defined!');
        return false
    } else {
        var index = this.indexOfProjects(form.id)
        if (index !== false) {
            this.data[index].name = form.name || this.data[index].name
            this.save()
            return this.data[index]
        }
    }
}

module.exports = p
