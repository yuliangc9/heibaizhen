/**
 * Created by chenyuliang01 on 2015/7/28.
 */

/**
 * init a new zhen
 * @param [template] init with a template
 * @param [initNotLight] whether need light
 * @constructor
 */
function HeiBaiZhen(template, initNotLight)
{
    this.zhen = {
//    flagid : {
//        isGood : false,
//        node : BWNode,
//        positionX : x,
//        positionY : y,
//        relate : {
//            flagid : true
//        }
//    }
    };

    this.curBestStep = 0;

    if (template)
    {
        if (template.bestStep)
        {
            this.curBestStep = template.bestStep;
        }

        for (var n in template)
        {
            if (n == "bestStep") {
                continue;
            }

            this.zhen[n] = template[n];
            this.zhen[n].node = new BWNode(initNotLight);
            this.zhen[n].node.flagid = n;
            this.zhen[n].node.isGood = false;
        }
    }
    this.currCount = 0;
    this.finalCount = 0;
}

/**
 * add node in zhen
 * @param {BWNode} node
 */
HeiBaiZhen.prototype.addNode = function(node)
{
    this.zhen[node.flagid] = {
        node : node,
        relate : {},
        isGood : false
    }
};

/**
 * delete node from zhen
 * @param {BWNode} node
 */
HeiBaiZhen.prototype.deleteNode = function(node)
{
    delete this.zhen[node.flagid];

    for (var n in this.zhen)
    {
        delete this.zhen[n].relate[node.flagid];
    }
};

/**
 * connect two nodes
 * @param {BWNode} node1
 * @param {BWNode} node2
 */
HeiBaiZhen.prototype.connectNode = function(node1, node2)
{
    this.zhen[node1.flagid].relate[node2.flagid] = true;
    this.zhen[node2.flagid].relate[node1.flagid] = true;
};

/**
 * disconnect two nodes
 * @param {BWNode} node1
 * @param {BWNode} node2
 */
HeiBaiZhen.prototype.disconnectNode = function(node1, node2)
{
    delete this.zhen[node1.flagid].relate[node2.flagid];
    delete this.zhen[node2.flagid].relate[node1.flagid];
};

/**
 * judge two nodes is connected
 * @param {BWNode} node1
 * @param {BWNode} node2
 * @returns {bool}
 */
HeiBaiZhen.prototype.isConnected = function(node1, node2)
{
    return this.zhen[node1.flagid].relate[node2.flagid];
};

/**
 * draw zhen map
 * @param {cc.DrawNode} lineDrawer
 * @param [whiteLine]
 */
HeiBaiZhen.prototype.draw = function(lineDrawer, blackLine)
{
    lineDrawer.clear();
    for (var n in this.zhen)
    {
        for (var l in this.zhen[n].relate)
        {
            lineDrawer.drawSegment(
                cc.p(this.zhen[n].node.sprite.x, this.zhen[n].node.sprite.y),
                cc.p(this.zhen[l].node.sprite.x, this.zhen[l].node.sprite.y),
                3, blackLine ? cc.color(0,0,0,255) : cc.color(160,160,160,255));
        }
    }
};

/**
 * place nodes in layer
 * @param  layer
 */
HeiBaiZhen.prototype.placeNodes = function(layer)
{
    for (var n in this.zhen)
    {
        this.zhen[n].node.place(layer, this.zhen[n].positionX, this.zhen[n].positionY);
    }
};

/**
 * generate a template
 * @returns {{}}
 */
HeiBaiZhen.prototype.genTemplate = function()
{
    var t = {};
    for (var n in this.zhen)
    {
        t[n] = {};
        t[n].positionX = this.zhen[n].node.sprite.x;
        t[n].positionY = this.zhen[n].node.sprite.y;
        t[n].relate = this.zhen[n].relate;
        delete t[n].node;
    }

    return t;
};

/**
 * judge whether is finish
 * @returns {boolean}
 */
HeiBaiZhen.prototype.isFinished = function()
{
    for (var n in this.zhen)
    {
        if (this.zhen[n].node.isWhite)
        {
            return false;
        }
    }

    return true;
};

/**
 * reset zhen
 */
HeiBaiZhen.prototype.reset = function()
{
    for (var n in this.zhen)
    {
        if (!this.zhen[n].node.isWhite)
        {
            this.zhen[n].node.switchBW();
        }
    }
}

/**
 * change zhen state
 * @param {BWNode} node
 * @param layer
 * @param finishCb
 */
