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
    var formName = document.getElementById('ruleset-source-name').value.trim();
    var formDesc = document.getElementById('ruleset-source-desc').value.trim();
    var formUrl = document.getElementById('ruleset-source-url').value.trim();
    var fileName = formUrl.split(/[\s/]+/);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    var sourceType;
    var sourceURL;
    var alert = document.getElementById('floating-alert');

    $('input:radio:checked').each(function() {
        sourceType = $(this).prop("value");
    });

    if ((sourceType == "url" || sourceType == "threat") && (formName == "" || formDesc == "" || formUrl == "")){
        if(formName == ""){
            document.getElementById('ruleset-source-name').placeholder = "Please, insert a valid name.";
            document.getElementById('ruleset-source-name').required = "true";
        }
        if(formDesc == ""){
            document.getElementById('ruleset-source-desc').placeholder = "Please, insert a valid description.";
            document.getElementById('ruleset-source-desc').required = "true";
        }
        if(formUrl == ""){
            document.getElementById('ruleset-source-url').placeholder = "Please, insert a valid url.";
            document.getElementById('ruleset-source-url').required = "true";
        }
    }else if ((sourceType == "custom") && (formName == "" || formDesc == "")){
        document.getElementById('ruleset-source-url').required = "";
        if(formName == ""){
            document.getElementById('ruleset-source-name').placeholder = "Please, insert a valid name.";
            document.getElementById('ruleset-source-name').required = "true";
        }
        if(formDesc == ""){
            document.getElementById('ruleset-source-desc').placeholder = "Please, insert a valid description.";
            document.getElementById('ruleset-source-desc').required = "true";
        }
    }else{
        if (sourceType == "url" || sourceType == "threat"){
            sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/';
        }else  if (sourceType == "custom"){
            sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/custom';
        }
        formAddRulesetSource();//close add ruleset source form

        var nodejson = {}
        nodejson["name"] = formName;
        nodejson["desc"] = formDesc;
        nodejson["url"] = formUrl;
        nodejson["fileName"] = fileName[fileName.length-1];
        nodejson["type"] = "source";
        nodejson["sourceType"] = sourceType;
        if (sourceType != "custom"){nodejson["isDownloaded"] = "false";} //only for source and threat, not for custom ruleset source
        var nodeJSON = JSON.stringify(nodejson);

        axios({
            method: 'post',
            url: sourceURL,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
            data: nodeJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error! </strong>'+response.data.error+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                GetAllRulesetSource();
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error! </strong>'+error+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
        GetAllRulesetSource();
    }
}

function GetAllRulesetSource(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-source');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/';
    var portmaster = document.getElementById('create-url').checked = "true";
    document.getElementById('progressBar-create-div').style.display = "none";
    document.getElementById('progressBar-create').style.display = "none";
    document.getElementById('ruleset-source-text-top').style.display ="none";
    document.getElementById('ruleset-source-text-bot').style.display ="none";

    document.getElementById('ruleset-source-name').value = "";
    document.getElementById('ruleset-source-desc').value = "";
    document.getElementById('ruleset-source-url').value = "";
    document.getElementById('ruleset-source-name').required = "";
    document.getElementById('ruleset-source-desc').required = "";
    document.getElementById('ruleset-source-url').required =  "";
    document.getElementById('ruleset-source-name').placeholder = "Name";
    document.getElementById('ruleset-source-desc').placeholder = "Description";
    document.getElementById('ruleset-source-url').placeholder =  "url";

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        document.getElementById('ruleset-source-text-top').style.display ="block";
        document.getElementById('ruleset-source-text-bot').style.display ="block";
        result.innerHTML = generateAllRulesetSourceHTMLOutput(response);
        changeIconAttributes(response.data);
        RadioButtonListener();
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function RadioButtonListener(){
    $('input:radio').on('click', function(e) {
        var inputRadioClicked = $(e.currentTarget);
        if (inputRadioClicked.attr('value') == "custom"){
            document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
        }else if (inputRadioClicked.attr('value') == "url"){
            document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
        }else if (inputRadioClicked.attr('value') == "thread"){
            document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
        }
    });
}

function changeIconAttributes(sources){
    for (source in sources) {
        var icon = document.getElementById('SourceDetails-'+source);
        if (sources[source]['isDownloaded'] == "false" && sources[source]['sourceType'] != "custom"){
            icon.style.color = "grey";
            document.getElementById('download-status-'+source).value = "false";
        }else if (sources[source]['sourceType'] == "url"){
            icon.style.color = "Dodgerblue";
            document.getElementById('download-status-'+source).value = "true";
        }
    }
}

function generateAllRulesetSourceHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving data for ruleset source</h3></div>';
    }
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
        html = html + '<tr><td style="word-wrap: break-word;">'+
            sources[source]['name']+
            '</td><td style="word-wrap: break-word;">'+
            sources[source]['desc']+
            '</td><td style="word-wrap: break-word;">'+
            sources[source]['path']+
            '</td><td style="word-wrap: break-word;">';
            if (sources[source]['sourceType'] != "custom"){html = html + sources[source]['url'];}
            html = html + '</td><td align="right" style="word-wrap: break-word;">'+
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<input id="download-status-'+source+'" type="hidden" class="form-control" value = "'+sources[source]['isDownloaded']+'">';
                    if(sources[source]['sourceType'] != "custom"){
                        html = html +'<i class="fas fa-download" style="cursor: pointer;" title="Download file" onclick="downloadFile(\''+sources[source]['name']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    }
                    html = html + '<i class="fas fa-edit" style="cursor: pointer;" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    if(sources[source]['sourceType'] == "custom"){
                        html = html + '<i class="fas fa-info-circle" style="cursor: pointer;" id="customRuleDetails-'+source+'" title="Custom rule details" onclick="loadCustomRulesetRules(\''+source+'\',\''+sources[source]['path']+'\',\'custom\')"></i>';
                    }else{
                        html = html + '<i class="fas fa-info-circle" style="cursor: pointer;" id="SourceDetails-'+source+'" title="Details" onclick="loadRulesetSourceDetails(\'source\',\''+sources[source]['name']+'\',\''+source+'\')"></i>';
                    }
                    html = html + ' | <i class="fas fa-trash-alt" style="color: red; cursor: pointer;" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\', \''+sources[source]['sourceType']+'\')"></i> &nbsp;'+
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
    var isDownloaded = document.getElementById('download-status-'+uuid).value;
    if (isDownloaded == "true"){
        document.location.href = 'https://' + location.hostname + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
    }
}

