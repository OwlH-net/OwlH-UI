document.addEventListener('DOMContentLoaded', GetAllRules(), false);

function GetAllRules() {
    var resultElement = document.getElementById('ruleset-table');
    var ip = "https://192.168.14.13";
    var port = ":50001";
    var route = "/ruleset";
    //axios.get('https://192.168.14.13:50001/v1/ruleset')
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
                '<th>Sid</th>                                                 ' +
                '<th>Status</th>                                              ' +
                '<th>Description</th>                                         ' +
                '<th>IP info</th>                                             ' +
                '<th>Rule</th>                                                ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (rule in rules) {
    html = html + '<tr><td>'+
        rules[rule]["sid"]                                                    +
        '</td><td>                                                            '+
        rules[rule]["enabled"]                                                +
        '</td><td>                                                            '+
        rules[rule]["msg"]                                                    +
        '</td><td>                                                            '+
        rules[rule]["ip"]                                                     +
        '</td><td>                                                            '+
        rules[rule]["raw"]                                                    +
        '</td></tr>                                                           '
    }
    html = html + '  </tbody></table>';
    return  html;
  }