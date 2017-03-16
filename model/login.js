var fs = require('fs')

var loginFilePath = './db/userKey.json'

const ModelLogin = function(form) {
    this.key = form.key || ''
    // this.created_time = Math.floor(new Date() / 1000)
}

const loadKeys = function() {
    var content = fs.readFileSync(loginFilePath, 'utf8')
    var keys = content ? JSON.parse(content) : []
    return keys
}

var u = {
    // loadTodos 只执行一次
    data: loadKeys()
}

u.all = function(form) {
    var keys = this.data
    return keys
}

u.new = function(form) {
    var m = new ModelLogin(form)
    var last = this.data[this.data.length-1]
    if (last == undefined) {
        m.id = 1
    } else {
        m.id = last.id + 1
    }

    // 用 fs new 一个新的 db
    // fs open 的路径相对于 Todo
    m.todoPath = 'db/todo-id' + m.id + '-key-' + m.key + '.json'
    m.projectPath = 'db/project-id' + m.id + '-key-' + m.key + '.json'

    // 新建 todoPath & projectPath 2 个文件
    fs.open(m.todoPath, "w", 0644, function(err,fd){
        if(err) {
            throw err
        }
        fs.closeSync(fd);
    })
    fs.open(m.projectPath, "w", 0644, function(err,fd){
        if(err) {
            throw err
        }
        fs.closeSync(fd);
    })

    this.data.push(m)
    this.save()
    return m
}

u.save = function() {
    // 序列化 & 4 格缩进
    var s = JSON.stringify(this.data, '', 4)
    fs.writeFile(loginFilePath, s, (err) => {
        err ? console.log(err) : console.log('保存成功');
    })
}

u.indexOfTodos = function(id) {
    for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].id == id) {
            // console.log('indexOfTodos', i);
            return  i
        }
    }
    console.log('id is no found in Todos');
    return false
}

u.dele = function(form) {
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

u.update = function(form) {
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

u.findByKey = function(form) {
    for (var i = 0; i < this.data.length; i++) {
        // console.log(this.data[i].key , form.key)
        // console.log(typeof this.data[i].key , typeof form.key)
        // console.log('findByKey', form);
        if(this.data[i].key === form.key) {
            return {
                isKey: true,
                id: this.data[i].id,
                todoPath: this.data[i].todoPath,
                projectPath: this.data[i].projectPath,
            }
        }
    }
    return
}

module.exports = u
