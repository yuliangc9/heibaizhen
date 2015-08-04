/**
 * Created by chenyuliang01 on 2015/8/4.
 */
var fs = require("fs");
var path = require("path");

var g_maps = {};
console.log(__dirname);
fs.readdir(__dirname, function(err, files) {
    files.forEach(function(f){

        if (f == "construct.js" || f[0] == ".")
            return;

        var content = fs.readFileSync(path.join(__dirname, f), {encoding:"utf8"});
        console.log(f);

        g_maps[f] = JSON.parse(content);
    });

    console.dir(g_maps);

    var mapFileContent = "var gMapLib = " + JSON.stringify(g_maps);

    fs.writeFileSync(path.join(__dirname, "..", "..", "budaoshi", "src", "mapLib.js"), mapFileContent);
});