function axiosAddNode(node) {
  var logAll = document.getElementById('logAll');
  logAll.innerHTML = logAll.innerHTML + "<br/> node es - "+node;
  var nodeurl = 'https://192.168.14.13:50001/v1/node/';
  axios({
    method: 'post',
    url: nodeurl,
    timeout: 30,
    data: node
  })
    .then(function (response) {
      logAll.innerHTML = logAll.innerHTML + '<br/> success';
      return true;
    })
    .catch(function (error) {
      logAll.innerHTML = logAll.innerHTML + '<br/> error - ' + ip;
      return false;
    });   
  GetAllNodes();
  return false;
}

function axiosModifyNode(node) {
  var logAll = document.getElementById('logAll');
  logAll.innerHTML = logAll.innerHTML + "<br/> Modify node es - "+node;
  var nodeurl = 'https://192.168.14.13:50001/v1/node/';
  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30,
    data: node
  })
    .then(function (response) {
      logAll.innerHTML = logAll.innerHTML + '<br/> Modify success';
      return true;
    })
    .catch(function (error) {
      logAll.innerHTML = logAll.innerHTML + '<br/> Modify error - ';
      return false;
    });   

    document.getElementById('divconfigform').style.display = "none";

  //GetAllNodes();
  return false;
}

function addNode() {
    var nname = document.getElementById('nodename').value;
    var nip = document.getElementById('nodeip').value;
    var nport = document.getElementById('nodeport').value;
    var ntype = document.getElementById('nodetype').value;
    var logAll = document.getElementById('logAll');

    var nid = nname.replace(/ /gi, "-") + "-" + nip.replace(/\./g, "-");

    var nodejson = {}
    nodejson["name"] = nname;
    nodejson["id"] = nid;
    nodejson["port"] = nport;
    nodejson["ip"] = nip;
    nodejson["type"] = ntype;
    var nodeJSON = JSON.stringify(nodejson);
    err = axiosAddNode(nodeJSON);
}

function modifyNode() {
  var logAll = document.getElementById('logAll');
  alog (node);
  var name = document.getElementById('cfgnodename').value;
  var ip = document.getElementById('cfgnodeip').value;
  var port = document.getElementById('cfgnodeport').value;
  var nid = document.getElementById('cfgnodeid').value;
  var nodeurl = 'https://192.168.14.13:50001/v1/node';
  alog (ip)
  
  var nodejson = {}
    nodejson["name"] = name;
    nodejson["port"] = port;
    nodejson["ip"] = ip;
    nodejson["id"] = nid;
    var nodeJSON = JSON.stringify(nodejson);
    err = axiosModifyNode(nodeJSON);
}

function cancelNode(){
  var cancel = document.getElementById('divconfigform');
  document.getElementById('divconfigform').style.display = "none";
}

function loadBPF(nid){

  var inputBPF = document.getElementById('recipient-name');
  var headerBPF = document.getElementById('bpf-header');
  var footerBPF = document.getElementById("modal-footer-btn");
  var saveBTN = document.getElementById("btn-save-changes");
  
  headerBPF.innerHTML = "BPF - "+nid;
  //saveBTN.onclick = saveBPF(nid)

  
  footerBPF.innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveBPF(\''+nid+'\')" id="btn-save-changes">Save changes</button>';
                        //'<button type="button" class="btn btn-primary" onclick="saveBPF('+nid+')">Save changes</button>';

  //saveBTN.addEventListener('click', saveBPF(nid));

  ip = "192.168.14.13";
  port = "50001";
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/suricata/'+nid+'/bpf';
  //var response = '';
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      if('bpf' in response.data){
        inputBPF.value=response.data.bpf;     
      }else{
        inputBPF.value='';
        headerBPF.innerHTML = headerBPF.innerHTML + '<br> Not defined';
      }
    })
    .catch(function (error) {
      windowModalLog.innerHTML = error+"++<br>";
    });   

    //saveBTN.onclick = saveBPF(nid); 
}



function saveBPF(nid){
  var inputBPF = document.getElementById('recipient-name');
  ip = "192.168.14.13";
  port = "50001";
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/suricata/'+nid+'/bpf';

  var jsonbpfdata = {}
  jsonbpfdata["nid"] = nid;
  jsonbpfdata["bpf"] = inputBPF.value;
  var bpfjson = JSON.stringify(jsonbpfdata);

  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000,
    data: bpfjson
  })
    .then(function (response) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> Modify success';
      return true;
    })
    .catch(function (error) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> Modify error - ';
      return false;
    });   
}

