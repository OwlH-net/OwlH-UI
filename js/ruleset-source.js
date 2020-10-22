function formAddRulesetSource(){
    document.getElementById('edit-ruleset-source').style.display = "none";
    var addGroupId = document.getElementById('add-ruleset-source');
    var textGroupTop = document.getElementById('ruleset-source-text-top');
    var textGroupBot = document.getElementById('ruleset-source-text-bot');

    if (addGroupId.style.display == "none") {
        addGroupId.style.display = "block";
        textGroupTop.innerHTML = "Close add new ruleset source";
        textGroupBot.innerHTML = "Close add new ruleset source";
    } else {
        addGroupId.style.display = "none";
        textGroupTop.innerHTML = "Add new ruleset source";
        textGroupBot.innerHTML = "Add new ruleset source";
    }
}

function addRulesetSource() {
    var formName = document.getElementById('ruleset-source-name').value.trim();
    var formDesc = document.getElementById('ruleset-source-desc').value.trim();
    var formUrl = document.getElementById('ruleset-source-url').value.trim();
    var formUser = document.getElementById('ruleset-source-user').value.trim();
    var formPasswd = document.getElementById('ruleset-source-passwd').value.trim();
    var fileName = formUrl.split(/[\s/]+/);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    var sourceType;
    var sourceURL;
    var alert = document.getElementById('floating-alert');

    $('input:radio:checked').each(function() {
        if($(this).attr('value') != null){
            sourceType = $(this).attr("value");
        }
    });

    if ((sourceType == "url" || sourceType == "threat") && (formName == "" || formDesc == "" || formUrl == "" ||
    ((formUser == ""  && formPasswd != "") || (formUser != ""  && formPasswd == ""))) ||
    ($("#ruleset-source-secret-key").is(":visible") && document.getElementById('ruleset-source-secret-key').value == "")){
        //add alert dialog for complete form
        $('html,body').scrollTop(0);
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error adding a new ruleset source! </strong> Please, complete the form to continue.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);

        //check every input text
        if(formName == ""){
            $('#ruleset-source-name').css('placeholder', 'Please, insert a valid name.');
            $('#ruleset-source-name').css('border', '2px solid red');
        }
        if(formDesc == ""){
            document.getElementById('ruleset-source-desc').placeholder = "Please, insert a valid description.";
            $('#ruleset-source-desc').css('border', '2px solid red');
        }
        if(formUrl == ""){
            document.getElementById('ruleset-source-url').placeholder = "Please, insert a valid url.";
            $('#ruleset-source-url').css('border', '2px solid red');
        }
        if(formUser == "" ){
            document.getElementById('ruleset-source-user').placeholder = "Please, insert a valid username and password.";
            document.getElementById('ruleset-source-user').value = "";
            $('#ruleset-source-user').css('border', '2px solid red');
        }
        if(formPasswd == ""){
            document.getElementById('ruleset-source-passwd').placeholder = "Please, insert a valid username and password.";
            document.getElementById('ruleset-source-passwd').value = "";
            $('#ruleset-source-passwd').css('border', '2px solid red');
        }
        if ($("#ruleset-source-secret-key").is(":visible") && document.getElementById('ruleset-source-secret-key').value == ""){
            document.getElementById('ruleset-source-secret-key').placeholder = "URL secret key is needed.";
            $('#ruleset-source-secret-key').css('border', '2px solid red');
            document.getElementById('ruleset-source-user').placeholder = "User";
            document.getElementById('ruleset-source-user').value = "";
            $('#ruleset-source-user').css('border', '2px solid red');
        }
    }else if ((sourceType == "custom") && (formName == "" || formDesc == "")){
        // document.getElementById('ruleset-source-url').required = "";
        $('#ruleset-source-url').css('border', '2px solid #ced4da');
        if(formName == ""){
            document.getElementById('ruleset-source-name').placeholder = "Please, insert a valid name.";
            $('#ruleset-source-name').css('border', '2px solid red');
        }
        if(formDesc == ""){
            document.getElementById('ruleset-source-desc').placeholder = "Please, insert a valid description.";
            $('#ruleset-source-desc').css('border', '2px solid red');
        }
    }else{
        //get all headers
        var headers = [];
        var isHeaderError = false;
        var headerKeys = [];
        var headerValues = [];
        $('.header-key').each(function(i, obj) {
            if($(this).val().trim().includes(",")){
                isHeaderError = true;
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t use character ",".'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                if ($(this).val() != ""){
                    headerKeys.push($(this).val().trim())
                }else{
                    headerKeys.push(null)
                }
            }
        });
        $('.header-value').each(function(i, obj) {
            if($(this).val().trim().includes(",")){
                isHeaderError = true;
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t use character ",".'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                if ($(this).val() != ""){
                    headerValues.push($(this).val().trim())
                }else{
                    headerValues.push(null)
                }
            }
        });
        //check for empty fields
        $(headerKeys).each(function(i, obj) {
            if((headerKeys[i] == null && headerKeys[i] != null) || (headerKeys[i] != null && headerValues[i] == null)){
                isHeaderError = true;
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> There are Header keys or header empty.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                if(headerKeys[i] != null &&  headerValues[i] != null){
                    headers.push(headerKeys[i] +":"+ headerValues[i]);
                }
            }
        });

        if(!isHeaderError){
            document.getElementById('progressBar-create-div').style.display = "block";
            document.getElementById('progressBar-create').style.display = "block";
    
            if (sourceType == "url" || sourceType == "defaults"){
                sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/';
            }else  if (sourceType == "custom"){
                sourceURL = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/custom';
            }
            formAddRulesetSource();//close add ruleset source form
    
            var nodejson = {}
            if(document.getElementById('ruleset-source-user').value != "" || document.getElementById('ruleset-source-passwd').value != ""){
                nodejson["user"] = formUser;
                nodejson["passwd"] = formPasswd;
            }
    
            nodejson["name"] = formName;
            nodejson["headers"] = headers.toString();
            nodejson["desc"] = formDesc;
            nodejson["url"] = formUrl;
            nodejson["fileName"] = fileName[fileName.length-1];
            nodejson["type"] = "source";
            nodejson["sourceType"] = sourceType;
            if (sourceType != "custom"){nodejson["isDownloaded"] = "false";} //only for source and threat, not for custom ruleset source
            if (document.getElementById('ruleset-source-secret-key').value != ""){nodejson["secretKey"] = document.getElementById('ruleset-source-secret-key').value;} //only when default ruleset needs a secret key
            var nodeJSON = JSON.stringify(nodejson);
    
            axios({
                method: 'post',
                url: sourceURL,
                timeout: 30000,
                headers:{
                    'token': document.cookie,
                    'user': payload.user
    
                },
                data: nodeJSON
            })
            .then(function (response) {
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";
    
                if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
                if(response.data.permissions == "none"){
                    PrivilegesMessage();
                }else{
                    if (response.data.ack == "false") {
                        $('html,body').scrollTop(0);
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error adding ruleset! </strong>'+response.data.error+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                    }else{
                        //clear require attribute for input text
                        $('#ruleset-source-name').css('border', '2px solid #ced4da');
                        $('#ruleset-source-desc').css('border', '2px solid #ced4da');
                        $('#ruleset-source-url').css('border', '2px solid #ced4da');
                        $('#ruleset-source-user').css('border', '2px solid #ced4da');
                        $('#ruleset-source-passwd').css('border', '2px solid #ced4da');
                        $('#ruleset-source-secret-key').css('border', '2px solid #ced4da');
    
                        //clean all ruleset default
                        document.getElementById('default-rulesets').innerHTML = '<br>'+
                        '<h5>Select default ruleset (click to see ruleset details) </h5>'+
                        '<h6><i>note: Insert SECRET-CODE in form field when URL needs it. </i></h6>'+
                        '<br>';

                        GetAllRulesetSource();
                        //Clean all fields
                        //check url radiobutton
                        document.getElementById('create-url').checked="true";
                        document.getElementById("default-rulesets").style.display = "none";
                        document.getElementById("ruleset-source-secret-key").style.display = "none";
                        document.getElementById("ruleset-source-secret-key").value = "";
                        document.getElementById("ruleset-source-secret-key").placeholder = "URL secret key";
                        document.getElementById("ruleset-source-secret-key").require = "";
    
                    }
                }
            })
            .catch(function (error) {
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";
    
                $('html,body').scrollTop(0);
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding ruleset! </strong>'+error+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            });
            // GetAllRulesetSource();
        }

    }
}

