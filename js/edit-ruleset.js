function loadRulesetContent(){
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var file = url.searchParams.get("file");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var textArea = document.getElementById('inputTextUI');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/readRuleset/'+uuid;
    document.getElementById('edit-ruleset-title').innerHTML = file; 

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        textArea.innerHTML = response.data.fileContent;
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function saveRulesetContent(){
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
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
        data: rulesetData
    })
    .then(function (response) {
        closeFileChanged();
        return true;
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
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        loadRulesetContent();
    });
}
loadJSONdata();