function loadCustomRulesetRules(uuid,path,type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var pathArray = path.split("/")
    var ruleFileName = pathArray[pathArray.length-1];
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/GetFileUUIDfromRulesetUUID/'+uuid;
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        document.location.href = 'https://' + location.hostname + '/ruleset.html?file='+response.data+'&rule='+ruleFileName+'&type='+type+'&type='+response.data;
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });

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
        // headers:{
        //     'token': document.cookie,
        //     'user': payload.user,
        //     'uuid': payload.uuid,
        // },
//         data: dataJSON
//     })
//         .then(function (response) {
    // if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
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
        // headers:{
        //     'token': document.cookie,
        //     'user': payload.user,
        //     'uuid': payload.uuid,
        // },
//         data: nodeJSON
//         })
//         .then(function (response) {
    // if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
//         })
//         .catch(function (error) {
//         });
// }

function modalDeleteRulesetSource(name, sourceUUID, sourceType){
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
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="deleteRulesetSource(\''+sourceUUID+'\', \''+sourceType+'\')">Delete</button>'+
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
    var name = document.getElementById('ruleset-source-name-edit');
    var desc = document.getElementById('ruleset-source-edit-desc');
    var url = document.getElementById('ruleset-source-edit-url');
    if(name.value=="" || desc.value == "" || url.value == ""){
        if(name.value==""){
            $('#ruleset-source-name-edit').attr("placeholder", "Please, insert a valid name");
            $('#ruleset-source-name-edit').css('border', '2px solid red');
        }else{
            $('#ruleset-source-name-edit').css('border', '2px solid #ced4da');
        }
        if(desc.value==""){
            $('#ruleset-source-edit-desc').attr("placeholder", "Please, insert a valid description");
            $('#ruleset-source-edit-desc').css('border', '2px solid red');
        }else{
            $('#ruleset-source-edit-desc').css('border', '2px solid #ced4da');
        }
        if(url.value==""){
            $('#ruleset-source-edit-url').attr("placeholder", "Please, insert a valid url");
            $('#ruleset-source-edit-url').css('border', '2px solid red');
        }else{
            $('#ruleset-source-edit-url').css('border', '2px solid #ced4da');
        }
    }else{
        var sourceUUID = document.getElementById('ruleset-source-uuid').value.trim();
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/EditRulesetSource';
        var nodejson = {}
        nodejson["name"] = name.value.trim();
        nodejson["desc"] = desc.value.trim();
        nodejson["url"] = url.value.trim();
        nodejson["uuid"] = sourceUUID;
        var nodeJSON = JSON.stringify(nodejson);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
            data: nodeJSON
            })
            .then(function (response) {
                if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
                GetAllRulesetSource();
            })
            .catch(function (error) {
            });
            document.getElementById('edit-ruleset-source').style.display = "none";
    }
}

