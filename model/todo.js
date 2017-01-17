var fs = require('fs')

/*
    .all()
    .new(form)
    .dele(form)
    .update(form)
*/

var todoFilePath = './db/todo.json'

const ModelTodo = function(form) {
    this.task = form.task || ''
    this.created_time = form.created_time || Math.floor(new Date() / 1000)
    this.finish = form.finish || false
}

const loadTodos = function() {
    var content = fs.readFileSync(todoFilePath, 'utf8')
    var todos = content ? JSON.parse(content) : []
    return todos
}

var t = {
    // loadTodos 只执行一次
    data: loadTodos()
}

t.all = function() {
    var todos = this.data
    return todos
}

t.new = function(form) {
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
    var s = JSON.stringify(this.data)
    fs.writeFile(todoFilePath, s, (err) => {
        err ? console.log(err) : console.log('保存成功');
    })
}

t.indexOfTodos = function(id) {
    for (var i = 0; i < t.data.length; i++) {
        if(t.data[i].id == id) {
            // console.log('indexOfTodos', i);
            return  i
        }
    }
    console.log('id is no found in Todos');
    return false
}

t.dele = function(form) {
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

module.exports = t