function GetAllRulesetSource(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-source');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/';
    var portmaster = document.getElementById('create-url').checked = "true";
    document.getElementById('progressBar-create-div').style.display = "none";
    document.getElementById('progressBar-create').style.display = "none";
    document.getElementById('ruleset-source-text-top').style.display ="none";
    document.getElementById('ruleset-source-text-bot').style.display ="none";

    document.getElementById('ruleset-source-name').value = "";
    document.getElementById('ruleset-source-desc').value = "";
    document.getElementById('ruleset-source-url').value = "";
    document.getElementById('ruleset-source-user').value =  "";
    document.getElementById('ruleset-source-secret-key').value =  "";
    document.getElementById('ruleset-source-passwd').value =  "";
    document.getElementById('ruleset-source-name').required = "";
    document.getElementById('ruleset-source-desc').required = "";
    document.getElementById('ruleset-source-url').required =  "";
    document.getElementById('ruleset-source-user').required =  "";
    document.getElementById('ruleset-source-secret-key').required =  "";
    document.getElementById('ruleset-source-passwd').required =  "";
    document.getElementById('ruleset-source-name').placeholder = "Name";
    document.getElementById('ruleset-source-desc').placeholder = "Description";
    document.getElementById('ruleset-source-url').placeholder =  "url";
    document.getElementById('ruleset-source-user').placeholder =  "User";
    document.getElementById('ruleset-source-secret-key').placeholder =  "URL secret key";
    document.getElementById('ruleset-source-passwd').placeholder =  "Password";

    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user

        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            document.getElementById('ruleset-source-text-top').style.display ="block";
            document.getElementById('ruleset-source-text-bot').style.display ="block";
            result.innerHTML = generateAllRulesetSourceHTMLOutput(response);
            changeIconAttributes(response.data);
            RadioButtonListener();
            LoadDefaultRulesets();
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function RadioButtonListener(){
    $('input:radio').on('click', function(e) {
        var inputRadioClicked = $(e.currentTarget);
        if (inputRadioClicked.attr('value') == "custom"){
            document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
            document.getElementById("ruleset-source-user").style.display = "none";
            document.getElementById("ruleset-source-passwd").style.display = "none";
            document.getElementById("ruleset-source-secret-key").style.display = "none";
            document.getElementById("ruleset-source-secret-key").value = "";
            document.getElementById("ruleset-source-secret-key").placeholder = "URL secret key";
            document.getElementById("ruleset-source-secret-key").required = "";
            document.getElementById("default-rulesets").style.display = "none";
            document.getElementById("header-div").style.display = "none";
        }else if (inputRadioClicked.attr('value') == "url"){
            document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
            document.getElementById("ruleset-source-user").style.display = "block";
            document.getElementById("ruleset-source-passwd").style.display = "block";
            document.getElementById("ruleset-source-secret-key").style.display = "none";
            document.getElementById("ruleset-source-secret-key").value = "";
            document.getElementById("ruleset-source-secret-key").placeholder = "URL secret key";
            document.getElementById("ruleset-source-secret-key").required = "";
            document.getElementById("default-rulesets").style.display = "none";
            document.getElementById("header-div").style.display = "block";
            // }else if (inputRadioClicked.attr('value') == "thread"){
                //     document.getElementById("ruleset-source-url").placeholder=inputRadioClicked.attr('value');
                // }
        }else if (inputRadioClicked.attr('value') == "defaults"){
            document.getElementById("ruleset-source-user").style.display = "block";
            document.getElementById("ruleset-source-passwd").style.display = "block";
            document.getElementById("default-rulesets").style.display = "block";
            document.getElementById("ruleset-source-secret-key").style.display = "block";
            document.getElementById("ruleset-source-secret-key").value = "";
            document.getElementById('ruleset-source-url').placeholder =  "url";
            document.getElementById("header-div").style.display = "block";
        }
    });
}

function LoadDefaultRulesets(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/loadDefaultRulesets';
    document.getElementById('default-rulesets').innerHTML = '<br>'+
        '<h5>Select default ruleset (click to see ruleset details) </h5>'+
        '<h6><i>note: Insert SECRET-CODE or SURICATA-VERSION in form field when URL needs it. </i></h6>'+
        '<br>';
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            var html ='<table class="table table-hover" style="table-layout: fixed" width="100%">'
            for(x in response.data){
                // if(response.data[x].name.includes("'")){response.data[x].name.replace("'", "\'");}
                // if(response.data[x].desc.includes("'")){response.data[x].desc.replace("'", "\'");}
                // if(response.data[x].url.includes("'")){response.data[x].url.replace("'", "\'");}
                html = html + '<tr>'+
                    '<td>'+
                        '<div id="radio-rset-'+x+'" class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="default-ruleset-'+x+'" name="default-rsets" data="'+x+'" class="custom-control-input" url="'+response.data[x].url+'" desc="'+response.data[x].desc+'" rsetName="'+response.data[x].name+'" onclick="loadRulesetDefaultDataListener(\''+x+'\', \''+response.data[x].name+'\', \''+response.data[x].desc+'\', \''+response.data[x].url+'\')">'+
                            '<label class="custom-control-label" for="default-ruleset-'+x+'">'+x+'</label>'+
                        '</div>'+
                    '</td>'+
                    '<td>'+               
                        '<h3>'+response.data[x].name+'</h3>'+
                        '<small>'+response.data[x].desc+'</small>'+
                    '</td>'+
                '</tr>';
                }
            html = html + '</table>';    
            document.getElementById('default-rulesets').innerHTML = document.getElementById('default-rulesets').innerHTML + html;
        }
    })
    .catch(function (error) {

    });
}

