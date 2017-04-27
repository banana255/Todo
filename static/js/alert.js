const alertGua = function(type, data) {
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
                    <span class="altet-strong">{{ name }}</span>
                </div>
                <div class="">
                    创建时间:
                    <span class="altet-strong">{{ createdTime }}</span>
                </div>
                <div class="">
                    组长:
                    <span class="altet-strong">{{ captain }}</span>
                </div>
                <div class="">
                    组员:
                    <span class="altet-strong">{{ users }}</span>
                </div>
            </form>
        </div>
        <div class="alert-footer">
            <button class="proj-delete alert-button btn btn-default">删除工程</button>
            <button class="proj-edit-name alert-button btn btn-default">修改工程名</button>
            <button class="proj-edit-captain alert-button btn btn-default">修改组长</button>
            <button class="proj-edit-users alert-button btn btn-default">修改组员</button>
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
            if (users[0] == '') {
                users = []
            }
            let item = {
                name: name,
                users: users,
            }
            window.todo.pAdd(item, function(res){
                let r = JSON.parse(res)
                // log('new project res', r)
                window.todo.projectList.push(r)
                insertProject(r)
                e('.alert-gua').remove()
            })
        })
    } else if (type == 'newTodo') {
        e('body').insertAdjacentHTML('beforeend', newTodo)

    } else if (type == 'projectContain') {
        console.log('pro header data', data);
        let item = data.pItem
        let time = {
            createdTime: new Date(item["created_time"]*1000).toLocaleString()
        }
        let html = nunjucks.renderString(projectContain, Object.assign(item, time) )
        e('body').insertAdjacentHTML('beforeend', html)
        const renewData = function(callback) {
            window.todo.pAll(function(res){
                var i = JSON.parse(res)
                window.todo.projectList = i
                // data.pDiv.remove()
                // swal("已删除!", "该工程已成功删除.", "success");
                callback()
                e('.alert-gua').remove()
            })
        }
        e('.proj-delete').addEventListener('click', function(event){
            log('click proj-delete')
            swal({
                title: "请三思?",
                text: "确认删除该工程?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是的, 删除!",
                cancelButtonText: "不, 取消删除!",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            },
            function(isConfirm){
                if (isConfirm) {
                    window.todo.pDele({id: item.id}, function(res){
                        var i = JSON.parse(res)
                        // log('delete proj', i)
                        // window.todo.pAll(function(res){
                        //     var i = JSON.parse(res)
                        //     window.todo.projectList = i
                        //     data.pDiv.remove()
                        //     swal("已删除!", "该工程已成功删除.", "success");
                        //     e('.alert-gua').remove()
                        // })
                        renewData(function(){
                            data.pDiv.remove()
                            swal("已删除!", "该工程已成功删除.", "success");
                        })
                    })
                } else {
                    swal("取消删除", "该工程没删除 :)", "error");
                }
            })
        })
        e('.proj-edit-name').addEventListener('click', function(){
            swal({
                title: "修改工程名",
                text: "",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "请输入新工程名"
            },
            function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("请输入新工程名!");
                    return false
                }
                let item = {
                    name: inputValue,
                    id: data.pId,
                }
                window.todo.pUpdate(item, function(res){
                    // console.log(res)
                    let r = JSON.parse(res)
                    item.task = r.task
                    renewData(function(){
                        swal("成功修改!", "新工程名: " + inputValue, "success");
                        data.pDiv.querySelector('.project-name').innerHTML = inputValue
                    })
                })
            });
        })
        e('.proj-edit-captain').addEventListener('click', function(){
            swal({
                title: "修改组长",
                text: "",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "请输入新组长"
            },
            function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("请输入新组长!");
                    return false
                }
                let item = {
                    captain: inputValue,
                    id: data.pId,
                }
                window.todo.pUpdate(item, function(res){
                    // console.log(res)
                    let r = JSON.parse(res)
                    renewData(function(){
                        swal("成功修改!", "新组长: " + inputValue, "success");
                    })
                })
            });
        })
        e('.proj-edit-users').addEventListener('click', function(){
            swal({
                title: "修改组员",
                text: "请输入新组员",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "多成员以 / 分隔"
            },
            function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("请输入新组员!");
                    return false
                }
                let item = {
                    users: inputValue.split('/'),
                    id: data.pId,
                }
                window.todo.pUpdate(item, function(res){
                    // console.log(res)
                    let r = JSON.parse(res)
                    renewData(function(){
                        swal("成功修改!", "新的组员列表: " + inputValue, "success");
                    })
                })
            });
        })
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
