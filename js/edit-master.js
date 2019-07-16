function loadFileIntoTextarea(){
    var urlData = new URL(window.location.href);
    var file = urlData.searchParams.get("file");
    
    var fileHidden = document.getElementById('file-hidden-text');
    var txtArea = document.getElementById('inputTextToSave');
    document.getElementById('title-edit').innerHTML = "dispatcher configuration";
    document.getElementById('subtitle-edit').innerHTML = "Master file";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/editFile/'+file;
        
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
            fileHidden.value = response.data.fileName;
        }
        return true;
    })
    .catch(function (error) {
        return false;
    });
}
// loadFileIntoTextarea();

function saveFileChanged() {
    var fileHidden = document.getElementById('file-hidden-text');
    var fileContent = document.getElementById('inputTextToSave');

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var masterURL = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/savefile';
    
    var masterDataEdit = {}
    masterDataEdit["file"] = fileHidden.value;
    masterDataEdit["content"] = fileContent.value;
    var masterJSON = JSON.stringify(masterDataEdit);
    axios({
        method: 'put',
        url: masterURL,
        timeout: 30000,
        data: masterJSON
    })
    .then(function (response) {
        window.history.back();
        return true;
    })
    .catch(function (error) {
        return false;
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