function loadRulesetDefaultDataListener(id, name, desc, url){
    document.getElementById("ruleset-source-user").style.display = "block";
    document.getElementById("ruleset-source-passwd").style.display = "block";
    document.getElementById("ruleset-source-name").value=name;
    document.getElementById("ruleset-source-desc").value=desc;
    document.getElementById("ruleset-source-url").value=url;
    if(url.includes("<SECRET-CODE>")){
        document.getElementById("ruleset-source-secret-key").style.display = "block";
    }else{
        document.getElementById("ruleset-source-secret-key").style.display = "none";
    }
}

    // $('input:radio').on('click', function(e) {
    //     var inputRadioClicked = $(e.currentTarget);
    //     if (inputRadioClicked.attr('data') == "open-rules"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value="Emerging Threats Open Ruleset";
    //         document.getElementById("ruleset-source-desc").value="Proofpoint ET Open is a timely and accurate rule set for detecting and blocking advanced threats";
    //         document.getElementById("ruleset-source-url").value="https://rules.emergingthreats.net/open/suricata-%(__version__)s/emerging.rules.tar.gz";
    //     }else if (inputRadioClicked.attr('data') == "pro-ruleset"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "block";
    //         document.getElementById("ruleset-source-name").value="Emerging Threats Pro Ruleset";
    //         document.getElementById("ruleset-source-desc").value="Proofpoint ET Pro is a timely and accurate rule set for detecting and blocking advanced threats";
    //         document.getElementById("ruleset-source-url").value="https://rules.emergingthreatspro.com/<SECRET-CODE>/suricata-%(__version__)s/etpro.rules.tar.gz";
    //     }else if (inputRadioClicked.attr('data') == "traffic-id"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value="Suricata Traffic ID ruleset";
    //         document.getElementById("ruleset-source-desc").value="Suricata Traffic ID ruleset";
    //         document.getElementById("ruleset-source-url").value="https://openinfosecfoundation.org/rules/trafficid/trafficid.rules";
    //     }else if (inputRadioClicked.attr('data') == "attack-detection"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-name").value="Positive Technologies Attack Detection Team ruleset";
    //         document.getElementById("ruleset-source-desc").value="The Attack Detection Team searches for new vulnerabilities and 0-days, reproduces it and creates PoC exploits to understand how these security flaws work and how related attacks can be detected on the network layer. Additionally, we are interested in malware and hackersâ€™ TTPs, so we develop Suricata rules for detecting all sorts of such activities.";
    //         document.getElementById("ruleset-source-url").value="https://raw.githubusercontent.com/ptresearch/AttackDetection/master/pt.rules.tar.gz";
    //     }else if (inputRadioClicked.attr('data') == "suricata-latest"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "block";
    //         document.getElementById("ruleset-source-name").value="Secureworks suricata-enhanced ruleset";
    //         document.getElementById("ruleset-source-desc").value="Broad ruleset composed of malware rules and other security-related countermeasures, and curated by the Secureworks Counter Threat Unit research team.  This ruleset has been enhanced with comprehensive and fully standard-compliant BETTER metadata (https://better-schema.readthedocs.io/).";
    //         document.getElementById("ruleset-source-url").value="https://ws.secureworks.com/ti/ruleset/<SECRET-CODE>/Suricata_suricata-enhanced_latest.tgz";
    //     }else if (inputRadioClicked.attr('data') == "suricata-malware"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "block";
    //         document.getElementById("ruleset-source-name").value="Secureworks suricata-malware ruleset";
    //         document.getElementById("ruleset-source-desc").value="High-fidelity, high-priority ruleset composed mainly of malware-related countermeasures and curated by the Secureworks Counter Threat Unit research team.";
    //         document.getElementById("ruleset-source-url").value="https://ws.secureworks.com/ti/ruleset/<SECRET-CODE>/Suricata_suricata-malware_latest.tgz";
    //     }else if (inputRadioClicked.attr('data') == "threat-intelligence"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "block";
    //         document.getElementById("ruleset-source-name").value="Secureworks suricata-security ruleset";
    //         document.getElementById("ruleset-source-desc").value="Broad ruleset composed of malware rules and other security-related countermeasures, and curated by the Secureworks Counter Threat Unit research team.";
    //         document.getElementById("ruleset-source-url").value="https://ws.secureworks.com/ti/ruleset/<SECRET-CODE>/Suricata_suricata-security_latest.tgz";
    //     }else if (inputRadioClicked.attr('data') == "sslblacklist"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value=" Abuse.ch SSL Blacklist";
    //         document.getElementById("ruleset-source-desc").value="The SSL Blacklist (SSLBL) is a project of abuse.ch with the goal of detecting malicious SSL connections, by identifying and blacklisting SSL certificates used by botnet C&C servers. In addition, SSLBL identifies JA3 fingerprints that helps you to detect & block malware botnet C&C communication on the TCP layer.";
    //         document.getElementById("ruleset-source-url").value="https://sslbl.abuse.ch/blacklist/sslblacklist.rules";
    //     }else if (inputRadioClicked.attr('data') == "ja3-fingerprint"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value="Abuse.ch Suricata JA3 Fingerprint Ruleset";
    //         document.getElementById("ruleset-source-desc").value="If you are running Suricata, you can use the SSLBL's Suricata JA3 FingerprintRuleset to detect and/or block malicious SSL connections in your network based on the JA3 fingerprint. Please note that your need Suricata 4.1.0 or newer in order to use the JA3 fingerprint ruleset.";
    //         document.getElementById("ruleset-source-url").value="https://sslbl.abuse.ch/blacklist/ja3_fingerprints.rules";
    //     }else if (inputRadioClicked.attr('data') == "ip-blacklist"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value="Etnetera aggressive IP blacklist";
    //         document.getElementById("ruleset-source-desc").value="Etnetera aggressive IP blacklist";
    //         document.getElementById("ruleset-source-url").value="https://security.etnetera.cz/feeds/etn_aggressive.rules";
    //     }else if (inputRadioClicked.attr('data') == "threat-hunting"){
    //         document.getElementById("ruleset-source-user").style.display = "block";
    //         document.getElementById("ruleset-source-passwd").style.display = "block";
    //         document.getElementById("ruleset-source-secret-key").style.display = "none";
    //         document.getElementById("ruleset-source-name").value="Threat hunting rules";
    //         document.getElementById("ruleset-source-desc").value="Heuristic ruleset for hunting. Focus on anomaly detection and showcasing latest engine features, not performance.";
    //         document.getElementById("ruleset-source-url").value="https://raw.githubusercontent.com/travisbgreen/hunting-rules/master/hunting.rules";
    //     }
    // });


