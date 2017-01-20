const bindTouchExit = function() {
    var exit = e('.login-exit')
    exit.addEventListener('click', function(event){
        log('touches')
        exit.classList.add('login-exit-touches')
        setTimeout(exit.classList.remove('login-exit-touches'), 100)
        deleKey()
        location.reload()
    })
}

const bindEventsExit = function() {
    bindTouchExit()
}

const __mainHeader = function() {
    bindEventsExit()
}
