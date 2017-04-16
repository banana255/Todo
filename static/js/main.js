const __main = function() {
    // 全局变量 todo
    window.todo = new Todo()

    // 先验证账户，验证通过则自动加载 __mainTodo()
    __mainLogin()

    // 头部逻辑放置处
    __mainHeader()

}
