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
        data: fileContent
    })
    .then(function (response) {
        location.reload(true);        
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

function closeFileChanged(){
    window.history.back();
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        loadFileIntoTextarea();
        checkStatus();
    });
}
loadJSONdata();