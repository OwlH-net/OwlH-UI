function GetAllRulesetDetails(){
    var urlWeb = new URL(window.location.href);
    var sourceName = urlWeb.searchParams.get("sourceName");
    var uuid = urlWeb.searchParams.get("uuid");
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
            result.innerHTML = generateAllRulesetDetailsHTMLOutput(response, sourceName);
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">Error: No connection</h3>';
    });
}

function generateAllRulesetDetailsHTMLOutput(response, sourceName){
    var isEmpty = true;
    var files = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>File Name</th>                                                  ' +
        '<th>Source</th>                                          ' +
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
                // '<p>                            ' +
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    // '<i class="fas fa-file-alt" title="Show Rules"></i> &nbsp;'+
                    '<a class="fas fa-file-alt" title="Show Rules" href="ruleset.html?uuid=' + file + '&rule=' + files[file]["file"] + '"></a> ' +
                    // '<i class="fas fa-sticky-note low-blue" title="Edit file" onclick="showEditRulesetfile(\''+files[source]['name']+'\',\''+files[source]['desc']+'\',\''+files[source]['path']+'\',\''+files[source]['url']+'\',\''+source+'\')"></i> &nbsp;'+
                    // '<i class="fas fa-trash-alt low-blue" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+files[source]['name']+'\',\''+source+'\')"></i> &nbsp;'+
                    // '<a href="compare-files.html"><i class="fas fa-cog low-blue" title="Compare files" onclick="compareFiles()"></i></a>                              ' +
                    // '<a href="ruleset-details.html?uuid='+source+'&path='+files[source]['path']+'"><i class="fas fa-info-circle" title="Details"></i></a>'+
                '</span>'+
                // '</p>'+     
            '</td></tr>'
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No files created</h3>';
    }else{
        return html;
    }
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