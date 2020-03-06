function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
    });
}
loadJSONdata();

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-login').href = nodeurl;
}

function Login() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/master/login';

    var jsonLogin = {}
    jsonLogin["user"] = document.getElementById('owlh-input-user').value;
    jsonLogin["password"] = document.getElementById('owlh-input-psswd').value;
    var userLogin = JSON.stringify(jsonLogin);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        withCredentials: true,
        data: userLogin
    })
    .then(function (response) {
        if(response.data.ack != "false"){
            document.cookie = response.data;            
            document.location.href='https://'+location.hostname;
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Incorrect username or password.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
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
        document.cookie = "";
    });   
}