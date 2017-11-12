var assert = require("assert");
var olapass = require("../olapass");

describe("olapass", function () {
  it("should always produce the same passwords", function () {
    this.timeout(0);
    assert(olapass("https", "example.com", "olahol", "atestpassword"), "7Waa57FnVwxp1T1TCeZ@1f");
    assert(olapass("ssh", "example.com", "olahol", "atestpassword"), "g5uguxv60ahDCqDv1CejGL");
    assert(olapass("https", "test.example.com", "olahol", "atestpassword"), "9HL4G7_MUZJdCv9nF8ASGa");
    assert(olapass("https", "example.com", "testuser", "atestpassword"), "_v5ynjObTabBkqNH4bc5Qr");
    assert(olapass("https", "example.com", "olahol", "anothertestpassword"), "pUeURqftp0@MieglkTJnCe");
  });
});
