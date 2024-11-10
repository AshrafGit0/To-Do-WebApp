var taskNum;
var TaskId;
function LoadPage(pageName) {
    $.ajax({
        url: `../../../Client/public/${pageName}`,
        method: "get",
        success: (response) => {
            $("section").show();
            $("section").html(response);
            $("#BtnContainer").hide();
        }
    })

}

function LoadMain() {
    $("#main").html("");
    taskNum = 0;
    $.ajax({
        method: "get",
        url: `http://127.0.0.1:6600/get-tasks/${$.cookie('Userid')}`,
        success: (tasks) => {
            tasks.map(task => {
                $(
                    `

                    <div class="alert alert-success ">
                        <h4>${taskNum += 1}.${task.Title}</h4>
                        <div>
                            <p>${task.Description}</p>
                        </div>
                         <div class='mb-2'>
                            <span class='bi bi-calendar-date ms-2'></span>
                            <span>${task.Date.toString()}</span>
                         </div>   
                         <button class='btn btn-warning bi bi-pen-fill' data-bs-target='#EditTask-modal' data-bs-toggle='modal' value='${task.AppointmentId}' id='btn-EditTask'>
                         Edit Task
                         </button>
                         <button class='btn btn-danger bi bi-trash-fill' value=${task.AppointmentId} id='btn-DeleteTask'>Delete Task</button>
                         </div>
                         
                         `
                ).appendTo("#main");
            })
        }
    })
    $("#Signin-Form").hide();
    $("#SignoutContainer").removeClass("d-none");
    $("#Username").html($.cookie("UserName"));
}
$(() => {
    if ($.cookie("Userid")) {
        LoadPage(`dashboard.html`);
        LoadMain();
    } else {
        LoadPage('signin.html')
    }
    $.ajax({
        method: "get",
        url: "http://127.0.0.1:6600/get-tasks",
        success: (tasks) => {
            TaskId = tasks.length + 1;
            $("#Task-Id").val(TaskId);

        }
    });
    $(document).on("click", "#BtnRegister", () => {
        LoadPage('register.html');
    })
    $(document).on("click", "#BtnSignin", () => {
        LoadPage('signin.html');
    })
    $(document).on("click", "#BtnFormCancel", () => {
        $("#BtnContainer").show();
        $("section").hide();
    })
    $(document).on("click", "#BtnSignout", () => {
        $.removeCookie("Userid");
        $.removeCookie("UserPwd");
        location.href = "./index.html";
    })
    $(document).on("click", "#BtnFormSignin", () => {
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:6600/get-users`,
            success: (users) => {
                var user = users.find(user => user.UserId === $("#UserId").val());
                if (user.Password === $("#Password").val()) {
                    $.cookie("Userid", user.UserId, { expire: 365 });
                    $.cookie("UserName", user.UserName, { expire: 365 });
                    if ($.cookie("Userid"))
                        LoadPage(`dashboard.html`);
                    LoadMain();


                } else {
                    alert('Invalid Password')
                }
            }
        })
    })
    $(document).on("click", "#btn-Add-Task", () => {
        var task = {
            AppointmentId: $("#Task-Id").val(),
            Title: $("#Task-Title").val(),
            Description: $("#Task-Description").val(),
            Date: ($("#Task-Date").val()),
            UserId: $.cookie('Userid')
        }
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:6600/add-task",
            data: task,
            success: () => {
                console.log('Task Added Successfully');
                LoadMain();
            }

        })
    })
    $(document).on("click", "#BtnFormRegister", () => {
        var RegisterUser = {
            UserId: $("#rgstUserId").val(),
            UserName: $("#rgstUserName").val(),
            Password: $("#rgstPassword").val(),
            Email: $("#rgstEmail").val(),
            Mobile: $("#rgstMobile").val()
        }
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:6600/register-user",
            data: RegisterUser,
            success: () => {
                LoadPage('signin.html');
                console.log('User Registered Successfully');
            }
        })
    })
    $(document).on("click", "#btn-EditTask", (e) => {
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:6600/get-appointments/${e.target.value}`,
            success: (task) => {
                var editDatestr = task.Date;
                $("#Edit-TaskId").val(task.AppointmentId);
                $("#Edit-TaskTitle").val(task.Title);
                $("#Edit-TaskDescription").val(task.Description);
                $("#Edit-TaskDate").val(editDatestr.substring(editDatestr.indexOf("T"), 0));
                LoadMain();
            },
            error: (err) => {
                console.log(err);
            }
        })
    })
    // Deleting Tasks

    $(document).on("click", "#btn-DeleteTask", (e) => {
        $.ajax({
            method: "delete",
            url: `http://127.0.0.1:6600/delete-task/${e.target.value}`,
            success: () => {
                LoadMain();
            }
        })
    })
    // Updating Existing task
    $(document).on("click", "#btn-Update-Task", () => {
        var updateTask = {
            AppointmentId: $("#Edit-TaskId").val(),
            Title: $("#Edit-TaskTitle").val(),
            Description: $("#Edit-TaskDescription").val(),
            Date: ($("#Edit-TaskDate").val()),
            UserId: $.cookie('Userid')
        }
        $.ajax({
            method: "put",
            url: `http://127.0.0.1:6600/update-task/${$("#Edit-TaskId").val()}`,
            data: updateTask,
            success: () => {
                LoadMain();
            }
        })
    })
})
