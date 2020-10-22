function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}

        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        LoadFileLastLines();
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();


function LoadFileLastLines() {
    document.getElementById('progressBar-options-div').style.display = "block";
    document.getElementById('progressBar-options').style.display = "block";

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
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
        .then(function (response) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error: </strong>'+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else if (line != "none") {
                document.getElementById('inputTextTailLines').disabled='true';
                document.getElementById('inputTextTailLines').style.backgroundColor='white';
                document.getElementById('upper-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>'; 
                document.getElementById('lower-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>'; 
                document.getElementById('inputTextTailLines').value = response.data["result"];
            }else{
                document.getElementById('upper-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>  &nbsp <button type="button" class="btn btn-primary" onclick="saveCurrentContent()">Save</button>'; 
                document.getElementById('lower-buttons-file').innerHTML = '<button type="button" class="btn btn-secondary" onclick="closeCurrentFile()">Close</button>  &nbsp <button type="button" class="btn btn-primary" onclick="saveCurrentContent()">Save</button>'; 
                document.getElementById('inputTextTailLines').value = response.data["result"];
            }
        }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    return false;
}

function saveCurrentContent() {
    document.getElementById('progressBar-options-div').style.display = "block";
    document.getElementById('progressBar-options').style.display = "block";
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
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error! </strong>'+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success! </strong>File modified successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
    
                LoadFileLastLines();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error! </strong>'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function closeCurrentFile(){
    window.history.back();
}