function deleteRulesetSource(sourceUUID,sourceType){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/DeleteRulesetSource';

    var nodejson = {}
    nodejson["sourceType"] = sourceType;
    nodejson["uuid"] = sourceUUID;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        data: nodeJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
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
        document.getElementById('progressBar-create-div').style.display = "block";
        document.getElementById('progressBar-create').style.display = "block";
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
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
            data: nodeJSON
        })
            .then(function (response) {
                if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
                if (response.data.ack == "true") {
                    var alert = document.getElementById('floating-alert');
                    $('html,body').scrollTop(0);
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Download complete.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    icon.style.color="Dodgerblue";
                    downloadStatus.value = "true";
                    setTimeout(function() {$(".alert").alert('close')}, 5000);

                    document.getElementById('progressBar-create').style.display = "none";
                    document.getElementById('progressBar-create-div').style.display = "none";
                }else{
                    var alert = document.getElementById('floating-alert');
                    $('html,body').scrollTop(0);
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong>'+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    downloadStatus.value = "false";
                    setTimeout(function() {$(".alert").alert('close')}, 5000);

                    document.getElementById('progressBar-create').style.display = "none";
                    document.getElementById('progressBar-create-div').style.display = "none";
                }
        })
            .catch(function error() {
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can not complete the download...'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                downloadStatus.value = "false";
                setTimeout(function() {$(".alert").alert('close')}, 5000);

                document.getElementById('progressBar-create').style.display = "none";
                document.getElementById('progressBar-create-div').style.display = "none";
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

    $('#modal-delete-source').modal('show');
}

function overwriteDownload(name, path, url, uuid){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
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
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        data: nodeJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Download complete.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            icon.style.color="Dodgerblue";
            downloadStatus.value = "true";
            setTimeout(function() {$(".alert").alert('close')}, 5000);

            document.getElementById('progressBar-create').style.display = "none";
            document.getElementById('progressBar-create-div').style.display = "none";
        }else{
            $('html,body').scrollTop(0);
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong>'+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            // icon.style.color="Grey";
            // downloadStatus.value = "false";
            setTimeout(function() {$(".alert").alert('close')}, 5000);

            document.getElementById('progressBar-create').style.display = "none";
            document.getElementById('progressBar-create-div').style.display = "none";
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Error!</strong> Can not complete the download...'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        // icon.style.color="Grey";
        // downloadStatus.value = "false";
        setTimeout(function() {$(".alert").alert('close')}, 5000);

        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
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
            document.location.href='https://'+location.hostname+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+location.hostname+'/login.html';}

        //login button
        document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllRulesetSource();
    });
}
var payload = "";
loadJSONdata();