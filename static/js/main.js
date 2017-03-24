const __main = function() {
    // __mainTodo()
    // 先验证账户，验证通过则自动加载 __mainTodo()
    __mainLogin()

    // 头部逻辑放置处
    __mainHeader()

}

// 全局变量 todo
const todo = new Todo()
