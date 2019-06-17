function loadRulesData(){
    var result = document.getElementById('new-ruleset-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getAllRuleData';

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000
    })
    .then(function (response) {
        result.innerHTML = generateAllRuleDataHTMLOutput(response);
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
}

function generateAllRuleDataHTMLOutput(response) {
    var isEmpty = true;
    var sources = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 10%">Select</th>                                                  ' +
        '<th>Source name</th>                                                  ' +
        '<th>File name</th>                                          ' +
        '<th style="display:none;">path</th>                                          ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      ' 
    for (source in sources) {
        if(sources[source]["exists"]=="true"){
            isEmpty = false;
            html = html + '<tr><td align="center">'+
                    '<input class="form-check-input" type="checkbox" id="'+source+'"></input>'+
                '</td><td id="nameNewRuleset-'+source+'">'+
                    sources[source]["name"]+
                '</td><td id="fileNewRuleset-'+source+'">'+
                    sources[source]["file"]+
                '</td><td style="display:none;" id="pathNewRuleset-'+source+'">'+
                    sources[source]["path"]+
                '</td></tr>'
        }
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function modalAddNewRuleset(){
    var newRuleset = new Map();
    $('input:checkbox:checked').each(function() {
        var checked = $(this).prop("id");
        newRuleset[checked] = new Map();
        newRuleset[checked]["sourceName"] = document.getElementById('nameNewRuleset-'+checked+'').innerHTML;
        newRuleset[checked]["fileName"] = document.getElementById('fileNewRuleset-'+checked+'').innerHTML;
        newRuleset[checked]["filePath"] = document.getElementById('pathNewRuleset-'+checked+'').innerHTML;
        newRuleset[checked]["rulesetName"] = document.getElementById('new-ruleset-name-input').value;
        newRuleset[checked]["rulesetDesc"] = document.getElementById('new-ruleset-description-input').value;
    });

    var isDuplicated = false;
    for (uuid in newRuleset){
        for (uuidCheck in newRuleset){
            if ((uuid != uuidCheck) && (newRuleset[uuid]["fileName"] == newRuleset[uuidCheck]["fileName"]) ){
                isDuplicated = true;
            }
        }
    }

    if(document.getElementById('new-ruleset-name-input').value == "" || document.getElementById('new-ruleset-description-input').value == "") {
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Name or description fields are null.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
    }else if (isDuplicated){        
        document.getElementById('modal-window').innerHTML = 
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
        
                '<div class="modal-header">'+
                    '<h4 class="modal-title">Files duplicated</h4>'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
        
                '<div class="modal-body">'+ 
                    '<p>You have selected duplicate files.</p>'+
                '</div>'+
        
                '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                    '<button id="modalDuplicate" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '</div>'+
        
            '</div>'+
        '</div>';

        $('#modal-window').modal('show')     
    } else {
        $('#modal-window').modal('dispose')
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/addNewRuleset';
        var nodeJSON = JSON.stringify(newRuleset);
        axios({
            method: 'put',
            url: sourceurl,
            timeout: 30000,
            data: nodeJSON
        })
        .then(function (response) {
            if (response.data.ack == "true"){
                console.log("ack");
                console.log(response.data);
                document.location.href = 'https://' + ipmaster + '/rulesets.html';
            }else{
                console.log("ok");
                console.log(response.data);
                lines = JSON.parse(response.data)
                var html =
                '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+
                
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">Lines duplicated</h4>'+
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '</div>'+
                
                        '<div class="modal-body">'+
                            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                '<thead>                                                      ' +
                                    '<tr>                                                         ' +
                                    '<th>SID</th>                                                ' +
                                    '<th>Files</th>                                         ' +
                                    '<th>Actions</th>                                             ' +
                                    '</tr>                                                        ' +
                                '</thead>                                                     ' +
                                '<tbody>                                                     '
                                    for (sid in lines){
                                        for(values in lines[sid]){
                                            var cont = true;
                                            for(data in lines[sid][values]){
                                                html = html + '<tr>'
                                                if (cont){
                                                    html = html + 
                                                    '<th rowspan="'+lines[sid]["counter"]+'">' +
                                                        sid +
                                                    '</th>'
                                                    cont = false;
                                                }
                                                html = html + 
                                                '<td>'+
                                                    lines[sid][values][data]["fileName"] +
                                                '</td><td>'+
                                                    '<i class="fas fa-info-circle"></i>' +
                                                '</td></tr>'
                                            }
                                        }
                                    }
                                html = html + '</tbody></table>'+
                        '</div>'+
                
                        '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                            '<button id="modalDuplicate" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '</div>'+
                
                    '</div>'+
                '</div>';
        
                document.getElementById('modal-window').innerHTML = html;
                $('#modal-window').modal('show')     
            }
        })
        .catch(function (error) {
            // result.innerHTML = '<h3 align="center">No connection</h3>';
        });
    }
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;      
      loadRulesData();
      loadTitleJSONdata();
    });
  }
  loadJSONdata();