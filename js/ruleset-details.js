function GetAllRulesetDetails(){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var sourceName = urlWeb.searchParams.get("sourceName");
    var type = urlWeb.searchParams.get("type");
    var ipmaster = document.getElementById('ip-master').value;
    document.getElementById('ruleset-source-details-title').innerHTML = sourceName;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-details');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/getDetails/'+uuid;

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack){
                result.innerHTML = '<h3 align="center" style="color: red;">Error retrieving files</h3>';
            }else{
                result.innerHTML = generateAllRulesetDetailsHTMLOutput(response, sourceName, type, uuid);
                // changeIconAttributes(response.data);
            }
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function generateAllRulesetDetailsHTMLOutput(response, sourceName, type, uuid){
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving all ruleset details for ruleset ' + sourceName + '</h3></div>';
    }  
    var isEmpty = true;
    var files = response.data;
    var html = 

    '<div class="input-group" width="100%" id="search-input-nodes">'+
        '<input class="form-control mx-3 searchInputNodes" type="text" placeholder="Search by rule file description..." aria-label="Search" id="search-ruleset-details">'+
        '<a type="button" class="btn btn-primary mr-2" onclick="loadRulesetBySearch(\''+uuid+'\', \''+sourceName+'\')"><i class="fas fa-search" style="color: white;"></i></a>'+
    '</div><br>'+
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>' +
            '<tr>' +
            '<th>File Name</th>' +
            '<th>Ruleset</th>' +
            '<th style="width: 15%">Actions</th>' +
        '</thead>' +
        '<tbody>' 
    for (file in files) {
        isEmpty = false;
        html = html + '<tr><td style="word-wrap: break-word;">'+
            files[file]["file"]+
            '</td><td style="word-wrap: break-word;">'+
            files[file]["name"]+
            '</td><td style="word-wrap: break-word;" class="align-middle">'+
                '<span style="font-size: 20px; color: Dodgerblue;">';
                    if(type == "source"){
                        if(files[file]["exists"] == "true"){
                            html = html + '<i class="fas fa-file-alt" style="cursor: pointer;" title="Show Rules" onclick="loadDetails(\''+file+'\', \''+files[file]["file"]+'\', \''+type+'\', \''+uuid+'\')"></i> ';
                        }else{
                            html = html + '<i class="fas fa-file-alt" style="color: grey;" title="File do not exists"></i>'+
                            ' | <i class="fas fa-times-circle" style="color: red;"></i>';
                        }
                    }else{                        
                        if(files[file]["exists"] == "true"){
                            html = html + '<i class="fas fa-file-alt" style="cursor: pointer;" title="Show Rules" onclick="loadDetails(\''+file+'\', \''+files[file]["file"]+'\', \''+type+'\', \''+uuid+'\')"></i> '+
                            ' | <i class="fas fa-trash-alt" style="color: red; cursor:pointer;" title="Delete file" data-toggle="modal" data-target="#modal-detail" onclick="modalDeleteRulesetDetail(\''+files[file]["file"]+'\', \''+file+'\')"></i>';
                            if(files[file]["existsSourceFile"] == "false"){
                                html = html + ' | <i class="fas fa-times-circle" style="color: red;" title="Source file don\'t exist"></i>';
                            }else if(files[file]["isUpdated"] == "true"){
                                html = html + ' | <i class="fas fa-recycle" title="Overwrite file" style="color: green; cursor: pointer;" data-toggle="modal" data-target="#modal-detail" onclick="modalOverwriteRuleFile(\''+file+'\',\''+files[file]["file"]+'\')"></i> ';
                                if(files[file]["linesAdded"] == "false"){
                                    html = html + '  <i class="far fa-plus-square" title="Add only new SIDs" style="color: LimeGreen; cursor: pointer;" data-toggle="modal" data-target="#modal-detail" onclick="modalAddNewLines(\''+file+'\', \''+files[file]["file"]+'\')"></i>';
                                }                                    
                                html = html + '  <i class="fas fa-info-circle" title="View differences" style="cursor: pointer;" onclick="viewDifferences(\''+file+'\', \''+files[file]["file"]+'\')"></i>';
                            }
                        }else{
                            html = html + '<i class="fas fa-file-alt" style="color: grey;" title="File do not exists"></i> '+
                            ' | <i class="fas fa-times-circle" style="color: red;"></i>';
                        }
                    }
                html = html + '</span>'+
            '</td></tr>';
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No files created</h3>';
    }else{
        return html;
    }
}

function modalAddNewLines(uuid, name){
    var modalWindowDelete = document.getElementById('modal-detail');
    var html = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Add new rules</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to add the new rules to file <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="addNewLines(\''+uuid+'\')">Add</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    modalWindowDelete.innerHTML = html;
}

function loadRulesetBySearch(uuid, rulesetName){
    var search = document.getElementById('search-ruleset-details').value;
    document.location.href = 'https://' + location.host + '/ruleset-search.html?rulesetName='+rulesetName+'&search='+search;
}

function addNewLines(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/AddNewLinesToRuleset/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllRulesetDetails();
            }
        })
        .catch(function error() {
        });
}

function viewDifferences(uuid, ruleFile){
    document.location.href = 'https://' + location.host + '/compare-files.html?uuid='+uuid+'&file='+ruleFile;
}
function loadDetails(fileuuid, ruleFile, type, rulesetuuid){
    document.location.href = 'https://' + location.host + '/ruleset.html?file='+fileuuid+'&rule='+ruleFile+'&type='+type+'&ruleset='+rulesetuuid;
}

function modalDeleteRulesetDetail(name, uuid){
    var modalWindowDelete = document.getElementById('modal-detail');
    var html = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to delete <b>'+name+'</b> file?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="deleteRulesetDetails(\''+uuid+'\')">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    modalWindowDelete.innerHTML = html;
}

function modalOverwriteRuleFile(uuid, name){
    var modalWindowDelete = document.getElementById('modal-detail');
    var html = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Overwrite rule file</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to overwrite the file <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="overwriteRuleFile(\''+uuid+'\')">Overwrite</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    modalWindowDelete.innerHTML = html;
}

function overwriteRuleFile(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/OverwriteRuleFile/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllRulesetDetails();
            }
        })
        .catch(function error() {
        });
}

function deleteRulesetDetails(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/DeleteRulesetFile/' + uuid;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllRulesetDetails();
            }
        })
        .catch(function error() {
        });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

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
        loadTitleJSONdata();
        GetAllRulesetDetails();
    });
  }
  var payload = "";
  loadJSONdata();