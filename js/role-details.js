function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}

        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();

        var urlData = new URL(window.location.href);
        var RoleID = urlData.searchParams.get("id");
        var RoleName = urlData.searchParams.get("role");

        document.getElementById('title-banner').innerHTML = "Role "+RoleName;

        GetAllPermissions(RoleID); 
    });
}
var payload = "";
loadJSONdata();

 function GetAllPermissions(uuid){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getPermissionsByRole/'+uuid;

     axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        console.log(response.data);
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var existGroups = false;
            //get groups
            var html = "";
            var groups = [];
            for(id in response.data){
                if(!groups.includes(response.data[id]["permissionGroup"])){
                    groups.push(response.data[id]["permissionGroup"])
                }
            }            
           
            
            //list permissions for every group
            for(group in groups){
                existGroups=true;
                html = html + '<div>'+
                '<h3>'+groups[group]+'</h3>';
                for(id in response.data){
                    if(response.data[id]["permissionGroup"] == groups[group]){
                        html = html + '<h6>'+response.data[id]["groupDesc"]+'</h6>';
                        break;
                    }
                }
                html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>' +
                    '<tr>'+
                        '<th style="width: 30%">Permission name</th>' +
                        '<th>Permission description</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
                for(id in response.data){
                    if(response.data[id]["permissionGroup"] == groups[group]){
                        html = html + '<tr>'+
                            '<td>'+id+'</td>'+
                            '<td>'+response.data[id]["desc"]+'</td>'+
                        '</tr>';
                    }
                }
                html = html + '</tbody>'+
                '</table></div>';
            }

            if(!existGroups){
                document.getElementById('role-list-table').innerHTML = '<h3 class="text-center" style="color: red;">This role has no groups assigned.</h3>';
            }else{
                document.getElementById('role-list-table').innerHTML = html;
            }
        }
        return true;
    })
    .catch(function (error) {
        document.getElementById('progressBar-create').style.display = "block";
        document.getElementById('progressBar-create-div').style.display = "block";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all roles: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    })
}
