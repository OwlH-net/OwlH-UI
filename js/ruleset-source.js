function formAddRulesetSource(){
    document.getElementById('edit-ruleset-source').style.display = "none";
    var addGroupId = document.getElementById('add-ruleset-source');
    var textGroup = document.getElementById('ruleset-source-text');

    if (addGroupId.style.display == "none") {
        addGroupId.style.display = "block";
        textGroup.innerHTML = "Close add new ruleset source";
    } else {
        addGroupId.style.display = "none";
        textGroup.innerHTML = "Add new ruleset source";
    }
}

function addRulesetSource() {
    var sourceName = document.getElementById('ruleset-source-name').value;
    var sourceDesc = document.getElementById('ruleset-source-desc').value;
    var sourceUrl = document.getElementById('ruleset-source-url').value;
    var fileName = sourceUrl.split(/[\s/]+/);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/';
    
    formAddRulesetSource();//close add ruleset source form
    var nodejson = {}
    nodejson["name"] = sourceName;
    nodejson["desc"] = sourceDesc;
    nodejson["fileName"] = fileName[fileName.length-1];
    nodejson["url"] = sourceUrl;
    nodejson["type"] = "source";
    nodejson["isDownloaded"] = "false";
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'post',
        url: sourceURL,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        GetAllRulesetSource();
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
    document.getElementById('ruleset-source-text').style.display ="none";

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('ruleset-source-text').style.display ="block";
        result.innerHTML = generateAllRulesetSourceHTMLOutput(response);
        changeIconAttributes(response.data);
    })
    .catch(function (error) {
        console.log("Error: "+error);
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
}

function changeIconAttributes(sources){
    
    for (source in sources) {
        var icon = document.getElementById('SourceDetails-'+source);
        if (sources[source]['isDownloaded'] == "false"){
            icon.style.color = "grey";
        }else{
            console.log("ONCLICK: name: "+sources[source]["name"]+"  uuid: "+source);
            icon.style.color = "Dodgerblue";
            icon.addEventListener("click", loadRulesetSourceDetails("source" ,sources[source]["name"] ,source)); 
            // icon.onclick = function () { 
            //     loadRulesetSourceDetails("source" ,sources[source]["name"] ,source); 
            // }
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
            '</td><td>'+
            sources[source]['url']+
            '</td><td class="align-middle">'+
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<i class="fas fa-download" title="Download file" onclick="downloadFile(\''+sources[source]['name']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\',\''+sources[source]['isDownloaded']+'\')"></i> &nbsp;'+
                    '<i class="fas fa-sticky-note" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;'+
                    '<i class="fas fa-info-circle" id="SourceDetails-'+source+'" title="Details" onclick=""></i>'+
                    ' | <i class="fas fa-trash-alt" style="color: red;" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\')"></i> &nbsp;'+
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

function loadRulesetSourceDetails(type,name,uuid){    
    console.log("AAAAAA: "+type+" -- "+name+" -- "+uuid);
    var ipmaster = document.getElementById('ip-master').value;
    // document.location.href = 'https://' + ipmaster + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
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
    document.getElementById('ruleset-source-text').innerHTML = "Add new ruleset source";
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
    nodejson["sourceuuid"] = sourceUUID;
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

function downloadFile(name, path, url, sourceUUID, isDownloaded){
    console.log(isDownloaded);
    if (isDownloaded == "true"){
        modalOverwriteDownload(path, url, sourceUUID);
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/downloadFile';
        var nodejson = {}
        nodejson["url"] = url;
        nodejson["path"] = path;
        nodejson["sourceuuid"] = sourceUUID;
        var nodeJSON = JSON.stringify(nodejson);
    
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: nodeJSON
        })
            .then(function (response) {
                if (response.data.ack == "true") {
                    var icon = document.getElementById('SourceDetails-'+sourceUUID);
                    icon.style.color="Dodgerblue";
                    icon.onclick = function () { loadRulesetSourceDetails("source" ,name ,sourceUUID); }
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Download complete.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    
                }else{
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Error!</strong>'+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                }
            })
            .catch(function error() {
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Error!</strong>'+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
            });
    }
}

function modalOverwriteDownload(path, url, sourceUUID){
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
                
                //Add here the new call
                //Add here the new call
                //Add here the new call
                //Add here the new call
                //Add here the new call

                // '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="downloadFile(\''+path+'\', \''+url+'\', \''+sourceUUID+'\', \'false\')">Overwrite</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';

    $('#modal-delete-source').modal('show')     

    // $('#modal-delete-source').on('click' , function() { 
    //     $('.modal').modal('hide')
    // });
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