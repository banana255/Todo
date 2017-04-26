const alertGua = function(type='newProject') {
    /**
     * type: newProject  newTodo projectComtain todoContain
     */
    let newProjectHtml = `
    <div class="alert-gua">
        <div class="alert-header">
            <h3>新建工程</h3>
        </div>
        <div class="alert-container">
            <form class="">
                <div class="">
                    <input class='alert-input' placeholder="请输入工程名">
                </div>
                <div class="">
                    <input class='alert-input' placeholder="请添加组员(/分隔)">
                </div>
            </form>

        </div>
        <div class="alert-footer">
            <button class="btn btn-default">取消</button>
            <button class="btn btn-default">提交</button>
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
            <button class="btn btn-default">取消</button>
            <button class="btn btn-default">提交</button>
        </div>
    </div>
    `

    let procjectContain = `

    `

    e('body').innerHTML += ''
}
