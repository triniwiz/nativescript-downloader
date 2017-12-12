var Downloader = require("nativescript-downloader").Downloader;
var downloader = new Downloader();

describe("greet function", function() {
    it("exists", function() {
        expect(downloader.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(downloader.greet()).toEqual("Hello, NS");
    });
});