function loadFileIntoTextarea(){
    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var file = urlData.searchParams.get("file");
    var node = urlData.searchParams.get("node");

    var uuidHidden = document.getElementById('uuid-hidden-text');
    var fileHidden = document.getElementById('file-hidden-text');
    var txtArea = document.getElementById('inputTextToSave');
    var title = document.getElementById('title-edit');
    var subtitle = document.getElementById('subtitle-edit');

    title.innerHTML = "File: "+file;
    subtitle.innerHTML = "Node: "+node;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadfile/'+uuid+'/'+file;
        
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            return '<div style="text-align:center"><h3 style="color:red;">Error retrieving ruleset ' + ruleName + '</h3></div>';
        }else{
            txtArea.innerHTML = response.data.fileContent;
            if(uuid == "local") {uuidHidden.value = "local"} else {uuidHidden.value = response.data.nodeUUID;}
            fileHidden.value = response.data.fileName;
        }
    })
    .catch(function (error) {
    });
     
}

function saveFileChanged() {
    var uuidHidden = document.getElementById('uuid-hidden-text');
    var fileHidden = document.getElementById('file-hidden-text');
    var fileContent = document.getElementById('inputTextToSave');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/savefile';
    
    var nodejson = {}
    nodejson["uuid"] = uuidHidden.value;
    nodejson["file"] = fileHidden.value;
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
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadTitleJSONdata();
      loadFileIntoTextarea();   
    });
  }
  loadJSONdata();