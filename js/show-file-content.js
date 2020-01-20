function loadFileIntoTextarea(){
    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var path = urlData.searchParams.get("path");
    var type = urlData.searchParams.get("type");

    var txtArea = document.getElementById('inputTextToSave');
    var title = document.getElementById('title-edit');
    var subtitle = document.getElementById('subtitle-edit');

    title.innerHTML = "File: "+path;
    subtitle.innerHTML = type;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/group/getClusterFileContent/'+uuid;
        
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            return '<div style="text-align:center"><h3 style="color:red;">Error retrieving file content...</h3></div>';
        }else{
            for(x in response.data){
                txtArea.innerHTML = response.data[x];
            }
        }
    })
    .catch(function (error) {
    });
     
}

function saveFileChanged() {
    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var path = urlData.searchParams.get("path");
    var fileContent = document.getElementById('inputTextToSave');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/group/saveClusterFileContent';
    
    var nodejson = {}
    nodejson["uuid"] = uuid;
    nodejson["path"] = path;
    nodejson["content"] = fileContent.value;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Error saving file content: '+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            window.history.back();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Error saving file content: '+error+''+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function closeFileChanged(){
    window.history.back();
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+data.master.ip+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+data.master.ip+'/login.html';}
                 
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        loadFileIntoTextarea();   
        });
  }
  var payload = "";
  loadJSONdata();