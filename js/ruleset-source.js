function formAddRulesetSource(){
    document.getElementById('edit-ruleset-source').style.display = "none";
    var addGroupId = document.getElementById('add-ruleset-source');
    var textGroupTop = document.getElementById('ruleset-source-text-top');
    var textGroupBot = document.getElementById('ruleset-source-text-bot');

    if (addGroupId.style.display == "none") {
        addGroupId.style.display = "block";
        textGroupTop.innerHTML = "Close add new ruleset source";
        textGroupBot.innerHTML = "Close add new ruleset source";
    } else {
        addGroupId.style.display = "none";
        textGroupTop.innerHTML = "Add new ruleset source";
        textGroupBot.innerHTML = "Add new ruleset source";
    }
}

function addRulesetSource() {
    var sourceName = document.getElementById('ruleset-source-name').value;
    var sourceDesc = document.getElementById('ruleset-source-desc').value;
    var sourceUrl = document.getElementById('ruleset-source-url').value;
    var fileName = sourceUrl.split(/[\s/]+/);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    // var sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/';
    var sourceType;
    var sourceURL;
    var alert = document.getElementById('floating-alert');
    
    $('input:radio:checked').each(function() {
        sourceType = $(this).prop("value");
    });

    if (sourceType == "url"){
        if(sourceUrl == ""){
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error! </strong> For URL source type, please inserta a valid URL.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
        }
        sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/';
    }else{
        sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/custom';
    }

    formAddRulesetSource();//close add ruleset source form
    var nodejson = {}
    nodejson["name"] = sourceName;
    nodejson["desc"] = sourceDesc;
    nodejson["fileName"] = fileName[fileName.length-1];
    nodejson["url"] = sourceUrl;
    nodejson["type"] = "source";
    nodejson["sourceType"] = sourceType;
    nodejson["isDownloaded"] = "false";
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'post',
        url: sourceURL,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error! </strong>'+response.data.error+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
        }else{
            GetAllRulesetSource();
        }
        return true;
    })
    .catch(function (error) {
        return false;
    });   
    GetAllRulesetSource(); 
}

function GetAllRulesetSource(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-source');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/';
    document.getElementById('ruleset-source-text-top').style.display ="none";
    document.getElementById('ruleset-source-text-bot').style.display ="none";

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('ruleset-source-text-top').style.display ="block";
        document.getElementById('ruleset-source-text-bot').style.display ="block";
        result.innerHTML = generateAllRulesetSourceHTMLOutput(response);
        changeIconAttributes(response.data);
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
}

function changeIconAttributes(sources){
    for (source in sources) {
        var icon = document.getElementById('SourceDetails-'+source);
        if (sources[source]['isDownloaded'] == "false" && sources[source]['sourceType'] == "url"){
            icon.style.color = "grey";
            document.getElementById('download-status-'+source).value = "false";
        }else if (sources[source]['sourceType'] == "url"){
            icon.style.color = "Dodgerblue";
            document.getElementById('download-status-'+source).value = "true";
        }
    }
}

