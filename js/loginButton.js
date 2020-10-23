
function modalChangePasswordLogin(){
    //get user uuid
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title">Change '+name+' password</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
            
            '<div class="modal-body">'+ 
                '<p>Insert new password:</p>'+
                '<input type="password" class="form-control" id="user-change-password" placeholder="new password..."><br>'+
                '<p>Verify new password:</p>'+
                '<input type="password" class="form-control" id="user-verify-password" placeholder="Verify password..."><br>'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" id="user-password-btn">Modify</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#user-password-btn').click(function(){ ChangePasswordLogin();});

}

function ChangePasswordLogin(){
    $('#modal-window').modal('hide');
    var payload
    var tokens = document.cookie.split(".");
    payload = JSON.parse(atob(tokens[1]));

    //check for whitespaces
    if(document.getElementById('user-change-password').value.trim() == "" || document.getElementById('user-verify-password').value.trim() == ""){
        if(document.getElementById('user-change-password').value.trim() == ""){
            $('#user-change-password').css('border', '2px solid red');
            $('#user-change-password').attr("placeholder", "Please, insert new password"); 
        }else{
            $('#user-change-password').css('border', '2px solid #ced4da');
        }
        if(document.getElementById('user-verify-password').value.trim() == ""){
            $('#user-verify-password').css('border', '2px solid red');
            $('#user-verify-password').attr("placeholder", "Please, verify new password"); 
        }else{
            $('#user-verify-password').css('border', '2px solid #ced4da');
        }
    }else if(document.getElementById('user-change-password').value.trim() != document.getElementById('user-verify-password').value.trim()){
        $('#user-verify-password').val('');
        $('#user-verify-password').css('border', '2px solid red');
        $('#user-verify-password').attr("placeholder", "Passwords are not equals"); 
    }else{
        $('#modal-users').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/changePassword';

        var jsonDeployService = {}
        jsonDeployService["user"] = document.getElementById('loger-user-name').value.trim();
        jsonDeployService["pass"] = document.getElementById('user-verify-password').value.trim();
        var dataJSON = JSON.stringify(jsonDeployService);
    
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Change password: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Password changed succcessfully!'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change password: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function Logout(){
    document.cookie = "";
    document.location.href='login.html';
}

function PrivilegesMessage(){
    $('html,body').scrollTop(0);
    var alert = document.getElementById('floating-alert');
    alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
        '<strong>Error!</strong> You don\'t have enough user permissions.'+
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
            '<span aria-hidden="true">&times;</span>'+
        '</button>'+
    '</div>';
    setTimeout(function() {$(".alert").alert('close')}, 30000);
}