function loadFileIntoTextarea(){
    /*
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("ruleset");
    */
    var txtArea = document.getElementById('inputTextToSave');

    ip = "192.168.14.15";
    port = "50002";
    var nodeurl = 'https://'+ ip + ':' + port + '/node/suricata/send';
    
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        console.log(response.data);
        txtArea.innerHTML = response.data;
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function saveFileChanged() {
    var modifiedTxtArea = document.getElementById('inputTextToSave');
    ip = "192.168.14.15";
    port = "50002";
    var nodeurl = 'https://'+ ip + ':' + port + '/node/suricata/save';
    
    console.log(modifiedTxtArea.value);


    var nodejson = {}
    nodejson["data"] = modifiedTxtArea.value;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        console.log(response.data);
        return true;
    })
    .catch(function (error) {
        console.log(error);
        return false;
    });
}


loadFileIntoTextarea();