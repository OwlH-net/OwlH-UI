getAllFiles()
function getAllFiles() {
    var urlData = new URL(window.location.href);
    var uuid = urlData.searchParams.get("uuid");
    var node = urlData.searchParams.get("node");

    var files = document.getElementById('files-table');
    var banner = document.getElementById('title-banner');
    banner.innerHTML = "Node: " + node;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/getAllFiles/' + uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            files.innerHTML = generateAllFilesOutput(response, node);
        })
        .catch(function (error) {
            files.innerHTML = '<h3 align="center">No connection</h3>';
        });
}

function generateAllFilesOutput(response, node) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving files for node ' + node + '</h3></div>';
    }  
    var isEmptyFiles = true;
    var files = response.data;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th>Name</th>                                                ' +
                '<th>Path</th>                                                ' +
                '<th>Actions</th>                                             ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (file in files) {
        isEmptyFiles=false;
        if (file != "nodeUUID"){
            html = html + '<tr><td style="word-wrap: break-word;">'+
                file                                                    +
                '</td><td style="word-wrap: break-word;">                         '+
                files[file]+
                '</td><td style="word-wrap: break-word;">                                                            '+                                                     
                '<button type="submit" class="btn btn-primary" onclick="loadEditURL(\''+files.nodeUUID+'\', \''+file+'\', \''+node+'\')">Edit</button>'+
                '</td></tr>                                                           '
        }
    }
    html = html + '</tbody></table>';

    if (isEmptyFiles){
        return '<div style="text-align:center"><h3>No files available...</h3></div>'; 
    }else{
        return html;
    }
}

function loadEditURL(uuid, file, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        getAllFiles();
    });
}
loadJSONdata();