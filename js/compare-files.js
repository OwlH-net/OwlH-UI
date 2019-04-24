function compareFiles(){
    var resultElement = document.getElementById('compare-lines-table');
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
            resultElement.innerHTML = generateAllLinesHTMLOutput (response);
        })
        .catch(function (error) {
        });   
}

function generateAllLinesHTMLOutput (response){
    var arrayRadiobuttons;
    var lines = response.data
    var isEmptyRulesets = true;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 8%">Sid</th>                                                 ' +
        '<th style="width: 10%">New file line status</th>                                ' +
        '<th style="width: 31%">New file line</th>                                       ' +
        '<th style="width: 10%">Old file line status</th>                                ' +
        '<th style="width: 31%">Old file line</th>                                       ' +
        '<th style="width: 10%">Actions</th>                                             ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody >                                                     '
    for (line in lines) {
        if (lines[line]["enabled-new"] == "Enabled") {
            iconNew = '<i class="fas fa-check-circle" style="color:green;"></i>';
        } else {
            iconNew = '<i class="fas fa-times-circle" style="color:red;"></i>';
        }

        if (lines[line]["enabled-old"] == "Enabled") {
            iconOld = '<i class="fas fa-check-circle" style="color:green;"></i>';
        } else {
            iconOld = '<i class="fas fa-times-circle" style="color:red;"></i>';
        }

        if (lines[line]["enabled-old"] == "N/A"){
            iconOld = '';
        }
        if (lines[line]["enabled-new"] == "N/A"){
            iconNew = '';
        }

        isEmptyRulesets = false;
        html = html + '<tr><td>' +
            lines[line]["sid"] +
            '</td><td>                                                            ' +
            iconNew +
            '</td><td>                                                            ' +
            lines[line]["new"] +
            '</td><td>                                                            ' +
            iconOld +
            '</td><td>                                                            ' +
            lines[line]["old"] +
            '</td><td>                                                            ' +
            '<a class="btn btn-primary">Details</a>                               ' +
            '<div class="form-check">                         '+
                '<input class="form-check-input" type="radio" name="'+line+'-new" id="'+line+'-new" value="new-line">                         '+
                '<label class="form-check-label" for="inlineRadio1">New line</label>                         '+
            '</div>                         '+
            '<div class="form-check">                         '+
                '<input class="form-check-input" type="radio" name="'+line+'-new" id="'+line+'-old" value="old-line" checked>                         '+
                '<label class="form-check-label" for="inlineRadio2">Old line</label>                         '+
            '</div>                         '+
            '</td></tr>'
    }
    
    if (document.getElementById(line+"-new").checked = true){
        arrayRadiobuttons.push(document.getElementById(line+'-new').value);
        console.log("new");
    }else if (document.getElementById(line+"-old").checked = true){
        arrayRadiobuttons.push(document.getElementById(line+'-old').value);                
        console.log("OLD");
    }

    html = html + 
        '</tbody></table>'+
        '<a class="btn btn-primary" onclick="createNewFile('+arrayRadiobuttons+')">Create New File</a>                               ';

    if (isEmptyRulesets) {
        return '<div style="text-align:center"><h3>Both files are equals</h3></div>';
    } else {
        return html;
    }
}

function createNewFile(arrayRadiobuttons){
    console.log(arrayRadiobuttons);
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadTitleJSONdata();
      compareFiles();
    });
  }
  loadJSONdata();