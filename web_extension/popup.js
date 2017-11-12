var olapass = require("../olapass");

var isChrome = typeof window.browser === "undefined";

if (isChrome) {
  window.browser = chrome;
}

function queryActiveTab (cb) {
  if (isChrome) {
    return chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (chrome.runtime.lastError) { return cb(chrome.runtime.lastError); }
      cb(null, tabs[0]);
    });
  }

  browser.tabs.query({active: true, currentWindow: true}).then(function (tabs) {
    cb(null, tabs[0]);
  }).catch(function (err) {
    cb(err);
  });
}

function executeScript (cb) {
  if (isChrome) {
    return chrome.tabs.executeScript({
      file: "/content_script.js"
    }, function () {
      if (chrome.runtime.lastError) { return cb(chrome.runtime.lastError); }
      cb();
    });
  }

  browser.tabs.executeScript({file: "/content_script.js"}).then(function (tabs) {
    cb(null, tabs[0]);
  }).catch(function (err) {
    cb(err);
  });
}

function sendMessage (tab, msg) {
  (isChrome ? chrome : browser).tabs.sendMessage(tab.id, msg);
}

function extractProtocol (url) {
  if (url.indexOf("://") > -1) {
    return url.split("://")[0];
  }
}

function extractDomain (url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }

  domain = domain.split(":")[0];
  domain = domain.split("?")[0];

  return domain;
}

function byId (id) {
  return document.getElementById(id);
}

function fillPasswords (tab) {
  var protocol = extractProtocol(tab.url);
  var domain = extractDomain(tab.url);
  var username = byId("username").value;
  var master = byId("master").value;

  if (protocol !== "https") {
    return error("olapass only works on https");
  }

  if (!domain || !username || !master) {
    return error("inputs not filled in");
  }

  var pass = olapass(protocol, domain, username, master);
  sendMessage(tab, {command: "fillPasswords", password: pass});
  window.close();
}

function handleLoad () {
  setTimeout(() => {
    byId("username").focus();
  }, 10);

  var fill = byId("fill");

  fill.onclick = function (e) {
    e.preventDefault();
    queryActiveTab(function (err, tab) {
      if (err) { return error(err); }
      fillPasswords(tab);
    });
  };
}

function error (err) {
  var msg = err.message ? err.message : err;
  var infoNode = byId("info");
  var errorNode = byId("error");
  infoNode.className = "";
  errorNode.textContent = msg;
}

window.onload = function () {
  executeScript(function (err) {
    if (err) { return error(err); }
    handleLoad();
  });
};
