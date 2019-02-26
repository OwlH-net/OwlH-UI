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

    ip = "192.168.14.13";
    port = "50001";
    var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/loadfile/'+uuid+'/'+file;
        
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

    ip = "192.168.14.13";
    port = "50001";
    var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/savefile';
    
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
