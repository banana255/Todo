// 检测 input 是否有输入
const bindLoginkeyUp = function() {
    var input = e('#id-todoLogin-input')
    var button = e('#id-todoLogin-confirm')
    inputRequired(input, button)
    input.addEventListener('keyup', function(event){
        input.classList.remove('errorInput')
    })
}

const saveKey = function(key) {
    var k = JSON.stringify(key)
    localStorage._key = k
    todo.key = key
}

const loadKey = function() {
    var k = localStorage._key ?  JSON.parse(localStorage._key) : undefined
    if (k) {
        todo.key = k
    }
    return k
}

const deleKey = function() {
    localStorage._key = false
    todo.key = undefined
}

const loginTemplete = function() {
    return `
    <!-- Login -->
    <div class="todo-login">
        <div class="todo-login-form">
            <div class="todo-login-title">
                <span>主人验证</span>
            </div>
            <div class="todo-login-content">
                <input id="id-todoLogin-input" class='' placeholder="请输入口令">
            </div>
            <div class="todo-login-buttons">
                <button id="id-todoLogin-cancel"  class="todo-login-button" disabled>体验一下</button>
                <button id="id-todoLogin-confirm" class="todo-login-button" disabled>提交</button>
            </div>
        </div>
    </div>
    <!-- Login -->
    `
}

const insertLogin = function() {
    var h = loginTemplete()
    var body = e('body')
    body.innerHTML += h
}

const bindLoginConfirm = function() {
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
                saveKey(form.key)
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

const bindEventsLogin = function() {

    bindLoginkeyUp()

    bindLoginConfirm()
}

const initLogin = function() {
    if (!loadKey()) {
        log('无口令', loadKey())
        insertLogin()
        bindEventsLogin()
    } else {
        log('有口令', loadKey())
        __mainTodo()
    }
}

const __mainLogin = function() {
    return initLogin()
}
