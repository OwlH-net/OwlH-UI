function loadFileIntoTextarea(){
    var urlData = new URL(window.location.href);
    var file = urlData.searchParams.get("file");
    
    var fileHidden = document.getElementById('file-hidden-text');
    var txtArea = document.getElementById('inputTextToSave');
    document.getElementById('title-edit').innerHTML = file;
    document.getElementById('subtitle-edit').innerHTML = "Master file";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    if(file == "nodeConfig" || file == "networksConfig"){
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/editPathFile/'+file;
    }else{
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/editFile/'+file;
    }
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            console.log(response.data);
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error: </strong>'+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
            return '<div style="text-align:center"><h3 style="color:red;">Error retrieving ruleset ' + ruleName + '</h3></div>';
        }else{
            txtArea.innerHTML = response.data.fileContent;
            fileHidden.value = response.data.fileName;
        }
    })
    .catch(function (error) {
    });
}

function saveFileChanged() {
    var urlData = new URL(window.location.href);
    var file = urlData.searchParams.get("file");
    var fileHidden = document.getElementById('file-hidden-text');
    var fileContent = document.getElementById('inputTextToSave');

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    if(file == "nodeConfig" || file == "networksConfig"){
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/savefilePath';
    }else{
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/editFile';
    }
    
    var masterDataEdit = {}
    masterDataEdit["file"] = fileHidden.value;
    masterDataEdit["content"] = fileContent.value;
    var masterJSON = JSON.stringify(masterDataEdit);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: masterJSON
    })
    .then(function (response) {
        window.history.back();
    })
    .catch(function (error) {
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