document.addEventListener('DOMContentLoaded', GetAllRules(), false);

function GetAllRules() {

    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("ruleset");

    var resultElement = document.getElementById('ruleset-table');
    var ip = "https://192.168.14.13";
    var port = ":50001";
    var route = "/ruleset/rules/"+uuid;
    //axios.get('https://192.168.14.13:50001/v1/ruleset')
    axios.get(ip+port+'/v1'+route)
      .then(function (response) {
        resultElement.innerHTML = generateAllRulesHTMLOutput(response, uuid);
      })
      .catch(function (error) {
        resultElement.innerHTML = generateAllRulesHTMLOutput(error);
      });   
  }

function generateAllRulesHTMLOutput(response, uuid) {
  var rules = response.data;
  var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
              '<thead>                                                      ' +
              '<tr>                                                         ' +
              '<th style="width: 10%">Sid</th>                              ' +
              '<th style="width: 10%">Status</th>                           ' +
              '<th>Description</th>                                         ' +
              '<th>Notes</th>                                               ' +
              '<th>IP info</th>                                             ' +
              '<th>Details</th>                                             ' +
              '</tr>                                                        ' +
              '</thead>                                                     ' +
              '<tbody >                                                     ' 
  for (rule in rules) {
    var ruleStatus;
    if (rules[rule]["enabled"] == "Enabled") {
      ruleStatus = "Disable"
    }else{
      ruleStatus = "Enable"
    }
    console.log(rules[rule]["sid"]);
    html = html + '<tr><td>'+
      rules[rule]["sid"]                                                    +
      '</td><td>                                                           '+
      rules[rule]["enabled"]                                                +
      '</td><td>                                                           '+
      rules[rule]["msg"]                                                    +
      '</td><td>'                                                           +
      rules[rule]["note"]                                                   +      
      '</td><td>                                                           '+
      rules[rule]["ip"]                                                     +
      '</td><td>                                                           '+
      '<a href="rules/showRuleDetails.php?sid='+rules[rule]["sid"]+'&uuid='+uuid+'"><button type="submit" class="btn btn-primary">Rules</button></a> '+
      '<button type="submit" onclick="changeRulesetStatus(\''+rules[rule]["sid"]+'\',\''+uuid+'\',\''+ruleStatus+'\')" class="btn btn-secondary">'+ruleStatus+'</button> '+
      '<button type="submit" data-toggle="modal" data-target="#modal-ruleset-note" onclick="modalNotes(\''+rules[rule]["sid"]+'\',\''+uuid+'\')" class="btn btn-secondary">Notes</button>'+
      '</td></tr>'
  }
  html = html + '  </tbody></table>';
  
  console.log("End function")


  return  html;
}

function changeRulesetStatus(sid, uuid, action){
  var ip = "https://192.168.14.13";
  var port = "50001";
  var route = "/action";
  var nodeurl = ip + ':' + port + '/v1/ruleset' + route;

  var jsonbpfdata = {}
  jsonbpfdata["sid"] = sid;
  jsonbpfdata["uuid"] = uuid;
  jsonbpfdata["action"] = action;
  var bpfjson = JSON.stringify(jsonbpfdata);

  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000,
    data: bpfjson
  })
    .then(function (response) {
      return true
    })
    .catch(function (error) {
      return false;
    }); 
}

function modalNotes(sid, uuid){
  var modalWindow = document.getElementById('modal-ruleset-note');
  modalWindow.innerHTML = 
  '<div class="modal-dialog" role="document">'+
    '<div class="modal-content">'+

      '<div class="modal-header">'+
        '<h4 class="modal-title" id="ruleset-note-header-title">Rule '+sid+'</h4>'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
      '</div>'+

      '<div class="modal-body" id="ruleset-note-footer">'+ 
        '<h7 class="modal-title">Notes</h7>'+
        '<textarea class="form-control" rows="3" id="ruleset-notes"></textarea>'+
      '</div>'+

      '<div class="modal-footer" id="ruleset-note-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="rulesetNotes(\''+sid+'\',\''+uuid+'\')">Save changes</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  //console.log("NOTA "+getRuleNote("note-column-rule"));
  getRuleNote("ruleset-notes", uuid, sid);
}

function getRuleNote(elementID, uuid, sid){
  console.log (elementID+" "+uuid+" "+sid)
  ip = "192.168.14.13";
  port = "50001";
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/ruleset/getnote/'+uuid+'/'+sid;

  var loadNote = document.getElementById(elementID);
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      console.log(response.data);
      //control if data is null --> Object 
      if (typeof(response.data) === 'object'){
        loadNote.value = '';
      }else {
        loadNote.value = response.data;
      }
      
      //loadNote.innerHTML = response.data;
      return true;
    })
    .catch(function (error) {
      return false;
    });
}


function rulesetNotes(sid, uuid){
  var textAreaNote = document.getElementById('ruleset-notes').value;
  console.log("nueva nota"+textAreaNote);
  console.log("url datos --> "+sid+" "+uuid);
  var ip = "https://192.168.14.13";
  var port = "50001";
  var route = "/note";
  var nodeurl = ip + ':' + port + '/v1/ruleset' + route;

  var jsonbpfdata = {}
  jsonbpfdata["sid"] = sid;
  jsonbpfdata["uuid"] = uuid;
  jsonbpfdata["note"] = textAreaNote;
  var bpfjson = JSON.stringify(jsonbpfdata);

  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000,
    data: bpfjson
  })
    .then(function (response) {
      return true
    })
    .catch(function (error) {
      return false;
    }); 


}