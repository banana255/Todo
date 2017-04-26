const alertGua = function(type) {
    /**
     * type: newProject  newTodo projectContain todoContain
     */
    let newProject = `
    <div class="alert-gua">
        <div class="alert-header">
            <h3>新建工程</h3>
        </div>
        <div class="alert-container">
            <form class="">
                <div class="">
                    <input class='alert-title-name alert-input' placeholder="请输入工程名">
                </div>
                <div class="">
                    <input class='alert-users alert-input' placeholder="请添加组员(/分隔, 默认为您自己)">
                </div>
            </form>

        </div>
        <div class="alert-footer">
            <button class="alert-cancel alert-button btn btn-default">取消</button>
            <button class="alert-commit alert-button btn btn-default">提交</button>
        </div>
    </div>
    `

    let newTodo = `
    <div class="alert-gua">
        <div class="alert-header">
            <h3>新建任务</h3>
        </div>
        <div class="alert-container">
            <form class="">
                <div class="">
                    <input class='alert-input' placeholder="请输入任务名">
                </div>
                <div class="">
                    <label class="alert-input">
                        提醒时间:
                        <input class='alert-input-short' type="datetime-local">
                    </label>
                </div>
            </form>
        </div>
        <div class="alert-footer">
            <button class="alert-cancel alert-button btn btn-default">取消</button>
            <button class="alert-commit alert-button btn btn-default">提交</button>
        </div>
    </div>
    `

    let projectContain = `
    <div class="alert-gua">
        <div class="alert-header">
            <button class="alert-cancel alert-back btn btn-default glyphicon glyphicon-remove"></button>
            <span class="alert-title">工程详情</span>
        </div>
        <div class="alert-container">
            <form class="">
                <div class="">
                    工程名:
                    <span class="altet-strong">毕业设计</span>
                </div>
                <div class="">
                    创建时间:
                    <span class="altet-strong">2017-4-17</span>
                </div>
                <div class="">
                    组长:
                    <span class="altet-strong">888</span>
                </div>
                <div class="">
                    组员:
                    <span class="altet-strong">888 & 999</span>
                </div>
            </form>
        </div>
        <div class="alert-footer">
            <button class="alert-button btn btn-default">删除工程</button>
            <button class="alert-button btn btn-default">修改工程名</button>
            <button class="alert-button btn btn-default">修改组长</button>
            <button class="alert-button btn btn-default">修改组员</button>
        </div>

    </div>
    `

    let todoContain = `
    <div class="alert-gua">
        <div class="alert-header">
            <button class="alert-cancel alert-back btn btn-default glyphicon glyphicon-remove"></button>
            <span class="alert-title">任务详情</span>
        </div>
        <div class="alert-container">
            <form class="">
                <div class="">
                    任务名:
                    <span class="altet-strong">开会</span>
                </div>
                <div class="">
                    提醒时间:
                    <span class="altet-strong">2017-4-17 15:00</span>
                </div>
                <div class="alert-comment">
                    评论:
                    <div class="">
                        <span class="">888:</span>
                        <span>请大家准时开会</span>
                    </div>
                </div>
            </form>
        </div>
        <div class="alert-footer">
            <button class="alert-button btn btn-default">添加评论</button>
        </div>
    </div>
    `

    if (type == "newProject") {
        e('body').insertAdjacentHTML('beforeend', newProject)
        e('.alert-commit').addEventListener('click', event => {
            console.log('project 点击提交')
            let name = e('.alert-title-name').value
            let users = e('.alert-users').value.split('/')
            if (!name.length) {
                swal("请输入工程名")
                return
            }
            let item = {
                name: name,
                user_id: users,
            }
            // TODO: 未完待续
            window.todo.pAdd(item, function(res){
                let r = JSON.parse(res)
                log('new project res', r)
                window.todo.projectList.push(r)
                todo.projectList.push(r)
                insertProject(r)
            })
        })
    } else if (type == 'newTodo') {
        e('body').insertAdjacentHTML('beforeend', newTodo)

    } else if (type == 'projectContain') {
        e('body').insertAdjacentHTML('beforeend', projectContain)

    } else if (type == 'todoContain') {
        e('body').insertAdjacentHTML('beforeend', todoContain)

    } else {
        return
    }



    e('.alert-cancel').addEventListener('click', event => {
        let t = event.target
        // console.log('click alerst-cancel', t);
        e('.alert-gua').remove()
    })

}
