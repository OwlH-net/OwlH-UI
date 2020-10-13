
function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+location.host+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+location.host+'/login.html';}

        //login button
        document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user

        var ipmaster = document.getElementById('ip-master');
        ipmaster.value = data.master.ip;
        var portmaster = document.getElementById('port-master');
        portmaster.value = data.master.port;
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();

function LoadNodes() {
    // var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.host+'/login.html';
    }else{
        document.location.href='https://'+location.host+'/nodes.html';
    }
}
function LoadGroups(){
    // var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.host+'/login.html';
    }else{
        document.location.href='https://'+location.host+'/groups.html';
    }
}
function LoadOpenrules(){
    // var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.host+'/login.html';
    }else{
        document.location.href='https://'+location.host+'/rulesets.html';
    }
}
function LoadMaster(){
    // var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.host+'/login.html';
    }else{
        document.location.href='https://'+location.host+'/master.html';
    }
}
function LoadConfig(){
    // var ipmaster = document.getElementById('ip-master').value;
    if (document.cookie == null){
        document.location.href='https://'+location.host+'/login.html';
    }else{
        document.location.href='https://'+location.host+'/config.html';
    }
}