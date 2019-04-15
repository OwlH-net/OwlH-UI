//load json data from local file
function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
    });
}
loadJSONdata();