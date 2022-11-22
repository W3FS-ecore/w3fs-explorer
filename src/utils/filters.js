var BigNumber = require("bignumber.js");
import Web3 from "web3";
import moment from "moment";
import "moment/locale/en-ca";
moment.locale("en-ca");
export function truncate(text, length, end) {
  if (isNaN(length)) length = 10;

  if (!end) end = "...";

  if (text.length <= length || text.length - end.length <= length) {
    return text;
  } else {
    return String(text).substring(0, length - end.length) + end;
  }
}
export function diffFormat(diffi) {
  var n;
  if (isNaN(diffi)) return diffi;
  if (diffi > 1000000000000000) {
    n = diffi / 1000000000000000;
    return n.toFixed(3) + " P";
  }
  if (diffi > 1000000000000) {
    n = diffi / 1000000000000;
    return n.toFixed(3) + " T";
  }
  if (diffi > 1000000000) {
    n = diffi / 1000000000;
    return n.toFixed(3) + " G";
  }
  if (diffi > 1000000) {
    n = diffi / 1000000;
    return n.toFixed(3) + " M";
  }
  n = diffi / 1000;
  return n.toFixed(3) + " K";
}
export function stylize(style) {
  if (isNaN(style)) return style;
  var si = '<span class="btn btn-primary">' + style + "</span>";
  return si;
}
export function stylize2(text) {
  if (isNaN(text)) return text;
  var si = '<i class="fa fa-exchange"></i> ' + text;
  return si;
}

export function hashFormat(hashr) {
  var n;
  if (isNaN(hashr)) return hashr;
  if (hashr > 1000000000000000) {
    n = hashr / 1000000000000000;
    return n.toFixed(3) + " PH/s";
  }
  if (hashr > 1000000000000) {
    n = hashr / 1000000000000;
    return n.toFixed(3) + " TH/s";
  }
  if (hashr > 1000000000) {
    n = hashr / 1000000000;
    return n.toFixed(3) + " GH/s";
  }
  if (hashr > 1000000) {
    n = hashr / 1000000;
    return n.toFixed(3) + " MH/s";
  }
  n = hashr / 1000;
  return n.toFixed(3) + " KH/s";
}

export function gasFormat(txt) {
  if (isNaN(txt)) return txt;
  var b = new BigNumber(txt);
  return b.toFormat(0) + " m/s";
}
export function gasFormatNounit(txt) {
  if (isNaN(txt)) return txt;
  var b = new BigNumber(txt);
  return b.toFormat(0);
}
export function BigNum(txt) {
  if (isNaN(txt)) return txt;
  var b = new BigNumber(txt);
  var w = Web3.utils.fromWei(b, "ether");
  return w.toFixed(6) + " ETH";
}

export function timestampAge(timestamp) {
  function dhms(ms) {
    var days = Math.floor(ms / (24 * 60 * 60 * 1000));
    var daysms = ms % (24 * 60 * 60 * 1000);
    var hrs = Math.floor(daysms / (60 * 60 * 1000));
    var hrsms = daysms % (60 * 60 * 1000);
    var mins = Math.floor(hrsms / (60 * 1000));
    var minsms = hrsms % (60 * 1000);
    var secs = Math.floor(minsms / 1000);

    var diff = " ago";
    var secsString = secs + " sec";
    var minsString = mins + " min";
    var hrsString = hrs + " hr";
    var daysString = days + " day";

    if (secs > 1) secsString = secs + " secs";
    if (mins > 1) minsString = mins + " mins";
    if (hrs > 1) hrsString = hrs + " hrs";
    if (days > 1) daysString = days + " days";

    if (days >= 1) return daysString + " " + hrsString + diff;
    if (hrs >= 1) return hrsString + " " + minsString + diff;
    if (mins >= 1) return minsString + " " + secsString + diff;

    return secsString + diff;
  }

  var dateNow = moment.utc();
  var txtTime = moment.utc(timestamp);
  var diffInMs = dateNow.diff(txtTime);
  if (diffInMs <= 0) {
    diffInMs = 0;
  }
  if (isNaN(diffInMs) || timestamp == 0) {
    return "";
  }
  return dhms(diffInMs);
}
export function sizeFormat(size) {
  if (isNaN(size)) return size;
  var s = size / 1000;
  return s.toFixed(3) + " kB";
}
export function timeFormat(time, isBracket) {
  if (time) {
    if (isBracket) {
      return (
        "(" +
        moment(time * 1000).format("ll") +
        " " +
        moment(time * 1000).format("LTS") +
        ")"
      );
    } else {
      return (
        moment(time * 1000).format("ll") +
        " " +
        moment(time * 1000).format("LTS")
      );
    }
  } else {
    return "";
  }
}
