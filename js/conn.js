function loadConnData() {
  console.log('loadConnData ')
  //get ui.conf file content
  $.getJSON('../conf/ui.conf', function (data) {

    var ipLoad = document.getElementById('ip-master');
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;

    //load title and nodes
  });

}

loadConnData();