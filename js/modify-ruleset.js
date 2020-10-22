function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}
        
        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user

        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;      
        loadRulesData();

        loadTitleJSONdata();      
    });
}
var payload = "";
loadJSONdata();

function loadRulesData(){
    var urlData = new URL(window.location.href);
    var rulesetUuid = urlData.searchParams.get("uuid");
    var rulesetName = urlData.searchParams.get("name");
    var rulesetDesc = urlData.searchParams.get("desc");

    var result = document.getElementById('new-ruleset-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getAllRuleData';
    document.getElementById('progressBar-create').style.display = "none";
    document.getElementById('progressBar-create-div').style.display = "none";
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            result.innerHTML = generateAllRuleDataHTMLOutput(response.data);
            $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, "modify");});
            for (source in response.data){
                if (response.data[source]["type"] && document.getElementById('selector-checkbox-'+response.data[source]["sourceUUID"]) != null){
                    document.getElementById('selector-checkbox-'+response.data[source]["sourceUUID"]).addEventListener("click", function(){addRulesetFilesToTable(response.data)} ); 
                }else{
                    continue;
                }
            }         
        }

        //check for modify status
        //change input name and desc
        document.getElementById('new-ruleset-name-input').value = rulesetName;
        document.getElementById('new-ruleset-description-input').value = rulesetDesc;
        //change button text
        document.getElementById('top-add-btn').innerHTML = "Modify";
        document.getElementById('bot-add-btn').innerHTML = "Modify";
        //change title and subtitle
        document.getElementById('title-banner').innerHTML = "Modify ruleset";
        document.getElementById('subtitle-banner').innerHTML = "Ruleset: "+rulesetName;
        loadCurrentRules(rulesetUuid);
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function generateAllRuleDataHTMLOutput(sources) {
    var html = "";
    var isEmpty = true;
    var arrayRulesets = new Array();
    var ids = new Array();
    var rulesetsIds = new Array();

    if (sources.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error creating ruleset</h3></div>';
    }
    html = html + 
    '<div>'+
        '<div class="input-group">'+
            '<div class="input-group-prepend">'+
                '<span class="input-group-text">Ruleset Name</span>'+
            '</div>'+
            '<input type="text" class="form-control" placeholder="Ruleset name" id="new-ruleset-name-input">'+
        '</div>'+
        '<br>'+
        '<div class="input-group">'+
            '<div class="input-group-prepend">'+
                '<span class="input-group-text">Ruleset Description</span>'+
            '</div>'+
            '<input type="text" class="form-control" placeholder="Ruleset description" id="new-ruleset-description-input">'+
        '</div>'+
        '<br>'+
        '<button id="top-add-btn" class="btn btn-primary float-right createNewRulesetLocal" type="button">Add</button>'+
    '</div>'+
    '<br>'+

    '<h5>Select rulesets</h5>'+
    '<div class="form-check">';
    for (source in sources) {
        if(sources[source]["type"] == "source"){            
            if(!arrayRulesets.includes(sources[source]["name"])){
                arrayRulesets.push(sources[source]["name"]);
                rulesetsIds.push(sources[source]["sourceUUID"]);
                html = html +'<ul class="checkbox-grid">'+
                ' <li style="display: block; float: left; width: 25%"><input class="ruleset-input ruleset-source" type="checkbox" sourceUUID="'+sources[source]["sourceUUID"]+'" value="'+sources[source]["name"]+'" id="selector-checkbox-'+sources[source]["sourceUUID"]+'" checked/><label for="'+sources[source]["name"]+'">&nbsp'+sources[source]["name"]+'</label></li>'+
                '</ul>';
                
            }
        }else{
            continue;
        }
    }
    html = html +'</div>'+
        
    '<br><br>'+
    '<br><br><br>'+

    '<div class="input-group mt-1" width="100%">'+
        '<input class="form-control" type="text" id="ruleset-search-input" onkeyup="searchRuleset(\''+arrayRulesets+'\', \''+rulesetsIds+'\')" placeholder="Search by rule file name..." title="Insert a ruleset name for search"> &nbsp'+
    '</div>'+
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px" id="create-ruleset-table">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 10%"><input type="checkbox" id="select-all-create-ruleset" onchange="CheckAll(this)"></th>' +
        '<th>Ruleset name</th>                                          ' +
        '<th>File name <i id="sort-nodes-name" class="fas fa-sort" sort="desc" style="cursor: pointer;" onclick="sortTableName()"></i></th>' +
        '<th>File path</th>                                          ' +
        '<th>Source</th>                                          ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody id="create-ruleset-table-body">' ;
            for (source in sources) {        
                if(sources[source]["type"]){
                    if(sources[source]["exists"]=="true"){
                        isEmpty = false;
                        html = html + '<tr id="row-'+source+'" rulesetfile="'+sources[source]["file"]+'" sourceUUID="'+sources[source]["sourceUUID"]+'">'+
                            '<td style="width: 100%; word-wrap: break-word;" align="center">'+
                                '<input class="form-check-input" type="checkbox" value="table-elements" id="'+source+'"></input>'+
                            '</td>'+
                            '<td style="word-wrap: break-word;" id="nameNewRuleset-'+source+'" value="'+sources[source]["sourceType"]+'">'+                 
                                sources[source]["name"]+
                            '</td><td class="fileName" style="word-wrap: break-word;" id="fileNewRuleset-'+source+'">'+
                                sources[source]["file"]+
                            '</td><td style="word-wrap: break-word;" id="pathNewRuleset-'+source+'">'+
                                sources[source]["path"]+
                            '</td><td style="word-wrap: break-word;" style="display:none;" id="source-type-'+source+'">';
                                if (sources[source]["sourceType"]){
                                    html = html + sources[source]["sourceType"];
                                }else{
                                    html = html + sources[source]["type"];
                                }
                            html = html + '</td></tr>';
                    }
                }else{
                    continue;
                }
            }
    html = html + '</tbody></table>'+
    '<br><button id="bot-add-btn" class="btn btn-primary float-right createNewRulesetLocal" type="button">Add</button><br><br>';     

    if (isEmpty){
        return '<h3 style="text-align:center">There are no ruleset sources created</h3>'+
        '<br>'+
        '<h3 style="text-align:center">Please, create a new ruleset source first</h3>'+
        '<br>'+
        '<div class="text-center">'+
            '<a class="text-white btn btn-primary" href="ruleset-source.html">Edit ruleset source</a>'+
        '</div>';
    }else{
        return html;
    }
}

