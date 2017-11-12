var olapass = require("../olapass");

window.Olapass = olapass;

function byId (id) {
  return document.getElementById(id);
}

function value (id) {
  return byId(id).value;
}

function setOutput (msg) {
  var output = byId("output");
  output.value = msg;
}

function copyOutputToClipboard () {
  var copyText = document.getElementById("output");
  copyText.select();
  document.execCommand("Copy");
}

window.onload = function () {
  setTimeout(function () {
    byId("domain").focus();
    setOutput("");
  }, 1);

  var show = byId("show");
  var copy = byId("copy");

  copy.onclick = function (e) {
    e.preventDefault();

    var domain  = value("domain");
    var username = value("username");
    var master = value("master");

    if (!domain || !username || !master) {
      return alert("All fields must be filled in");
    }

    byId("master").value = "";

    var pass = olapass("https", domain, username, master);
    setOutput(pass);
    copyOutputToClipboard();
    setTimeout(function () {
      setOutput("");
    }, 10);
  };

  show.onclick = function (e) {
    e.preventDefault();

    var domain  = value("domain");
    var username = value("username");
    var master = value("master");

    if (!domain || !username || !master) {
      return alert("All fields must be filled in");
    }

    if (!confirm("Are you sure?")) {
      return;
    }

    byId("master").value = "";

    var pass = olapass("https", domain, username, master);
    setOutput(pass);
  };
};