function changeIconAttributes(sources){
    for (source in sources) {
        var icon = document.getElementById('SourceDetails-'+source);
        if (sources[source]['isDownloaded'] == "false" && sources[source]['sourceType'] != "custom"){
            icon.style.color = "grey";
            document.getElementById('download-status-'+source).value = "false";
        }else if (sources[source]['sourceType'] == "url"){
            icon.style.color = "Dodgerblue";
            document.getElementById('download-status-'+source).value = "true";
        }
    }
}

function generateAllRulesetSourceHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving data for ruleset source</h3></div>';
    }
    var isEmpty = true;
    var sources = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>Name</th>                                                  ' +
        '<th>Description</th>                                          ' +
        '<th>Path</th>                                                    ' +
        '<th>Url</th>                                               ' +
        '<th style="width: 20%">Actions</th>                                ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      '
    for (source in sources) {
        isEmpty = false;
        html = html + '<tr>'+
            '<td style="word-wrap: break-word;">'+
            sources[source]['name']+
            '</td><td style="word-wrap: break-word;">'+
            sources[source]['desc']+
            '</td><td style="word-wrap: break-word;">'+
            sources[source]['path']+
            '</td><td style="word-wrap: break-word;">';
            if (sources[source]['sourceType'] != "custom"){
                //reeplace <> characters
                // string.replace(/GeeksForGeeks/, 'gfg');
                var left = sources[source]['url'].replace('<', '&lt;');
                var right = left.replace('>', "&gt;");
                html = html + right;
            }
            html = html + '</td><td align="right" style="word-wrap: break-word;">'+
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<input id="download-status-'+source+'" type="hidden" class="form-control" value = "'+sources[source]['isDownloaded']+'">';
                    if(sources[source]['sourceType'] != "custom"){
                        html = html +'<i class="fas fa-download" style="cursor: pointer;" title="Download file" onclick="downloadFile(\''+sources[source]['name']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    }
                    html = html + '<i class="fas fa-edit" style="cursor: pointer;" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;';
                    if(sources[source]['sourceType'] == "custom"){
                        html = html + '<i class="fas fa-info-circle" style="cursor: pointer;" id="customRuleDetails-'+source+'" title="Custom rule details" onclick="loadCustomRulesetRules(\''+source+'\',\''+sources[source]['path']+'\',\'custom\')"></i>';
                    }else{
                        html = html + '<i class="fas fa-info-circle" style="cursor: pointer;" id="SourceDetails-'+source+'" title="Details" onclick="loadRulesetSourceDetails(\'source\',\''+sources[source]['name']+'\',\''+source+'\')"></i>';
                    }
                    html = html + ' | <i class="fas fa-trash-alt" style="color: red; cursor: pointer;" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\', \''+sources[source]['sourceType']+'\')"></i> &nbsp;'+
                '</span>'+
            '</td></tr>';
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No sources created</h3>';
    }else{
        return html;
    }
}

