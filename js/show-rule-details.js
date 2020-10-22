function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
                //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+data.master.ip+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+data.master.ip+'/login.html';}
        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
         
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadRule();        
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();

function loadRule(){
    var urlWeb = new URL(window.location.href);
    var fileuuid = urlWeb.searchParams.get("fileuuid");
    var sid = urlWeb.searchParams.get("sid");
    getRule(sid, fileuuid);
}

function cancelRuleEdit(){
    window.history.back();
}

function showModifyValue(key){
    $('#'+key).show();
}

function hideInputAreaValue(key){
    document.getElementById(key).style.display = "none";
}

function disableRow(count){
    document.getElementById(count+'-data-row').style.display = "none";
    document.getElementById(count+'-data-row').className = "hidden";
}

function saveNewMatchValue(type){   
    document.getElementById(type+'-match-value').innerHTML = document.getElementById(type+'-input-value').value.trim();
    $('#'+type+'-match').hide();
}

function saveNewValue(type){    
    document.getElementById(type+'-value-data').innerHTML = document.getElementById(type+'-value-displayed').value.trim();
    $('#'+type+'-line').hide();
}

function ChangeStatus(newStatus){
    var type = document.getElementById("type-match-value").innerHTML;
    var re = /^#/;
    var lineStatus = type.match(re)
    if(lineStatus != null && newStatus == "Enable"){
        var statusChanged = type.replace("#", "");
        type = statusChanged;
        document.getElementById("type-match-value").innerHTML = statusChanged;
        saveCurrentRule();
    }else if(lineStatus == null && newStatus == "Disable"){
        var statusChanged = type.replace(type, "#"+type);
        document.getElementById("type-match-value").innerHTML = statusChanged;
        saveCurrentRule();
    }
}

