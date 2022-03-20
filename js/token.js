function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getCurrentUser() {
  let token = getToken();
  let tokenParts = token.split(".")
  if (tokenParts.length != 3) {
    console.log('error - token -  ->' + token);
    return "";
  }
  try { payload = JSON.parse(atob(tokenParts[1])); }
  catch (err) {
    console.log('error - can not parse token data field to json ->' + token);
    return "";
  }
  return payload.user;
}

function getToken() {
  let cOwlh = getCookie("owlh");
  if (cOwlh == "") {
    console.log("error - no owlh cookie on browser");
  }
  let tokenParts = cOwlh.split(".")
  if (tokenParts.length != 3) {
    console.log('error - token ->', cOwlh);
    return "";
  }
  return cOwlh;
}

function redirectLogin() {
  document.location.href = 'login.html';
}

user = getCurrentUser();
cToken = getToken(); 