var shajs = require("sha.js");

// The amount of times a password is hashed.
var difficulty = 16;
var rounds = Math.pow(2, difficulty);

// Base64 with + and / changed to @ and _.
function defaultAlphabet () {
  var digits = "0123456789".split("");
  var az = "abcdefghijklmnopqrstuvwxyz".split("");
  var AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  var special = ["@", "_"];
  return AZ.concat(az).concat(digits).concat(special);
}

var defaultOptions = {
  alphabet: defaultAlphabet(),
  length: 22,
  prefix: "",
  postfix: ""
};

// Special options for domains.
var domainOptions = {};

function hash (content) {
  function round (m) {
    return shajs("sha512").update(m).digest();
  }

  var bits = content;
  for (var i = 0; i < rounds; i++) {
    bits = round(bits);
  }

  return bits;
}

function digest ({alphabet, length, prefix, postfix}, data) {
  var output = "";

  for (var i = 0; i < data.length; i++) {
    output += alphabet[data[i] % alphabet.length];
  }

  return prefix + output.slice(0, length) + postfix;
}

function password (options, protocol, domain, username, master) {
  var content = [protocol, username, domain, master].join("/");
  return digest(options, hash(content));
}

module.exports = function (protocol, domain, username, master) {
  function validateArg (arg, value) {
    if (typeof value !== "string" || value.length === 0) {
      throw new Error("argument " + arg + " isn't set.");
    }
  }

  validateArg("protocol", protocol);
  validateArg("domain", domain);
  validateArg("username", username);
  validateArg("master", master);

  var options = domainOptions[domain] || {};

  for (var key in defaultOptions) {
    if (defaultOptions.hasOwnProperty(key)) {
      options[key] = options[key] || defaultOptions[key];
    }
  }

  if (options.length > 64) {
    throw new Error("sha512 can only produce passwords of 64 characters or less");
  }

  var entropy = Math.floor(options.length * Math.log2(Math.min(options.alphabet.length, 256)));

  if (entropy < 128) {
    throw new Error("password entropy is less than 128 bits, it is only " + entropy + " bits.");
  }

  return password(options, protocol, domain, username, master);
};