function getRule(sid, fileuuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/ruleset/rule/'+sid+'/'+fileuuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                var re = /msg:\s?"([^"]+)"/;
                var inline = response.data.raw.match(re)
                var title = document.getElementById('rule-title');
                var secondaryTitle = document.getElementById('rule-subtitle');
                title.innerHTML = title.innerHTML + inline[1];
                secondaryTitle.innerHTML = secondaryTitle.innerHTML + sid;
                
                var content = document.getElementById('rule-content');  
                var html =
                '<div class="float-right" style="width:100%;">'+
                    '<span style="cursor: pointer;" onclick="ChangeStatus(\'Enable\')" class="sort-table badge bg-success align-text-bottom text-white float-left mr-1">Enable</span>'+
                    '<span style="cursor: pointer;" onclick="ChangeStatus(\'Disable\')" class="sort-table badge bg-danger align-text-bottom text-white float-left mr-1">Disable</span>'+
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
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'type\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'type-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="proto-input-value" value="'+valuesSplited[1]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'proto\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'proto-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="source-input-value" value="'+valuesSplited[2]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'source\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'source-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="source-port-input-value" value="'+valuesSplited[3]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'source-port\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'source-port-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="direction-input-value" value="'+valuesSplited[4]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'direction\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'direction-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="destination-input-value" value="'+valuesSplited[5]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'destination\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'destination-match\')">Close</button>'+
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
                                            'Value: <input class="form-control" id="destination-port-input-value" value="'+valuesSplited[6]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewMatchValue(\'destination-port\')">Save</button>'+
                                    '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'destination-port-match\')">Close</button>'+
                                '</td>'+
                            '</tr>'+   
                        '</tbody>'+
                    '</table><br><br>'+
                    '<table width="100%" class="table table-hover" style="table-layout: fixed">'+
                        '<thead>'+
                            '<th width="25%">Key</th>'+
                            '<th width="60%">Value</th>'+
                            '<th width="15%" style="vertical-align: bottom;">Actions</th>'+
                            '<th width="5%"><button class="btn btn-primary float-right text-decoration-none text-white" id="add-new-key-value-line">Add key</button></th>'+
                        '</thead>'+
                        '<tbody id="key-value-content-body">'+
                            '<tr style="display:none;" bgcolor="palegreen" id="add-new-value-row">'+
                                '<div>'+
                                    '<td>Match: <input class="form-control" id="input-for-add-new-key" placeholder="Insert a new key here"> </td>'+                            
                                '</div>'+
                                '<div>'+
                                    '<td>Match: <input class="form-control" id="input-for-add-new-value" placeholder="Insert a new value here"></td>'+
                                '</div>'+
                                '<div>'+
                                    '<td colspan="2">'+
                                        '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="addNewLine()">Save</button>'+
                                        '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\'add-new-value-row\')">Close</button>'+
                                    '</td>'+
                                '</div>'+
                            '</tr>';
    
                        var rawMatchRegexp = /([^\(]+)\((.*)\)/;
                        var rawline = response.data.raw.match(rawMatchRegexp)
                        var valuesSplited = rawline[2].split(';');
                        var count = 1;
                            for(value in valuesSplited){
                                var vlen = valuesSplited[value].length;
                                if (vlen == 1) {
                                    continue;
                                }
                                var line = valuesSplited[value].split(':');
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
                                    '<td colspan="2">'+
                                        '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewValue(\''+count+'\')">Save</button>'+
                                        '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\''+count+'-line\')">Close</button>'+
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
                content.innerHTML = content.innerHTML + '<b>RAW rule</b><br><p id="raw-rule" style="word-wrap: break-word;">'+response.data.raw + '</p><br><br><br><br>';
                content.innerHTML = content.innerHTML + html + "<br><br>";
                $('#add-new-key-value-line').click(function(){ $('#add-new-value-row').show(); });
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function addNewLine(){        
    if (document.getElementById("input-for-add-new-key").value == ""){
        $("#input-for-add-new-key").prop('required',true);
    }else{
        $("#add-new-value-row").hide();
        var html = ""
        document.getElementById("number-of-elements").value++;
        var count = document.getElementById("number-of-elements").value;
    
        html = html + '<tr class="'+count+'-row-displayed" id="'+count+'-data-row" value="'+count+'">'+
            '<td style="word-wrap: break-word;" id="'+count+'-key-data" value="'+document.getElementById("input-for-add-new-key").value.trim()+'">'+document.getElementById("input-for-add-new-key").value.trim()+'</td>'+
            '<td style="word-wrap: break-word;" id="'+count+'-value-data" value="'+document.getElementById("input-for-add-new-value").value.trim()+'">'+document.getElementById("input-for-add-new-value").value.trim()+'</td>'+                                
            '<td style="word-wrap: break-word;" colspan="2">'+
                '<i class="fas fa-edit" style="cursor:pointer; color:grey" onclick="showModifyValue(\''+count+'-line\')"></i> &nbsp'+
                '<i class="fas fa-trash-alt" style="cursor:pointer; color:red" onclick="disableRow(\''+count+'\')"></i>'+
            '</td>'+
        '</tr>'+
        '<tr width="100%" id="'+count+'-line" style="display:none;" bgcolor="peachpuff">'+
            '<td style="word-wrap: break-word;" colspan="2">'+
                '<div class="form-row">'+
                    '<div class="col">'+ 
                        'Value: <input class="form-control" id="'+count+'-value-displayed" value='+document.getElementById("input-for-add-new-value").value.trim()+'>'+
                    '</div>'+
                '</div>'+
            '</td>'+
            '<td colspan="2">'+
                '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="saveNewValue(\''+count+'\')">Save</button>'+
                '<button class="btn btn-danger float-right text-decoration-none text-white" onclick="hideInputAreaValue(\''+count+'-line\')">Close</button>'+
            '</td>'+
        '</tr>';
    
        document.getElementById('key-value-content-body').innerHTML = document.getElementById('key-value-content-body').innerHTML + html;        
    }
}

function saveCurrentRule(){
    var urlWeb = new URL(window.location.href);
    var fileuuid = urlWeb.searchParams.get("fileuuid");
    var jasonRule = {}

    var type = document.getElementById("type-match-value").innerHTML;
    var proto = document.getElementById("proto-match-value").innerHTML;
    var source = document.getElementById("source-match-value").innerHTML;
    var dir = document.getElementById("direction-match-value").textContent;
    var dest = document.getElementById("destination-match-value").innerHTML;
    var sourcePort = document.getElementById("source-port-match-value").innerHTML;
    var destPort = document.getElementById("destination-port-match-value").innerHTML;

    var finalLine = type+" "+proto+" "+source+" "+sourcePort+" "+dir+" "+dest+" "+destPort+" (";

    var count = document.getElementById("number-of-elements").value;
    for(x = 0; x <= count; x++){
        var classValue = document.getElementsByClassName(x+'-row-displayed');
        if(classValue.length != 0){
            finalLine = finalLine + document.getElementById(x+'-key-data').innerHTML
            if(document.getElementById(x+'-value-data').innerHTML.length != 0){
                finalLine = finalLine +":"+document.getElementById(x+'-value-data').innerHTML+";";
            }else{
                // finalLine = finalLine +";";
            }
            if (document.getElementById(x+'-key-data').innerHTML == "sid"){jasonRule["sid"] = document.getElementById(x+'-value-data').innerHTML;}
        }
    }
    finalLine = finalLine + ")";
    
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/updateRule';
    
    // //replace raw line by this
    // document.getElementById("raw-rule").innerHTML = finalLine;

    jasonRule["line"] = finalLine;
    jasonRule["uuid"] = fileuuid;
    var dataJSON = JSON.stringify(jasonRule);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Rule modified successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}