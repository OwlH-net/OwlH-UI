function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadRule();        
        loadTitleJSONdata();
    });
}
loadJSONdata();


function loadRule(){
    var urlWeb = new URL(window.location.href);
    var fileuuid = urlWeb.searchParams.get("fileuuid");
    var sid = urlWeb.searchParams.get("sid");

    getRule(sid, fileuuid)
}

function cancelRuleEdit(){
    window.history.back();
}

function showModifyValue(key){
    $('#'+key).show();
}

function hideEditValue(key){
    document.getElementById(key).style.display = "none";
}
function disableRow(count){
    document.getElementById(count+'-data-row').style.display = "none";
    document.getElementById(count+'-data-row').className = "hidden";
}

function saveNewValue(count){    
    document.getElementById(count+'-value-data').innerHTML = document.getElementById(count+'-value-displayed').value;
}

function getRule(sid, fileuuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/ruleset/rule/'+sid+'/'+fileuuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        var re = /msg:"([^"]+)"/;
        var inline = response.data.raw.match(re)
        var title = document.getElementById('rule-title');
        var secondaryTitle = document.getElementById('rule-subtitle');
        title.innerHTML = title.innerHTML + inline[1];
        secondaryTitle.innerHTML = secondaryTitle.innerHTML + sid;
        


        var content = document.getElementById('rule-content');  
        var html =
        '<div class="float-right" style="width:100%;">'+
            '<a class="btn btn-primary float-right text-decoration-none text-white" onclick="saveCurrentRule()">Save</a> &nbsp'+
            '<a class="btn btn-danger float-right text-decoration-none text-white" style=" margin-right: 10px;" onclick="cancelRuleEdit()">Cancel</a>'+
        '</div>'+
        '<br><br>'+
            '<table width="100%" class="table table-hover" style="table-layout: fixed">'+
                '<thead>'+
                    '<th width="25%">Match</th>'+
                    '<th width="60%">Value</th>'+
                    '<th width="15%">Actions</th>'+
                '</thead>'
                '<tbody>';
                var rawMatchRegexp = /([^\(]+)\((.*)\)/;
                var rawline = response.data.raw.match(rawMatchRegexp);
                var valuesSplited = rawline[1].split(' ');
                    // var line = valuesSplited[value].split(':');
                    html = html + '<tr>'+
                        '<td style="word-wrap: break-word;">Type</td>'+
                        '<td style="word-wrap: break-word;" id="type-match-value">'+valuesSplited[0]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'type-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="type-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[0]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'type-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+

                    '<tr>'+
                        '<td style="word-wrap: break-word;">Proto</td>'+
                        '<td style="word-wrap: break-word;" id="proto-match-value">'+valuesSplited[1]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'proto-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="proto-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[1]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'proto-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+

                    '<tr>'+
                        '<td style="word-wrap: break-word;">Source</td>'+
                        '<td style="word-wrap: break-word;" id="source-match-value">'+valuesSplited[2]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'source-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="source-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[2]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'source-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+

                    '<tr>'+
                        '<td style="word-wrap: break-word;">Source PORT</td>'+
                        '<td style="word-wrap: break-word;" id="source-port-match-value">'+valuesSplited[3]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'source-port-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="source-port-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[3]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'source-port-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+


                    '<tr>'+
                        '<td style="word-wrap: break-word;">Direction</td>'+
                        '<td style="word-wrap: break-word;" id="direction-match-value">'+valuesSplited[4]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'direction-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="direction-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[4]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'direction-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+

                    '<tr>'+
                        '<td style="word-wrap: break-word;">Destination</td>'+
                        '<td style="word-wrap: break-word;" id="destination-match-value">'+valuesSplited[5]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'destination-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="destination-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[5]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'destination-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+

                    '<tr>'+
                        '<td style="word-wrap: break-word;">Destination PORT</td>'+
                        '<td style="word-wrap: break-word;" id="destination-port-match-value">'+valuesSplited[6]+'</td>'+
                        '<td style="word-wrap: break-word;"><i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\'destination-port-match\')"></i></td>'+
                    '</tr>'+
                    '<tr width="100%" id="destination-port-match" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Value: <input class="form-control" id="type-input-value" value="'+valuesSplited[6]+'">'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\'destination-port-match\')">Close</button>'+
                        '</td>'+
                    '</tr>'+   

                '</tbody>'+
            '</table><br><br>'+
            '<table width="100%" class="table table-hover" style="table-layout: fixed">'+
                '<thead>'+
                    '<th width="25%">Key</th>'+
                    '<th width="60%">Value</th>'+
                    '<th width="15%" style="vertical-align: bottom;">Actions</th>'+
                    '<th width="5%"><a class="btn btn-primary float-right text-decoration-none text-white">Add key</a></th>'+
                '</thead>'+
                '<tbody>';
                var rawMatchRegexp = /([^\(]+)\((.*)\)/;
                var rawline = response.data.raw.match(rawMatchRegexp)
                var valuesSplited = rawline[2].split(';');
                var count = 1;
                    for(value in valuesSplited){
                        var line = valuesSplited[value].split(':');
                        if (line == "") {continue;}
                        html = html +'<tr class="'+count+'-row-displayed" id="'+count+'-data-row" value="'+count+'">'+
                            '<td style="word-wrap: break-word;" id="'+count+'-key-data" value="'+line[0].trim()+'">'+line[0].trim()+'</td>';
                                var valueRetrieved = ""
                                if(line[1] == undefined){
                                    valueRetrieved = "";
                                }else{
                                    valueRetrieved = line[1];
                                }
                            html = html + '<td style="word-wrap: break-word;" id="'+count+'-value-data" value="'+valueRetrieved+'">'+valueRetrieved+'</td>'+
                            '<td style="word-wrap: break-word;" colspan="2">'+
                                '<i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\''+count+'-line\')"></i> &nbsp'+
                                '<i class="fas fa-trash-alt" style="cursor:pointer; color:red" onclick="disableRow(\''+count+'\')"></i>'+
                            '</td>'+
                        '</tr>'+
                        '<tr width="100%" id="'+count+'-line" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="2">'+
                            '<div class="form-row">'+
                                '<div class="col">';
                                    var valueForEdit = "";
                                    if(line[1] == undefined){
                                        valueForEdit="";
                                    }else{
                                        valueForEdit= "'"+line[1]+"'";
                                    }   
                                    html = html +'Value: <input class="form-control" id="'+count+'-value-displayed" value='+valueForEdit+'>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td colspan="2">';
                            // console.log(valueForEdit);
                            // '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewValue(\''+count+'-key-data\', \''+count+'-value-displayed\', \''+valueForEdit+'\')">Save</button>'+
                            html = html + '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewValue(\''+count+'\')">Save</button>'+
                            '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideEditValue(\''+count+'-line\')">Close</button>'+
                        '</td>'+
                    '</tr>';
                    count++;
                    }
                    document.getElementById("number-of-elements").value=count-1;
                html = html +'</tbody>'+
            '</table>'+
            '<br>'+
            '<div class="float-right" style="width:100%;">'+
                '<a class="btn btn-primary float-right text-decoration-none text-white" onclick="saveCurrentRule()">Save</a> &nbsp'+
                '<a class="btn btn-danger float-right text-decoration-none text-white" style=" margin-right: 10px;" onclick="cancelRuleEdit()">Cancel</a>'+
            '</div>';
        content.innerHTML = content.innerHTML + response.data.raw + "<br><br><br><br>";
        content.innerHTML = content.innerHTML + html + "<br><br>";

    })
    .catch(function (error) {
        console.log(error);
    });
}