function loadRulesetSourceDetails(type, name, uuid){
    var isDownloaded = document.getElementById('download-status-'+uuid).value;
    if (isDownloaded == "true"){
        document.location.href = 'https://' + location.host + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
    }
}

function loadCustomRulesetRules(uuid,path,type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var pathArray = path.split("/")
    var ruleFileName = pathArray[pathArray.length-1];
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/GetFileUUIDfromRulesetUUID/'+uuid;
    axios({
        method: 'get',
        url: sourceurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user

        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            document.location.href = 'https://' + location.host + '/ruleset.html?file='+response.data+'&rule='+ruleFileName+'&type='+type+'&type='+response.data;
        }
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });

}

// function modalSyncRulesetSource(name, uuid){
//     var modalWindow = document.getElementById('modal-ruleset');
//     modalWindow.innerHTML =
//     '<div class="modal-dialog">'+
//         '<div class="modal-content">'+

//             '<div class="modal-header">'+
//                 '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Ruleset</h4>'+
//                 '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
//             '</div>'+

//             '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+
//                 '<p>Do you want to synchronize <b>'+name+'</b> ruleset source?</p>'+
//             '</div>'+

//             '<div class="modal-footer" id="modal-ruleset-sync-ruleset-footer-btn">'+
//                 '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
//                 '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="syncRulesetSource(\''+uuid+'\')">Sync</button>'+
//             '</div>'+