function CheckAll(ele){       
    if (ele.checked) {
        $('input:checkbox:not(checked)').each(function() {
            var value = $(this).prop("value");
            var id = $(this).prop("id");
            if (value == "table-elements" && document.getElementById("row-"+id).style.display != 'none'){                
                $(this).prop("checked", true);
            }
        });
    } else {
        $('input:checkbox:checked').each(function() {
            var value = $(this).prop("value");
            var id = $(this).prop("id");
            if (value == "table-elements" && document.getElementById("row-"+id).style.display != 'none'){
                $(this).prop("checked", false);
            }
        });
    }
}

function addRulesetFilesToTable(sources){
    $('input:checkbox:checked').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                $('#row-'+source).show();
                $('#row-'+source).val("true");
            }
        }
    });
    $('input:checkbox:not(:checked)').each(function() {
        var checked = $(this).prop("value");
        for (source in sources){
            if (checked == sources[source]["name"]){
                $('#row-'+source).hide();
                $('#row-'+source).val("false");
                $('#'+source).prop('checked', false);
            }
        }
    });
}

function searchRuleset(rulesetNames, checkboxIds){    
    var boxes = checkboxIds.split(",");
    var input, filter, table, tr;
    input = document.getElementById("ruleset-search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("create-ruleset-table");
    tr = table.getElementsByTagName("tr");

    $.each( boxes, function( key, value ) {
        if($('#selector-checkbox-'+value).is(':checked')){            
            $('#create-ruleset-table-body tr').each(function () {
                if($(this).attr('sourceUUID') == value){
                    var tdContent = $(this).find(".fileName").html();
                    if(tdContent.toUpperCase().includes(filter)){
                    // if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        }
    });
}

function modalAddNewRuleset(rulesetUuid, status){   
    var count = 0;
    var flag = false;
    var sources = [];
    $('input[type=checkbox]').each(function () {
        if($(this).hasClass('ruleset-source')){
            if($(this).prop('checked')){
                sources.push($(this).val());
                count++;
            }
        }
    });

    //show progress-bar
    document.getElementById('progressBar-create-div').style.display="block";
    document.getElementById('progressBar-create').style.display="block";    
    var length = 0;
    var rulesetCount = 0;

    var modifyRuleset = new Map();
    $('input:checkbox:checked').each(function() {        
        var uuid = $(this).prop("id");
        var value = $(this).prop("value");
        if (value == "table-elements"){
            rulesetCount++;
            modifyRuleset[uuid.replace('row-','')] = new Map();
            modifyRuleset[uuid.replace('row-','')]["sourceName"] = document.getElementById('nameNewRuleset-'+uuid+'').innerHTML;
            modifyRuleset[uuid.replace('row-','')]["fileName"] = document.getElementById('fileNewRuleset-'+uuid+'').innerHTML;
            modifyRuleset[uuid.replace('row-','')]["filePath"] = document.getElementById('pathNewRuleset-'+uuid+'').innerHTML;
            modifyRuleset[uuid.replace('row-','')]["rulesetName"] = document.getElementById('new-ruleset-name-input').value.trim();
            modifyRuleset[uuid.replace('row-','')]["rulesetDesc"] = document.getElementById('new-ruleset-description-input').value.trim();
            modifyRuleset[uuid.replace('row-','')]["sourceType"] = document.getElementById('source-type-'+uuid).innerHTML;
            modifyRuleset[uuid.replace('row-','')]["uuid"] = rulesetUuid;
            length++;
        }
    });

    console.log(modifyRuleset)

    var isDuplicated = false;
    for (uuid in modifyRuleset){
        for (uuidCheck in modifyRuleset){
            if ((uuid != uuidCheck) && (modifyRuleset[uuid]["fileName"] == modifyRuleset[uuidCheck]["fileName"]) ){
                isDuplicated = true;
            }
        }
    }

    if(document.getElementById('new-ruleset-name-input').value == "" || document.getElementById('new-ruleset-description-input').value == "") {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none";

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Name or description fields are null.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, status);});
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    }else if (isDuplicated){      
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none";
        
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

        $('#modal-window').modal('show');
        $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, status);});     
    } else if (length == 0){
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none";
        
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Cannot create an empty ruleset.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);      
    } else {  
        if(count > 1){
            document.getElementById('progressBar-create-div').style.display="none";
            document.getElementById('progressBar-create').style.display="none";
            document.getElementById('modal-window').innerHTML = 
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
            
                    '<div class="modal-header" style="word-break: break-all;">'+
                        '<h4 class="modal-title">Files selected</h4>'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '</div>'+
            
                    '<div class="modal-body" style="word-break: break-all;">'+ 
                        '<p>Ruleset sources selected: '+sources.toString()+'</p>'+
                        '<p>You selected <b>'+rulesetCount+'</b> rulesets</p>'+
                    '</div>'+
            
                    '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                        '<button id="modalClose" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '<button id="modalSend" type="button" class="btn btn-primary" data-dismiss="modal">Modify</button>'+
                    '</div>'+
            
                '</div>'+
            '</div>';
            $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, status);});
            $('#modal-window').modal('show');
            $('#modalClose').click(function(){ $('#modal-window').modal('hide');});            
            $('#modalSend').click(function(){ CreateRulesetAfterCheckData(rulesetUuid,modifyRuleset); $('#modal-window').modal('hide');});
        }else{
            CreateRulesetAfterCheckData(rulesetUuid, modifyRuleset);   

        }
    }
}
function CreateRulesetAfterCheckData(rulesetUuid, modifyRuleset){
    console.log(modifyRuleset)
    $('#modal-window').modal('hide');        
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/modify';
    var nodeJSON = JSON.stringify(modifyRuleset);

    axios({
        method: 'put',
        url: sourceurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: nodeJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}               
        if(response.data.permissions == "none"){
            document.getElementById('progressBar-create-div').style.display="none";
            document.getElementById('progressBar-create').style.display="none";
            PrivilegesMessage();              
        }else{
            if (response.data.ack == "true"){                
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";
                document.location.href = 'rulesets.html';
            }else if (response.data.ack == "false"){
                $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, status);});
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";

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
                $(".createNewRulesetLocal").bind("click", function(){modalAddNewRuleset(rulesetUuid, status);});
                document.getElementById('progressBar-create-div').style.display="none";
                document.getElementById('progressBar-create').style.display="none";
                    
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
                                                '<td style="word-wrap: break-word;">'+
                                                    lines[sid][values][data]["fileName"] +
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
        }
    })
    .catch(function (error) {
    });    
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function sortTableName() {
    var type = document.getElementById('sort-nodes-name').getAttribute("sort");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("create-ruleset-table");
    switching = true;
    while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getAttribute("rulesetfile");
            y = rows[i + 1].getAttribute("rulesetfile");

            if (type == "asc"){
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }else{
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
    }

    //change attr
    if (type == "asc"){
        document.getElementById('sort-nodes-name').setAttribute("sort", "desc");
    }else{
        document.getElementById('sort-nodes-name').setAttribute("sort", "asc");
    }
}

function loadCurrentRules(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/getDetails/'+uuid;
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
           $('input:checkbox:not(checked)').each(function() {
                var id = $(this).prop("id");
                for(x in response.data){
                    if(id == response.data[x]["sourceFileUUID"]){
                        $(this).prop("checked", true);                      
                    }
                }
            });        
        }
    })
    .catch(function (error) {
    });
}