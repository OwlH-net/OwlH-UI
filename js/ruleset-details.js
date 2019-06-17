function GetAllRulesetDetails(){
    var urlWeb = new URL(window.location.href);
    var sourceName = urlWeb.searchParams.get("sourceName");
    var uuid = urlWeb.searchParams.get("uuid");
    var type = urlWeb.searchParams.get("type");
    var ipmaster = document.getElementById('ip-master').value;
    document.getElementById('ruleset-source-details-title').innerHTML = sourceName;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-details');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/getDetails/'+uuid;

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack){
            result.innerHTML = '<h3 align="center">Error retrieving files</h3>';
        }else{
            result.innerHTML = generateAllRulesetDetailsHTMLOutput(response, sourceName, type);
            // changeIconAttributes(response.data);
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">Error: No connection</h3>';
    });
}

function generateAllRulesetDetailsHTMLOutput(response, sourceName, type){
    var isEmpty = true;
    var files = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>File Name</th>                                                  ' +
        '<th>Ruleset</th>                                          ' +
        '<th>Description</th>                                                    ' +
        '<th>Path</th>                                               ' +
        '<th style="width: 15%">Actions</th>                                ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      ' 
    for (file in files) {
        isEmpty = false;
        html = html + '<tr><td>'+
            files[file]["file"]+
            '</td><td>'+
            files[file]["name"]+
            '</td><td>'+
            'No description yet...'+
            '</td><td>'+
            files[file]["path"]+
            '</td><td class="align-middle">'+
                '<span style="font-size: 20px; color: Dodgerblue;">'
                    if(type == "source"){
                        console.log(files[file]["file"]);
                        if(files[file]["exists"] == "true"){
                            html = html + '<i class="fas fa-file-alt" title="Show Rules" onclick="loadDetails(\''+file+'\', \''+files[file]["file"]+'\', \''+type+'\')"></i> '
                        }else{
                            html = html + '<i class="fas fa-file-alt" style="color: grey;" title="File do not exists"></i>'+
                            ' | <i class="fas fa-times-circle" style="color: red;"></i>'
                        }
                    }else{                        
                        if(files[file]["exists"] == "true"){
                            html = html + '<i class="fas fa-file-alt" title="Show Rules" onclick="loadDetails(\''+file+'\', \''+files[file]["file"]+'\', \''+type+'\')"></i> '+
                            ' | <i class="fas fa-trash-alt" style="color: red;" title="File do not exists"></i>'
                        }else{
                            html = html + '<i class="fas fa-file-alt" style="color: grey;" title="File do not exists"></i> '+
                            ' | <i class="fas fa-times-circle" style="color: red;"></i>'
                        }
                    }
                    // '<i class="fas fa-sticky-note low-blue" title="Edit file" onclick="showEditRulesetfile(\''+files[source]['name']+'\',\''+files[source]['desc']+'\',\''+files[source]['path']+'\',\''+files[source]['url']+'\',\''+source+'\')"></i> &nbsp;'+
                    // '<a href="compare-files.html"><i class="fas fa-cog low-blue" title="Compare files" onclick="compareFiles()"></i></a>                              ' +
                    // '<a href="ruleset-details.html?uuid='+source+'&path='+files[source]['path']+'"><i class="fas fa-info-circle" title="Details"></i></a>'+
                    html = html + '</span>'+
            '</td></tr>'
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No files created</h3>';
    }else{
        return html;
    }
}

function loadDetails(uuid, ruleFile, type){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/ruleset.html?uuid='+uuid+'&rule='+ruleFile+'&type='+type;
}

function modalDeleteRulesetDetail(name, uuid){
    var modalWindowDelete = document.getElementById('modal-delete-detail');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">Groups</h4>'+
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
}

function deleteRulesetDetails(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/DeleteRulesetFile/' + uuid;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            GetAllRulesetDetails();
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
      GetAllRulesetDetails();
    });
  }
  loadJSONdata();