//         '</div>'+
//     '</div>';
// }

// function syncRulesetSource(uuid){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/set';

//     var jsonRuleUID = {}
//     jsonRuleUID["uuid"] = uuid;
//     jsonRuleUID["type"] = "ruleset";
//     var dataJSON = JSON.stringify(jsonRuleUID);

//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
        // headers:{
        //     'token': document.cookie,
        //     'user': payload.user
        //
        // },
//         data: dataJSON
//     })
//         .then(function (response) {
    // if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         })
//         .catch(function (error) {
//         });
// }


// function compareFiles(){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/compareFiles';
//     var nodejson = {}
//     nodejson["new"] = 'conf/downloads/Default/rules/drop.rules';
//     nodejson["old"] = 'rules/drop.rules';
//     var nodeJSON = JSON.stringify(nodejson);
//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
        // headers:{
        //     'token': document.cookie,
        //     'user': payload.user
        //
        // },
//         data: nodeJSON
//         })
//         .then(function (response) {
    // if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         })
//         .catch(function (error) {
//         });
// }

function modalDeleteRulesetSource(name, sourceUUID, sourceType){
    var modalWindowDelete = document.getElementById('modal-delete-source');
    modalWindowDelete.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title">Groups</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<p>Do you want to delete source <b>'+name+'</b>?</p>'+
            '</div>'+

            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="deleteRulesetSource(\''+sourceUUID+'\', \''+sourceType+'\')">Delete</button>'+
            '</div>'+

        '</div>'+
    '</div>';
}

