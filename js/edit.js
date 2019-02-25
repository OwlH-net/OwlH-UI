function loadFileIntoTextarea(){
    var uuidHidden = document.getElementById('uuid-hidden-text');
    var fileHidden = document.getElementById('file-hidden-text');
    uuidHidden.style.display = "none";
    fileHidden.style.display = "none";

    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var file = urlData.searchParams.get("file");
    
    var txtArea = document.getElementById('inputTextToSave');

    ip = "192.168.14.13";
    port = "50001";
    var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/loadfile/'+uuid+'/'+file;
    console.log(nodeurl);
    
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        console.log(response);
        txtArea.innerHTML = response.data.content;
        uuidHidden.innerHTML = response.data.nodeUUID;
        fileName.innerHTML = response.data.file;
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

    console.log(uuidHidden+" __ __ __ "+fileHidden);

    ip = "192.168.14.13";
    port = "50001";
    var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/savefile';
    
    var nodejson = {}
    nodejson["uuid"] = uuidHidden;
    nodejson["file"] = fileHidden;
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



// function saveFileChanged() {
//     var modifiedTxtArea = document.getElementById('inputTextToSave');
//     ip = "192.168.14.15";
//     port = "50002";
//     var nodeurl = 'https://'+ ip + ':' + port + '/node/suricata/save';
    
//     var nodejson = {}
//     nodejson["data"] = modifiedTxtArea.value;
//     var nodeJSON = JSON.stringify(nodejson);
//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         data: nodeJSON
//     })
//     .then(function (response) {
//         window.history.back();
//         return true;
//     })
//     .catch(function (error) {
//         return false;
//     });
// }