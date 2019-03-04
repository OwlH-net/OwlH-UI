function loadFileIntoTextarea(){
    var uuidHidden = document.getElementById('uuid-hidden-text');
    var fileHidden = document.getElementById('file-hidden-text');

    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var file = urlData.searchParams.get("file");
    var node = urlData.searchParams.get("node");
    
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
        txtArea.innerHTML = response.data.fileContent;
        uuidHidden.value = response.data.nodeUUID;
        fileHidden.value = response.data.fileName;
        return true;
    })
    .catch(function (error) {
        return false;
    });
}
loadFileIntoTextarea();

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
    console.log("Loading JSON");
    $.getJSON('../conf/ui.conf', function(data) {
      console.log("getJSON");
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadFileIntoTextarea();   
    });
  }
  loadJSONdata();