function showEditRulesetSource(name, desc, path, url, sourceUUID){
    document.getElementById('add-ruleset-source').style.display = "none";
    document.getElementById('ruleset-source-text-top').innerHTML = "Add new ruleset source";
    document.getElementById('ruleset-source-text-bot').innerHTML = "Add new ruleset source";
    document.getElementById('edit-ruleset-source').style.display = "block";
    document.getElementById('ruleset-source-name-edit').value = name;
    document.getElementById('ruleset-source-edit-desc').value = desc;
    document.getElementById('ruleset-source-edit-url').value = url;
    document.getElementById('ruleset-source-uuid').value = sourceUUID;
}

function editRulesetSourceClose(){
    document.getElementById('edit-ruleset-source').style.display = "none";
}

function editRulesetSourceData(){
    var name = document.getElementById('ruleset-source-name-edit');
    var desc = document.getElementById('ruleset-source-edit-desc');
    var url = document.getElementById('ruleset-source-edit-url');
    if(name.value=="" || desc.value == "" || url.value == ""){
        if(name.value==""){
            $('#ruleset-source-name-edit').attr("placeholder", "Please, insert a valid name");
            $('#ruleset-source-name-edit').css('border', '2px solid red');
        }else{
            $('#ruleset-source-name-edit').css('border', '2px solid #ced4da');
        }
        if(desc.value==""){
            $('#ruleset-source-edit-desc').attr("placeholder", "Please, insert a valid description");
            $('#ruleset-source-edit-desc').css('border', '2px solid red');
        }else{
            $('#ruleset-source-edit-desc').css('border', '2px solid #ced4da');
        }
        if(url.value==""){
            $('#ruleset-source-edit-url').attr("placeholder", "Please, insert a valid url");
            $('#ruleset-source-edit-url').css('border', '2px solid red');
        }else{
            $('#ruleset-source-edit-url').css('border', '2px solid #ced4da');
        }
    }else{
        var sourceUUID = document.getElementById('ruleset-source-uuid').value.trim();
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/rulesetSource/EditRulesetSource';
        var nodejson = {}
        nodejson["name"] = name.value.trim();
        nodejson["desc"] = desc.value.trim();
        nodejson["url"] = url.value.trim();
        nodejson["uuid"] = sourceUUID;
        var nodeJSON = JSON.stringify(nodejson);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user

            },
            data: nodeJSON
            })
            .then(function (response) {
                if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
                if(response.data.permissions == "none"){
                    PrivilegesMessage();
                }else{
                    GetAllRulesetSource();
                }
            })
            .catch(function (error) {
            });
            document.getElementById('edit-ruleset-source').style.display = "none";
    }
}

function deleteRulesetSource(sourceUUID,sourceType){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/DeleteRulesetSource';

    var nodejson = {}
    nodejson["sourceType"] = sourceType;
    nodejson["uuid"] = sourceUUID;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user

        },
        data: nodeJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                GetAllRulesetSource();
            }
        })
        .catch(function error() {
        });
}

