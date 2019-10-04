function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        LoadFileLastLines();
        loadTitleJSONdata();
    });
}
loadJSONdata();


function LoadFileLastLines(uuid, line, path) {
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var line = url.searchParams.get("line");
    var path = url.searchParams.get("path");

    document.getElementById('subtitle-path-lines').innerHTML = "Path: "+path;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/loadLines';

    var jsonWazuhFilePath = {}
    jsonWazuhFilePath["uuid"] = uuid;
    jsonWazuhFilePath["number"] = line;
    jsonWazuhFilePath["path"] = path;
    var dataJSON = JSON.stringify(jsonWazuhFilePath);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
        .then(function (response) {
            console.log(response.data["result"]);
            document.getElementById('inputTextTailLines').style.backgroundColor='white';
            document.getElementById('inputTextTailLines').value = response.data["result"];
        })
        .catch(function (error) {

        });
    return false;
}

function closeLastLines(){
    window.history.back();
}