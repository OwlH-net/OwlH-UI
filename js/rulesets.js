document.addEventListener('DOMContentLoaded', GetAllRules(), false);

function GetAllRules() {
    var resultElement = document.getElementById('rulesets-table');
    var ip = "https://192.168.14.13";
    var port = ":50001";
    var route = "/ruleset";
    axios.get(ip+port+'/v1'+route)
      .then(function (response) {
        resultElement.innerHTML = generateAllRulesHTMLOutput(response);
      })
      .catch(function (error) {
        resultElement.innerHTML = generateAllRulesHTMLOutput(error);
      });   
  }

  function generateAllRulesHTMLOutput(response) {
    var rules = response.data;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th>Name</th>                                                ' +
                '<th>Path</th>                                                ' +
                '<th>Description</th>                                         ' +
                '<th>Actions</th>                                             ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (rule in rules) {
    html = html + '<tr><td>'+
        rules[rule]["name"]                                                    +
        '</td><td>                                                            '+
        rules[rule]["path"]                                                    +
        '</td><td>                                                            '+
        rules[rule]["desc"]                                                    +
        '</td><td>                                                            '+
        '<a href="ruleset.html?ruleset='+rule+'"><button type="submit" class="btn btn-primary">Details</button></a> '+
        '<button type="submit" class="btn btn-secondary" data-toggle="modal" data-target="#modal-ruleset-clone" onclick="cloneRuleset(\''+rules[rule]["name"]+'\', \''+rules[rule]["path"]+'\')">Clone</button>       '+
        '</td></tr>                                                           '
    }
    html = html + '  </tbody></table>';
    return  html;
  }


  function cloneRuleset(name, path){

    var modalWindow = document.getElementById('modal-ruleset-clone');
  
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+

        '<div class="modal-header">'+
          '<h4 class="modal-title" id="ruleset-manager-header">Rules</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+

        '<div class="modal-body" id="ruleset-manager-footer-table">'+ 
          '<h7 class="modal-title">Introduzca el nombre del nuevo ruleset</h7>'+
          '<input class="form-control" id="input-clone-ruleset" type="text" placeholder="...">'+
        '</div>'+

        '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
          '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveClonedRuleset(\''+name+'\' , \''+path+'\')">Save changes</button>'+
        '</div>'+

      '</div>'+
    '</div>';
 
  }

  function saveClonedRuleset(name, path){
    var newName = document.getElementById('input-clone-ruleset').value;


    //pasar por JSON el nombre del que se quiere clonar y el nuevo nombre.

    ip = "192.168.14.13";
    port = "50001";
    var nodeurl = 'https://'+ ip + ':' + port + '/v1/ruleset/clone';
  
    var jsonbpfdata = {}
    jsonbpfdata["cloned"] = name;
    jsonbpfdata["new"] = newName;
    jsonbpfdata["path"] = path;
    var bpfjson = JSON.stringify(jsonbpfdata);

    if(newName != ""){
      axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: bpfjson
      })
        .then(function (response) {
          return true;
        })
        .catch(function (error) {
          return false;
        });  
    }else{
      //alert window
      alert("You must enter a new ruleset name");
    }
 


  }