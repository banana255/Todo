const initMain = function() {
    // 全局变量 todo
    window.todo = new Todo()

    log('有配置环境')
    // TODO: 配置 nunjucks 过滤器
    let env = new nunjucks.Environment();
    env.addFilter('showTime', function(str) {
        return new Date(str).toLocaleString()
    })
}

const __main = function() {
    initMain()

    // 先验证账户，验证通过则自动加载 __mainTodo()
    __mainLogin()

    // 头部逻辑放置处
    __mainHeader()
}
