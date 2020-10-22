function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        if(data.master.ip == '<MASTERIP>' || data.master.ip == ""){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Master IP Error!</strong> Please, change your master IP at /var/www/owlh/conf/ui.conf.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        
        //Check default credentials
        CheckDefaultCredentials();
            
    });
}
loadJSONdata();

function CheckDefaultCredentials(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/home')
    .then(function (response) {
        if (response.data.defaults == "true"){
            document.getElementById("default-user-credentials").style.display = "block";
        }
    })
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-login').href = nodeurl;
}

function Login() {
    var progressBar = document.getElementById('progressBar-login');
    var progressBarDiv = document.getElementById('progressBar-login-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/master/login';

    var jsonLogin = {};
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
        console.log(response.data);
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        if(response.data.ack != "false"){
            document.cookie = response.data;            
            document.location.href='index.html';
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Login Error!</strong> Incorrect username or password.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }
    })
    .catch(function (error) {
        document.getElementById('check-status-login').style.display = 'block';
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Login Error!</strong> Master connection error. Please check the Master API connection.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        document.cookie = "";
    });   
}
