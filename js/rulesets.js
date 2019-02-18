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
                '<th>Details</th>                                             ' +
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
        '</td></tr>                                                           '
    }
    html = html + '  </tbody></table>';
    return  html;
  }