HeiBaiZhen.prototype.switchNode = function(node, layer, finishCb)
{
    var self = this;
    self.finalCount += Object.keys(this.zhen[node.flagid].relate).length;
    for (var n in this.zhen[node.flagid].relate)
    {
        var photon = new cc.Sprite(res.Photon_png);
        photon.attr({
            x : node.sprite.x,
            y : node.sprite.y,
            scale : 1/20
        });
        layer.addChild(photon, 1);

        var speedLen = Math.sqrt(Math.pow(node.sprite.x - this.zhen[n].node.sprite.x, 2) +
            Math.pow(node.sprite.y - this.zhen[n].node.sprite.y, 2));
        var speedTime = 0.2 * speedLen / 168;

        photon.runAction(new cc.Sequence(
            new cc.MoveTo(speedTime, cc.p(this.zhen[n].node.sprite.x, this.zhen[n].node.sprite.y)),
            new cc.CallFunc(function(m){
                self.zhen[m].node.switchBW();
                self.currCount ++;
                if (self.currCount == self.finalCount && self.isFinished())
                {
                    self.showFinish(layer, function(){
                        cc.log("finish cb call");
                        finishCb ? finishCb() : null;
                    });
                }
            }.bind(this, n), layer)
        ));
    }
};

HeiBaiZhen.prototype.bestStep = function()
{
    var nodeKeys = Object.keys(this.zhen);
    var mapStruct = new Array(nodeKeys.length);
    for (var j in nodeKeys){
        mapStruct[j] = new Array(nodeKeys.length);
        for (var k in nodeKeys){
            mapStruct[j][k] = this.zhen[nodeKeys[j]].relate[nodeKeys[k]] ? 1 : 0;
        }
    }

    var g_reached_record = new Array();
    var g_step_record = new Array();
    var best_step = -1;
    var best_train = null;

    function resolve_map(nodes, result, step/*, click_train*/) {
        if (best_step != -1 && step >= best_step -1) {
            return ;
        }
        if (result == (1 << nodes.length) - 1) {
            //best_train = click_train;
            best_step = step;
            return 1;
        }
        if (g_reached_record[result] <= step) {
            return ;
        }
        if (g_step_record[result]) {
            if( g_step_record[result] + step < best_step) {
                best_step = g_step_record[result] + step;
            }
            return g_step_record[result] + 1;
        }
        g_reached_record[result] = step;


        var new_result;
        var tmp = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (i == 6) continue;

            new_result = result;

            new_result ^= 1 << i;
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[i][j]) {
                    new_result ^= 1 << j;
                }
            }
            tmp = resolve_map(nodes, new_result, step + 1/*, click_train.concat(i)*/);
            if(tmp){
                g_step_record[result] = tmp;
            }
        }
        return g_step_record[result] ?  g_step_record[result] + 1 : 0;
    }

    resolve_map(mapStruct, 0, 0);
    this.curBestStep = best_step;
    cc.log(best_step);
    return best_step;
};

/**
 * show finish celebration
 * @param layer
 * @param finishCb
 */
HeiBaiZhen.prototype.showFinish = function(layer, finishCb)
{
    var finalCount = 0;
    var currCount = 0;
    for (var flag in this.zhen) {
        var node = this.zhen[flag].node;
        finalCount += Object.keys(this.zhen[node.flagid].relate).length;
        for (var n in this.zhen[node.flagid].relate) {
            var photon = new cc.Sprite(res.Photon_png);
            photon.attr({
                x: node.sprite.x,
                y: node.sprite.y,
                scale: 1 / 20
            });
            layer.addChild(photon, 1);

            var speedLen = Math.sqrt(Math.pow(node.sprite.x - this.zhen[n].node.sprite.x, 2) +
                Math.pow(node.sprite.y - this.zhen[n].node.sprite.y, 2));
            var speedTime = 0.8 * speedLen / 168;

            photon.runAction(new cc.Sequence(
                new cc.MoveTo(speedTime, cc.p(this.zhen[n].node.sprite.x, this.zhen[n].node.sprite.y)),
                new cc.DelayTime(0.6),
                new cc.CallFunc(function () {
                    currCount++;
                    if (currCount == finalCount) {
                        cc.log("show end");
                        finishCb ? finishCb() : null;
                    }
                }.bind(this), layer)
            ));
        }
    }
}

/**
 * gen a template depend on difficulty
 * @param {Number} [level] bigger and more difficulty
 * @returns {*}
 */
HeiBaiZhen.genNewTemplate = function(level)
{
    var keys = Object.keys(gMapLib);
    if (!HeiBaiZhen.startIndex)
        HeiBaiZhen.startIndex = Math.floor(cc.random0To1() * keys.length);

    if(HeiBaiZhen.startIndex == keys.length)
        HeiBaiZhen.startIndex = 0;

    return gMapLib[keys[HeiBaiZhen.startIndex++]];
}