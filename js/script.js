$(document).ready(function () {
    login();
    createTodo();show();logout();

});
// ===========Global Constant=============
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1700,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
//   ===============================
function login() {
    $("#loginBtn").click(function (e) {
        e.preventDefault();
        $("#LoginModal").modal('show');
        $("#submitloginBtn").click(function (e) {
            e.preventDefault();
            var email = $("#email").val().trim();
            if (email == '') {
                alert("Chưa nhập email");
            } else {
                $.ajax({
                    type: "post",
                    url: "https://students.trungthanhweb.com/api/checkLoginhtml",
                    data: {
                        // Name : Giá trị 
                        email: email
                    },
                    dataType: "JSON",
                    success: function (res) {
                        if (res.check == true) {
                            console.log(res.apitoken);
                            localStorage.setItem('token', res.apitoken);
                            Toast.fire({
                                icon: 'success',
                                title: 'Đăng nhập thành công'
                            }).then(()=>{
                                window.location.reload();
                            })
                           
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: 'Đăng nhập không thành công'
                            })
                        }
                    }
                });
            }
        });
    });
}
//==========================
function logout(){
    $("#logoutBtn").click(function (e) { 
        e.preventDefault();
        if(localStorage.getItem('token')&&localStorage.getItem('token')!=null){
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'success',
                title: 'Bye bye !!'
              }).then(()=>{
                window.location.reload();
              })
        }
    });
}
//==========================
function createTodo(){
    if(!localStorage.getItem('token')||localStorage.getItem('token')==null){
        $("#addTodoBtn").attr('disabled','disabled');
    }
    $("#addTodoBtn").click(function (e) { 
        e.preventDefault();
        var todo =$("#todo").val().trim();
        if(todo==''){
            Toast.fire({
            icon: 'error',
            title: 'Bạn chưa nhập nội dung'
            })
        }else{
            $.ajax({
                type: "post",
                url: "https://students.trungthanhweb.com/api/todo",
                data: {
                    apitoken:localStorage.getItem('token'),
                    todo:todo
                },
                dataType: "JSON",
                success: function (res) {
                    if(res.check==true){
                            Toast.fire({
                            icon: 'success',
                            title: 'Đã thêm thành công'
                            }).then(()=>{
                                window.location.reload();
                            })
                    }
                    if(res.msg.apitoken){
                            Toast.fire({
                            icon: 'error',
                            title: 'API token chưa đúng'
                            })
                    }else if(res.msg.todo){
                
                            Toast.fire({
                            icon: 'error',
                            title: 'Thiếu todo'
                            })
                    }
                }
            });
        }
    });
}
//==========================
function finish(){
    $('.finish').change(function (e) { 
        e.preventDefault();
        var id =$(this).attr('data-id');
        Swal.fire({
            icon:'question',
            text: 'Hoàn thành task ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Đúng',
            denyButtonText: `Không`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $.ajax({
                    type: "post",
                    url: "https://students.trungthanhweb.com/api/statusTodo",
                    data: {
                        apitoken:localStorage.getItem('token'),
                        id:id,
                    },
                    dataType: "JSON",
                    success: function (res) {
                        if(res.check==true){
                            Toast.fire({
                                icon: 'success',
                                title: 'Đã hoàn thành task'
                              }).then(()=>{
                                window.location.reload();
                              })
                        }
                        if(res.msg.id){
                            Toast.fire({
                                icon: 'error',
                                title: res.msg.id
                              })
                        }
                    }
                });
            } else if (result.isDenied) {
            }
          })
      
    });
}
//==========================
function show(){
    $("#todoTable").hide();
    $("#logoutBtn").hide();
    if(localStorage.getItem('token')&&localStorage.getItem('token')!=null){
        $("#logoutBtn").show();
        $.ajax({
            type: "get",
            url: "https://students.trungthanhweb.com/api/todo",
            data: {
                apitoken:localStorage.getItem('token')
            },
            dataType: "JSON",
            success: function (res) {
                // console.log(res.todo);
                const todo=res.todo;
                if(todo.length>0){
                    var str=``;
                    var count=1;
                    todo.forEach((el,key)=>{
                        if(el.status==0){
                            str+=`
                            <tr>
                            <th scope="row">`+(count++)+`</th>
                            <td><p class="todo">`+el.note+`</p></td>
                            <td><input type="checkbox" data-id="`+el.id+`" class="finish"></td>
                            <td>
                                <div class="d-flex">
                                    <button class="btn-sm btn-warning editTodoBtn" data-id="`+el.id+`" data-value="`+el.note+`" data-key=`+key+`>Sửa</button>
                                    <button class="btn-sm btn-danger ms-3 deletebtn" data-id="`+el.id+`" >Xóa</button>
                                </div>
                            </td>
                          </tr>
                            `;
                        }else{
                            str+=`
                            <tr>
                            <th scope="row">`+(count++)+`</th>
                            <td><p class="todo">`+el.note+`</p></td>
                            <td><input type="checkbox" data-id="`+el.id+`" disabled checked class="finish"></td>
                            <td>
                                <div class="d-flex">
                                    <button class="btn-sm btn-warning editTodoBtn" data-id="`+el.id+`" disabled data-value="`+el.note+`" data-key=`+key+`>Sửa</button>
                                    <button class="btn-sm btn-danger ms-3 deletebtn" data-id="`+el.id+`" >Xóa</button>
                                </div>
                            </td>
                          </tr>
                            `;
                        }
                       
                    });
                    $('#result').html(str);
                    $("#todoTable").show();
                }
                deleteTodo();editTodo();finish();
            }
        });
    }
}
function deleteTodo(){
    $('.deletebtn').click(function (e) { 
        e.preventDefault();
        // attribute
        var id =$(this).attr('data-id');
        Swal.fire({
            icon:'question',
            text: 'Muốn xóa không ? Chắc xóa chưa ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Đúng',
            denyButtonText: `Không`,
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                type: "post",
                url: "https://students.trungthanhweb.com/api/deletetodo",
                data: {
                    id:id,
                    apitoken:localStorage.getItem('token')
                },
                dataType: "JSON",
                success: function (res) {
                    if(res.check==true){
                        Toast.fire({
                            icon: 'success',
                            title: 'Xóa thành công'
                          }).then(()=>{
                            window.location.reload();
                          })
                    }else if(res.check==false){
                       if(res.msg.apitoken){                          
                          Toast.fire({
                            icon: 'error',
                            title: res.msg.apitoken
                          })
                       }else if(res.msg.id){
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.id
                          })
                          
                         
                       }
                    }
                }
            });
        } else if (result.isDenied) {
            
        }
        })
    });
}
function editTodo(){
    $(".editTodoBtn").click(function (e) { 
        e.preventDefault();
        // var key = $(this).attr('data-key');
        // const todo = document.querySelectorAll('.todo');
        // const todo= $(".todo");
        // var old=todo[key].innerText;
        var id=$(this).attr('data-id');
        var old = $(this).attr('data-value');
        $("#editTodo").val(old);
        $("#editModal").modal('show');
        $('#editBtn').click(function (e) { 
            e.preventDefault();
            var todo = $("#editTodo").val().trim();
            if(todo==''){
                Toast.fire({
                    icon: 'error',
                    title: 'Chưa nhập todo'
                  })
            }else if(todo==old){
                Toast.fire({
                    icon: 'error',
                    title: 'Chưa chỉnh sửa !'
                  })
            }else{
                $.ajax({
                    type: "post",
                    url: "https://students.trungthanhweb.com/api/updatetodo",
                    data: {
                        apitoken:localStorage.getItem('token'),
                        todo:todo,
                        id:id,

                    },
                    dataType: "JSON",
                    success: function (res) {
                        if(res.check==true){
                            Toast.fire({
                                icon: 'success',
                                title: 'Đã sửa thành công !'
                              }).then(()=>{
                                window.location.reload();
                              })
                        }
                        if(res.msg.apitoken){
                            Toast.fire({
                                icon: 'error',
                                title: res.msg.apitoken
                              })
                        }else if(res.msg.todo){
                            Toast.fire({
                                icon: 'error',
                                title: res.msg.todo
                              })
                        }else if(res.msg.id){
                            Toast.fire({
                                icon: 'error',
                                title: res.msg.id
                              })
                        }
                    }
                });
            }
        });
    });
}