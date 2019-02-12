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


