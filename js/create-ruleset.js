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
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function addNewRuleset(){
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
        result.innerHTML = generateAllRuleDataHTMLOutput(response);
    })
    .catch(function (error) {
        console.log(error);
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });

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