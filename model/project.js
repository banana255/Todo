var login = require('./login')

var fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/


const ModelProject = function(form) {
    this.name = form.name || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.author = form.author || ''
    // 0 为 开发中，  1 为 开发完
    this.status = form.status || 0
    // true 为收起， false 为张开
    this.isSort = form.isSort || false
}

const loadFiles = function(path) {
    var content = fs.readFileSync(path, 'utf8')
    var data = content ? JSON.parse(content) : []
    return data
}

const loadPathFromLogin = function(form) {
    /*
        验证 用户， 若该用户 存在 则返回 该用户的 project path
    */
    var u = login.findByKey(form)
    if (u) {
        return u.projectPath
    } else {
        console.log('find project: ERR 未找的该用户');
    }
}

const loadTodoByProId = function(project_id, key) {
    const todo = require('./todo')
    var form = {
        key: key,
    }
    var todos = todo.all(form)
    var ts = []
    for (var i = 0; i < todos.length; i++) {
        var t = todos[i]
        // console.log(project_id, t.project_id, i);
        if(project_id == t.project_id) {
            ts.push(t)
        }
    }
    // console.log('todos', ts);
    return ts
}

const deleteTodoByProId = function(project_id, key) {
    const todo = require('./todo')
    let form = {
        key: key,
        'project_id': project_id,
    }
    todo.deleTodoByProId(form)
}

var p = {
    // data:
}

p.all = function(form) {
    this.path = loadPathFromLogin(form)
    this.data = loadFiles(this.path)
    var projects = JSON.parse(JSON.stringify(this.data))

    for (var i = 0; i < projects.length; i++) {
        let p = projects[i]
        p.todos = loadTodoByProId(p.id, form.key)
    }
    return projects
}

p.new = function(form) {
    this.all(form)
    var m = new ModelProject(form)
    var last = this.data[this.data.length-1]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }
    m.todos = []
    this.data.push(m)
    this.save()
    return m
}

p.save = function() {
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(this.path, s, (err) => {
        err ? console.log(err) : console.log('project 保存成功');
    })
}

p.indexOfProjects = function(id) {
    for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].id == id) {
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
        console.log('delete id is no defined in Projects!');
        return false
    } else {
        var index = this.indexOfProjects(form.id)
        if (index !== false) {
            deleteTodoByProId(form.id, form.key)
            var item = this.data[index]
            this.data.splice(index, 1)
            this.save()
            return item
        }
    }
}

p.update = function(form) {
    this.all(form)
    if (!form.id) {
        console.log('update id is no defined in Projects!');
        return false
    } else {
        var index = this.indexOfProjects(form.id)
        if (index !== false) {
            this.data[index].name = form.name || this.data[index].name
            if (form.isSort !== undefined) {
                this.data[index].isSort = form.isSort
            }
            // this.data[index].isSort = form.isSort || this.data[index].isSort
            if (form.status !== undefined) {
                this.data[index].status = form.status
            }
            // this.data[index].status = form.status || this.data[index].status
            // console.log('pUpdate', this.data[index]);
            this.save()
            return this.data[index]
        }
    }
}

module.exports = p