function saveCurrentRule(){
    var urlWeb = new URL(window.location.href);
    var fileuuid = urlWeb.searchParams.get("fileuuid");

    var type = document.getElementById("type-match-value").innerHTML;
    var proto = document.getElementById("proto-match-value").innerHTML;
    var source = document.getElementById("source-match-value").innerHTML;
    var dir = document.getElementById("direction-match-value").innerHTML;
    var dest = document.getElementById("destination-match-value").innerHTML;
    var sourcePort = document.getElementById("source-port-match-value").innerHTML;
    var destPort = document.getElementById("destination-port-match-value").innerHTML;

    var finalLine = type+" "+proto+" "+source+" "+sourcePort+" "+dir+" "+dest+" "+destPort+" (";

    // console.log(finalLine);

    var count = document.getElementById("number-of-elements").value;
    for(x = 0; x <= count; x++){
        var classValue = document.getElementsByClassName(x+'-row-displayed');
        if(classValue.length != 0){
            finalLine = finalLine + document.getElementById(x+'-key-data').innerHTML
            // console.log(document.getElementById(x+'-value-data').value);
            // console.log(document.getElementById(x+'-value-data').innerHTML)
            if(document.getElementById(x+'-value-data').innerHTML.length != 0){
                finalLine = finalLine +":"+document.getElementById(x+'-value-data').innerHTML+";";
            }else{
                finalLine = finalLine +";";
            }
            // console.log(document.getElementById(x+'-key-data').innerHTML+"   *--*   "+document.getElementById(x+'-value-data').innerHTML);

        }
    }
    finalLine = finalLine + ")";
    console.log(finalLine);
    
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/updateRule';

    var jasonRule = {}
    jasonRule["line"] = finalLine;
    jasonRule["uuid"] = fileuuid;
    var dataJSON = JSON.stringify(jasonRule);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
    })
    .catch(function (error) {
    });


}