function downloadFile(name, path, url, sourceUUID){
    var downloadStatus = document.getElementById('download-status-'+sourceUUID);
    var icon = document.getElementById('SourceDetails-'+sourceUUID);
    if (downloadStatus.value == "true"){
        modalOverwriteDownload(name,path, url, sourceUUID);
    }else{
        document.getElementById('progressBar-create-div').style.display = "block";
        document.getElementById('progressBar-create').style.display = "block";
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/downloadFile';
        var nodejson = {}
        nodejson["url"] = url;
        nodejson["name"] = name;
        nodejson["path"] = path;
        nodejson["uuid"] = sourceUUID;
        var nodeJSON = JSON.stringify(nodejson);

        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user

            },
            data: nodeJSON
        })
            .then(function (response) {
                if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
                if(response.data.permissions == "none"){
                    PrivilegesMessage();
                }else{
                    if (response.data.ack == "true") {
                        var alert = document.getElementById('floating-alert');
                        $('html,body').scrollTop(0);
                        alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                            '<strong>Success!</strong> Download complete.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                        icon.style.color="Dodgerblue";
                        downloadStatus.value = "true";

                        document.getElementById('progressBar-create').style.display = "none";
                        document.getElementById('progressBar-create-div').style.display = "none";
                    }else{
                        var alert = document.getElementById('floating-alert');
                        $('html,body').scrollTop(0);
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error downloading!</strong>'+response.data.error+''+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        downloadStatus.value = "false";
                        setTimeout(function() {$(".alert").alert('close')}, 30000);

                        document.getElementById('progressBar-create').style.display = "none";
                        document.getElementById('progressBar-create-div').style.display = "none";
                    }
                }
            })
            .catch(function error(e) {
                console.log(e);
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Error downloading!</strong> Can not complete the download...'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                downloadStatus.value = "false";
                setTimeout(function() {$(".alert").alert('close')}, 30000);

                document.getElementById('progressBar-create').style.display = "none";
                document.getElementById('progressBar-create-div').style.display = "none";
        });
    }
}

function modalOverwriteDownload(name,path, url, sourceUUID){
    var modalWindowDelete = document.getElementById('modal-delete-source');
    modalWindowDelete.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title">Download</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<p>The file has been downloaded yet. Do you want to overwrite the file downloaded?</p>'+
            '</div>'+

            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="overwriteDownload(\''+name+'\', \''+path+'\', \''+url+'\', \''+sourceUUID+'\')">Overwrite</button>'+
            '</div>'+

        '</div>'+
    '</div>';

    $('#modal-delete-source').modal('show');
}

function overwriteDownload(name, path, url, uuid){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var downloadStatus = document.getElementById('download-status-'+source);
    var icon = document.getElementById('SourceDetails-'+uuid);
    var alert = document.getElementById('floating-alert');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/overwriteDownload';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["url"] = url;
    nodejson["path"] = path;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user

        },
        data: nodeJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            document.getElementById('progressBar-create').style.display = "none";
            document.getElementById('progressBar-create-div').style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Overwrite complete.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                icon.style.color="Dodgerblue";
                downloadStatus.value = "true";
                setTimeout(function() {$(".alert").alert('close')}, 30000);

                document.getElementById('progressBar-create').style.display = "none";
                document.getElementById('progressBar-create-div').style.display = "none";
            }else{
                $('html,body').scrollTop(0);
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error overwrite!</strong>'+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                // icon.style.color="Grey";
                // downloadStatus.value = "false";
                setTimeout(function() {$(".alert").alert('close')}, 30000);

                document.getElementById('progressBar-create').style.display = "none";
                document.getElementById('progressBar-create-div').style.display = "none";
        }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Error overwrite!</strong> Can not complete the download...'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        // icon.style.color="Grey";
        // downloadStatus.value = "false";
        setTimeout(function() {$(".alert").alert('close')}, 30000);

        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
    });
}

function deleteHeaderRow(id) {
    $('#header-key-'+id).val("")
    $('#header-value-'+id).val("")
    $('#header-'+id).hide()
}

var headerCount = 0;
function addHeaderInput() {
    var html = '<div class="input-group header-line mt-2 mb-2 mr-sm-2 mb-sm-0" id="header-'+headerCount+'">'+
        '<div class="input-group-prepend">'+
            '<span class="input-group-text wt-125">Header key</span>'+
        '</div>'+
        '<input type="text" class="form-control header-key" placeholder="Add header key" id="header-key-'+headerCount+'">'+
        '<div class="input-group-prepend ml-1">'+
            '<span class="input-group-text wt-125">Header value</span>'+
        '</div>'+
        '<input type="text" class="form-control header-value" placeholder="Add header value" id="header-value-'+headerCount+'"> &nbsp;'+
        '<i class="fas fa-minus-square" style="color:red; cursor:pointer; font-size: 20px;" onclick="deleteHeaderRow(\''+headerCount+'\')"></i>'+
    '</div>';
    document.getElementById('header-content-input').innerHTML = document.getElementById('header-content-input').innerHTML + html;
    headerCount++;
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}

        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user

        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllRulesetSource();
    });
}
var payload = "";
loadJSONdata();