(function () {
  if (window.hasRunOlapass) {
    return;
  }

  window.hasRunOlapass = true;

  if (typeof window.browser === "undefined") {
    window.browser = chrome;
  }

  function fillPasswords (password) {
    var inputs = document.querySelectorAll("input[type=password");

    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].value) {
        inputs[i].value = password;
      }
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "fillPasswords") {
      fillPasswords(message.password);
    }
  });
})();
