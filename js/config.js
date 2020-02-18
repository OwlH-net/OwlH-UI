function loadFileIntoTextarea(){
    var fileContent = document.getElementById('inputTextUI');  
    $.getJSON('../conf/ui.conf', function (data) {
        // fileContent.value = JSON.stringify(data, null, "\t");
        fileContent.value = JSON.stringify(data, null, "    ");
    });
}

function saveFileChanged() {
    var fileContent = document.getElementById('inputTextUI').value;
    // var nodeurl = '../conf/ui.conf';    
    var nodeurl = 'ui.php';    

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user,'uuid': payload.uuid},
        data: fileContent
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            location.reload(true);       
        }
        
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function adminUsers() {
    document.location.href='https://'+location.hostname+'/users.html';
}

function closeFileChanged(){
    window.history.back();
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+location.hostname+'/login.html';
        }
        try {
            payload = JSON.parse(atob(tokens[1]));
            if(payload.user == "admin"){                
                $("#admin-users-btn").show();
            }
        }
        catch(err) {console.log(err); document.cookie = ""; document.location.href='https://'+location.hostname+'/login.html';}
                 
        //login button
        document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        loadFileIntoTextarea();
        checkStatus();
    });
}
var payload = "";
loadJSONdata();