// 检测 input 是否有输入
var bindLoginkeyUp = function() {
    var input = e('#id-todoLogin-input')
    var button = e('#id-todoLogin-confirm')
    inputRequired(input, button)
    input.addEventListener('keyup', function(event){
        input.classList.remove('errorInput')
    })
}

var bindLoginConfirm = function() {
    var button = e('#id-todoLogin-confirm')
    var input = e('#id-todoLogin-input')
    button.addEventListener('click', function(event){
        button.setAttribute('disabled', '')
        var form = {
            key: input.value,
        }
        todo.login(form, function(res){
            var r = JSON.parse(res)
            if (r.isKey) {
                // 口令正确
                log('口令正确')
                e('.todo-login').remove()
                todo.key = form.key
                __mainTodo()

            } else {
                // 口令错误
                log('口令错误')
                // button.removeAttribute('disabled')
                input.value = ''
                input.setAttribute('placeholder', '口令错误,请再输入口令')
                input.classList.add('errorInput')
            }
        })
    })
}

var bindEventsLogin = function() {

    bindLoginkeyUp()

    bindLoginConfirm()
}

var __mainLogin = function() {
    bindEventsLogin()
}
