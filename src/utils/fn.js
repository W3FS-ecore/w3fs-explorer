function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
function processRequest(requestStr, route) {
  // var requestStr = this.ethRequest;

  if (requestStr !== undefined) {
    // maybe we can create a service to do the reg ex test, so we can use it in every controller ?
    var regexpTx = /[0-9a-zA-Z]{64}?/;
    //var regexpAddr =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/; // TODO ADDR REGEX or use isAddress(hexString) API ?
    var regexpAddr = /^(0x)?[0-9a-f]{40}$/; //New ETH Regular Expression for Addresses
    var regexpBlock = /^[0-9]{1,7}?$/;
    requestStr = requestStr.replace(/(^\s*)|(\s*$)/g, "");
    var result = regexpTx.test(requestStr);
    if (result === true) {
      goToTxInfos(requestStr, route);
    } else {
      result = regexpAddr.test(requestStr.toLowerCase());
      if (result === true) {
        goToAddrInfos(requestStr.toLowerCase(), route);
      } else {
        result = regexpBlock.test(requestStr);
        if (result === true) {
          goToBlockInfos(requestStr, route);
        } else {
          return null;
        }
      }
    }
  } else {
    return null;
  }
}
function goToBlockInfos(requestStr, route) {
  route.push({ path: "/block/" + requestStr });
}
function goToAddrInfos(requestStr, route) {
  route.push({ path: "/address/" + requestStr.toLowerCase() });
}
function goToTxInfos(requestStr, route) {
  route.push({ path: "/tx/" + requestStr });
}

export default {
  hex2a,
  processRequest,
};
