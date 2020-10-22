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
        loadTitleJSONdata();
        getRulesetsBySearch();
	});
}
var payload = "";
loadJSONdata();

function getRulesetsBySearch(){

    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    var urlWeb = new URL(window.location.href);
    var rulesetName = urlWeb.searchParams.get("rulesetName");
    var search = urlWeb.searchParams.get("search");

    if(rulesetName != null){
        document.getElementById('ruleset-search-title').innerHTML = "Search result for ruleset: "+rulesetName;
    }else{
        document.getElementById('ruleset-search-title').innerHTML = "Ruleset search results";
    }

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/search/getRulesetsBySearch';

    var jsondata = {}
    jsondata["search"] = search;
    if(rulesetName != null){jsondata["rulesetName"] = rulesetName;}
    var searchJSON = JSON.stringify(jsondata);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: searchJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                html = html + '<div style="text-align:center"><h3 style="color:red;">Error retrieving search results...</h3></div>';
            }else{
                var html = "";
                for (rule in response.data){    
                    html = html + '<table class="table table-hover" style="table-layout: fixed">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 20%">Sid</th>' +
                            '<th colspan="5">Description</th>' +                     
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';
                    html = html + '<tr>'+
                        '<td>'+response.data[rule]["sid"]+'</td>'+
                        '<td colspan="5">'+response.data[rule]["msg"]+'</td>'+
                    '</tr>'+
                    '<tr><td colspan="6">'+
                        '<table class="table table-hover" style="table-layout: fixed;  word-break: break-all">' +
                        '<thead>' +
                            '<th width="7%">Status</th>' +
                            '<th width="13%">Type</th>' +
                            '<th width="50%">File</th>' +
                            '<th width="20%">Ruleset Name</th>' +
                            '<th width="10%">Actions</th>' +
                        '</thead>';
                    var rulesets = response.data[rule]["Rulesets"];
                    for(element in rulesets){
                        html = html + '<tr>' +
                            '<td width="10%">';
                                if(rulesets[element]["status"] == "Enabled"){
                                    html = html + '<i class="fas fa-check-circle" style="color:green;"></i>';
                                }else{
                                    html = html + '<i class="fas fa-times-circle" style="color:red;"></i>';
                                }
                            html = html + '</td>';
                            html = html + '<td width="50%">'+rulesets[element]["type"]+'</td>';
                            // if(rulesets[element]["sourceType"] != ""){
                            //     // html = html + '<td width="50%">'+rulesets[element]["sourceType"]+'</td>';
                            // }else{
                            //     html = html + '<td width="50%">Source</td>';
                            // }                        
                            html = html + '<td width="50%">'+rulesets[element]["file"]+'</td>'+
                            '<td width="20%">'+rulesets[element]["name"]+'</td>'+
                            '<td width="10%"><i class="fas fa-eye low-blue" onclick="loadRulesetDetails(\''+response.data[rule]["sid"]+'\', \''+rulesets[element]["uuid"]+'\')"></i></td>' +
                        '</tr>';
    
                    }
                html = html + '</table></tr></tbody>' +
                '</table><br><br>';            }
            }
            document.getElementById('list-ruleset-search').innerHTML = html;
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
        }
    })
    .catch(function error(error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        localStorage.setItem("searchError", "error");
        document.location.href = 'https://' + location.host + '/rulesets.html';
    });
}

function loadRulesetDetails(sid, fileuuid){
    document.location.href = 'https://' + location.host + '/show-rule-details.html?sid='+sid+'&fileuuid='+fileuuid;
}