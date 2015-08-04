var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

/* GET users listing. */
router.post('/insert', function(req, res, next) {
    console.dir(req.query);
    req.setEncoding('utf8');
    var mapString = "";
    req.on("data", function(data){
        console.log(data);
        mapString += data;
    });
    req.on("end", function(){
        var mapStructDict = JSON.parse(mapString);
        console.dir(mapStructDict);

        var nodeKeys = Object.keys(mapStructDict);
        var mapStruct = new Array(nodeKeys.length + 1);
        for (var i = 0; i < mapStruct.length; i++) mapStruct[i] = 0;

        for (var j in nodeKeys){
            var tmp = 0;
            for (var k in nodeKeys){
                console.dir(mapStructDict[nodeKeys[j]]['relate']);
                console.log(nodeKeys[k]);
                tmp += mapStructDict[nodeKeys[j]]['relate'][nodeKeys[k]] ? 1 : 0;
            }
            mapStruct[tmp] ++;
        }

        mapStructDict.bestStep = req.query.bestStep;

        var mapdir = path.join(__dirname, "..", "maplib", "build");
        fs.existsSync(mapdir) || fs.mkdirSync(mapdir);

        console.dir(mapStruct);

        var file_name = path.join(mapdir, mapStruct.join("_"));
        fs.writeFileSync(file_name, JSON.stringify(mapStructDict));
    });
  res.send('success');
});

module.exports = router;
