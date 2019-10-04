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

    if (line != "none"){
        document.getElementById('node-config-title').innerHTML = "Load last "+line+" lines from file: "+path;
    }else{
        document.getElementById('node-config-title').innerHTML = "Load file: "+path;
    }
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

            if (line != "none") {
                document.getElementById('inputTextTailLines').disabled='true';
                document.getElementById('inputTextTailLines').style.backgroundColor='white';
                document.getElementById('upper-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>'; 
                document.getElementById('lower-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>'; 
            }else{
                document.getElementById('upper-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>  &nbsp <button type="button" class="btn btn-primary" onclick="saveCurrentContent()">Save</button>'; 
                document.getElementById('lower-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>  &nbsp <button type="button" class="btn btn-primary" onclick="saveCurrentContent()">Save</button>'; 
            }
            document.getElementById('inputTextTailLines').value = response.data["result"];
        })
        .catch(function (error) {

        });
    return false;
}

function saveCurrentContent() {
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var path = url.searchParams.get("path");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var contentFile = document.getElementById('inputTextTailLines').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/saveFileContentWazuh';

    var jsonWazuhFile = {}
    jsonWazuhFile["uuid"] = uuid;
    jsonWazuhFile["path"] = path;
    jsonWazuhFile["content"] = contentFile;
    var dataJSON = JSON.stringify(jsonWazuhFile);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        LoadFileLastLines(uuid, "none", path);
    })
    .catch(function (error) {
    });
}

function closeCurrentFile(){
    window.history.back();
}