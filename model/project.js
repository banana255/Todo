const login = require('./login')

const fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

const Path = "db/project.json"

const ModelProject = function(form) {
    this.name = form.name || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.author = form.author || ''
    // 0 为 开发中，  1 为 开发完
    this.status = form.status || 0
    // true 为收起， false 为张开
    this.isSort = form.isSort || false
    this.captain = form.captain || form.key
}

const loadFiles = function(path) {
    var content = fs.readFileSync(path, 'utf8')
    var data = content ? JSON.parse(content) : []
    return data
}

// const loadPathFromLogin = function(form) {
//     /*
//         验证 用户， 若该用户 存在 则返回 该用户的 project path
//     */
//     var u = login.findByKey(form)
//     if (u) {
//         return u.projectPath
//     } else {
//         console.log('find project: ERR 未找的该用户');
//     }
// }

const loadUserFromLogin = function(form) {
    /*
        验证 用户， 若该用户 存在 则返回 该用户的 userId
    */
   // console.log('loadUserFromLogin', form);
    var u = login.findByKey(form)
    if (u) {
        return u
    } else {
        console.log('find project: ERR 未找的该用户', form.key);
        return
    }
}

// const loadTodoByProId = function(project_id, key) {
//     const todo = require('./todo')
//     var form = {
//         key: key,
//     }
//     var todos = todo.all(form)
//     var ts = []
//     for (var i = 0; i < todos.length; i++) {
//         var t = todos[i]
//         // console.log(project_id, t.project_id, i);
//         if(project_id == t.project_id) {
//             ts.push(t)
//         }
//     }
//     // console.log('todos', ts);
//     return ts
// }

const deleteTodoByProId = function(project_id, key) {
    const todo = require('./todo')
    let form = {
        key: key,
        'project_id': project_id,
    }
    todo.deleTodoByProId(form)
}

const loadProjectByUserId = function(userId, projects) {
    let p = []
    for (var i = 0; i < projects.length; i++) {
        let ids = projects[i]['user_id']
        if(ids.includes(Number(userId)) || ids.includes(String(userId))) {
            p.push(projects[i])
        }
    }
    return p
}

const p = {
    data: loadFiles(Path)
}

p.all = function(form) {
    // this.path = loadPathFromLogin(form)
    // this.data = loadFiles(Path)
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

    let user = loadUserFromLogin(form)
    if (!user) {
        return
    }
    let userId = user.id
    // 深拷贝
    let allProjects = JSON.parse(JSON.stringify(this.data))
    let projects = loadProjectByUserId(userId, allProjects)

    // 给 project 加上 todos
    const todo = require('./todo')
    for (let i = 0; i < projects.length; i++) {
        let p = projects[i]
        // p.todos = loadTodoByProId(p.id, form.key)
        p.todos = todo.todosByProId(p.id)
    }
    // console.log('projects all', projects);
    return projects
}

p.new = function(form) {
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

    // this.all(form)
    var m = new ModelProject(form)

    // 把 form 中的 users 转换成 userIds
    let ids = []
    let users = []
    for (var i = 0; i < form.users.length; i++) {
        let user = loadUserFromLogin({key: form.users[i]})
        if(user) {
            ids.push(user.id)
            users.push(user.key)
        }
    }
    m['user_id'] = ids
    m.users = users

    // 生成 id
    var last = this.data[this.data.length-1]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }
    this.data.push(m)
    this.save()
    let r = JSON.parse(JSON.stringify(m))
    r.todos = []
    return r
}

p.save = function() {
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(Path, s, (err) => {
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
    // this.all(form)
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

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
    // this.all(form)
    if(!login.findByKey(form).isKey) {
        console.log('用户口令错误')
        return
    }

    if (!form.id) {
        console.log('update id is no defined in Projects!');
        return false
    } else {
        var index = this.indexOfProjects(form.id)
        if (index !== false) {
            console.log('project update', form);
            this.data[index].name = form.name || this.data[index].name
            if (form.isSort !== undefined) {
                this.data[index].isSort = form.isSort
            }
            // this.data[index].isSort = form.isSort || this.data[index].isSort
            if (form.status !== undefined) {
                this.data[index].status = form.status
            }
            if (form.captain !== undefined) {
                this.data[index].captain = form.captain
            }
            if (form.users !== undefined) {
                // TODO: 等待测试
                let ids = []
                let users = []
                for (var i = 0; i < form.users.length; i++) {
                    let user = loadUserFromLogin({key: form.users[i]})
                    if(user) {
                        ids.push(user.id)
                        users.push(user.key)
                    },
                    this.data[i].user_id = ids
                    this.data[i].users users
                }
            }
            // this.data[index].status = form.status || this.data[index].status
            // console.log('pUpdate', this.data[index]);
            this.save()
            return this.data[index]
        }
    }
}

module.exports = p
