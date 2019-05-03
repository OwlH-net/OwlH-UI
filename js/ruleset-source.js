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
    nodejson["type"] = "Rulesets";
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
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
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
        '<th style="width: 15%">Actions</th>                                ' +
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
                '<span style="font-size: 20px; color: Dodgerblue;" >                            ' +
                    '<i class="fas fa-download" title="Download file" onclick="downloadFile(\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i>'+
                    '<i class="fas fa-sticky-note low-blue" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i>'+
                    '<i class="fas fa-trash-alt low-blue" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\')"></i>'+
                    '<a href="compare-files.html"><i class="fas fa-cog low-blue" title="Compare files" onclick="compareFiles()"></i></a>                              ' +
                '</span>'+     
            '</td></tr>'
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function compareFiles(){
    var newFile = '/root/workspace/src/owlhmaster/rules/drop.rules';
    var oldFile = '/root/workspace/src/owlhmaster/rules2/drop.rules';
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/compareFiles';
    var nodejson = {}
    nodejson["new"] = newFile;
    nodejson["old"] = oldFile;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
        });   
}

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
    document.getElementById('ruleset-source-edit-path').value = path;
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
    var path = document.getElementById('ruleset-source-edit-path').value;
    var url = document.getElementById('ruleset-source-edit-url').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/EditRulesetSource';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["desc"] = desc;
    nodejson["path"] = path;
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
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            GetAllRulesetSource();
        })
        .catch(function error() {
        });
}

function downloadFile(path, url, sourceUUID){
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
            //GetAllRulesetSource();
        })
        .catch(function error() {
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