function generateAllRulesetSourceHTMLOutput(response) {
    var isEmpty = true;
    var sources = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>Name</th>                                                  ' +
        '<th>Description</th>                                          ' +
        '<th>Path</th>                                                    ' +
        '<th>Url</th>                                               ' +
        '<th style="width: 20%">Actions</th>                                ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      ' 
    for (source in sources) {
        isEmpty = false;
        html = html + '<tr><td>'+
            sources[source]['name']+
            '</td><td>'+
            sources[source]['desc']+
            '</td><td>'+
            sources[source]['path']+
            '</td><td>';
            if (sources[source]['sourceType'] == "custom"){
                html = html + 'Custom';
            }else {
                html = html + sources[source]['url'];
            }
            html = html + '</td><td align="right">'+
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<input id="download-status-'+source+'" type="hidden" class="form-control" value = "'+sources[source]['isDownloaded']+'">';
                    if(sources[source]['sourceType'] == "url"){
                        html = html +'<i class="fas fa-download" title="Download file" onclick="downloadFile(\''+sources[source]['name']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    }
                    html = html + '<i class="fas fa-sticky-note" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    if(sources[source]['sourceType'] == "custom"){
                        html = html + '<i class="fas fa-info-circle" id="customRuleDetails-'+source+'" title="Custom rule details"></i>';
                    }else{
                        html = html + '<i class="fas fa-info-circle" id="SourceDetails-'+source+'" title="Details" onclick="loadRulesetSourceDetails(\'source\',\''+sources[source]['name']+'\',\''+source+'\')"></i>';
                    }          
                    html = html + ' | <i class="fas fa-trash-alt" style="color: red;" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\')"></i> &nbsp;'+
                '</span>'+
            '</td></tr>';
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function loadRulesetSourceDetails(type, name, uuid){    
    var ipmaster = document.getElementById('ip-master').value;
    var isDownloaded = document.getElementById('download-status-'+uuid).value;
    if (isDownloaded == "true"){
        document.location.href = 'https://' + ipmaster + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
    }
}


// function modalSyncRulesetSource(name, uuid){
//     var modalWindow = document.getElementById('modal-ruleset');
//     modalWindow.innerHTML = 
//     '<div class="modal-dialog">'+
//         '<div class="modal-content">'+
    
//             '<div class="modal-header">'+
//                 '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Ruleset</h4>'+
//                 '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
//             '</div>'+
    
//             '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
//                 '<p>Do you want to synchronize <b>'+name+'</b> ruleset source?</p>'+
//             '</div>'+
    
//             '<div class="modal-footer" id="modal-ruleset-sync-ruleset-footer-btn">'+
//                 '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
//                 '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="syncRulesetSource(\''+uuid+'\')">Sync</button>'+
//             '</div>'+
  
//         '</div>'+
//     '</div>';
// }

// function syncRulesetSource(uuid){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/set';

//     var jsonRuleUID = {}
//     jsonRuleUID["uuid"] = uuid;
//     jsonRuleUID["type"] = "ruleset";
//     var dataJSON = JSON.stringify(jsonRuleUID);

//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         data: dataJSON
//     })
//         .then(function (response) {
//         })
//         .catch(function (error) {
//         });
// }


// function compareFiles(){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/compareFiles';
//     var nodejson = {}
//     nodejson["new"] = 'conf/downloads/Default/rules/drop.rules';
//     nodejson["old"] = 'rules/drop.rules';
//     var nodeJSON = JSON.stringify(nodejson);
//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         data: nodeJSON
//         })
//         .then(function (response) {
//         })
//         .catch(function (error) {
//         });   
// }

function modalDeleteRulesetSource(name, sourceUUID){
    var modalWindowDelete = document.getElementById('modal-delete-source');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Groups</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to delete source <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="deleteRulesetSource(\''+sourceUUID+'\')">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
}

function showEditRulesetSource(name, desc, path, url, sourceUUID){
    document.getElementById('add-ruleset-source').style.display = "none";
    document.getElementById('ruleset-source-text-top').innerHTML = "Add new ruleset source";
    document.getElementById('ruleset-source-text-bot').innerHTML = "Add new ruleset source";
    document.getElementById('edit-ruleset-source').style.display = "block";
    document.getElementById('ruleset-source-name-edit').value = name;
    document.getElementById('ruleset-source-edit-desc').value = desc;
    document.getElementById('ruleset-source-edit-url').value = url;
    document.getElementById('ruleset-source-uuid').value = sourceUUID;
}

function editRulesetSourceClose(){
    document.getElementById('edit-ruleset-source').style.display = "none";
}

function editRulesetSourceData(){
    var name = document.getElementById('ruleset-source-name-edit').value;
    var desc = document.getElementById('ruleset-source-edit-desc').value;
    var sourceUUID = document.getElementById('ruleset-source-uuid').value;
    var url = document.getElementById('ruleset-source-edit-url').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/EditRulesetSource';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["desc"] = desc;
    nodejson["url"] = url;
    nodejson["uuid"] = sourceUUID;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
        })
        .then(function (response) {
            GetAllRulesetSource();
        })
        .catch(function (error) {
        });   
        document.getElementById('edit-ruleset-source').style.display = "none";
}

function deleteRulesetSource(sourceUUID){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/DeleteRulesetSource/' + sourceUUID;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            GetAllRulesetSource();
        })
        .catch(function error() {
        });
}

function downloadFile(name, path, url, sourceUUID){
    var downloadStatus = document.getElementById('download-status-'+sourceUUID);
    var icon = document.getElementById('SourceDetails-'+sourceUUID);
    if (downloadStatus.value == "true"){
        modalOverwriteDownload(name,path, url, sourceUUID);
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/downloadFile';
        var nodejson = {}
        nodejson["url"] = url;
        nodejson["name"] = name;
        nodejson["path"] = path;
        nodejson["uuid"] = sourceUUID;
        var nodeJSON = JSON.stringify(nodejson);
    
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: nodeJSON
        })
            .then(function (response) {
                if (response.data.ack == "true") {
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Download complete.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    icon.style.color="Dodgerblue";
                    downloadStatus.value = "true";
                }else{
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong>'+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    downloadStatus.value = "false";
                }
        })
            .catch(function error() {
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can not complete the download...'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                downloadStatus.value = "false";
        });
    }
}

function modalOverwriteDownload(name,path, url, sourceUUID){
    var modalWindowDelete = document.getElementById('modal-delete-source');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Download</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>The file has been downloaded yet. Do you want to overwrite the file downloaded?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="overwriteDownload(\''+name+'\', \''+path+'\', \''+url+'\', \''+sourceUUID+'\')">Overwrite</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';

    $('#modal-delete-source').modal('show')     
}

function overwriteDownload(name, path, url, uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var downloadStatus = document.getElementById('download-status-'+source);
    var icon = document.getElementById('SourceDetails-'+uuid);
    var alert = document.getElementById('floating-alert');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/overwriteDownload';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["url"] = url;
    nodejson["path"] = path;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        if (response.data.ack == "true") {
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Download complete.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            icon.style.color="Dodgerblue";
            downloadStatus.value = "true";
        }else{
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong>'+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            icon.style.color="Grey";
            downloadStatus.value = "false";
        }
    })
    .catch(function error(error) {
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Error!</strong> Can not complete the download...'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        icon.style.color="Grey";
        downloadStatus.value = "false";
    });
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadTitleJSONdata();
      GetAllRulesetSource();
    });
}

loadJSONdata();