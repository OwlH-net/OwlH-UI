
function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
    });
}
loadJSONdata();

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
        data: userLogin
    })
        .then(function (response) {
        })
        .catch(function (error) {
        });   
}