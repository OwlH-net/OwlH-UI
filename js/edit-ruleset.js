function loadRulesetContent(){
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("fileuuid");
    var file = url.searchParams.get("file");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var textArea = document.getElementById('inputTextUI');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/readRuleset/'+uuid;
    document.getElementById('edit-ruleset-title').innerHTML = file; 

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
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
                    '<strong>Error: </strong>'+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                return '<div style="text-align:center"><h3 style="color:red;">Error retrieving ruleset ' + ruleName + '</h3></div>';
             }else{
                 textArea.innerHTML = response.data.fileContent;
                 return true;
             }
        }
    })
    .catch(function (error) {
        return false;
    });
}

function saveRulesetContent(){
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("fileuuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var textArea = document.getElementById('inputTextUI');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/saveRuleset';

    var jsondata = {}
    jsondata["uuid"] = uuid;
    jsondata["content"] = textArea.value;
    var rulesetData = JSON.stringify(jsondata);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: rulesetData
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            closeFileChanged();
            return true;
        }
    })
    .catch(function (error) {
        return false;
    });
}

function closeFileChanged(){
    window.history.back();
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
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
        loadRulesetContent();
    });
}
var payload = "";
loadJSONdata();