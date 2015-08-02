/**
 * Created by chenyuliang01 on 2015/7/28.
 */

/**
 * init a new zhen
 * @param [template] init with a template
 * @constructor
 */
function HeiBaiZhen(template)
{
    this.zhen = {
//    flagid : {
//        node : BWNode,
//        positionX : x,
//        positionY : y,
//        relate : {
//            flagid : true
//        }
//    }
    };
    if (template)
    {
        for (var n in template)
        {
            this.zhen[n] = template[n];
            this.zhen[n].node = new BWNode();
            this.zhen[n].node.flagid = n;
        }
    }
}

/**
 * add node in zhen
 * @param {BWNode} node
 */
HeiBaiZhen.prototype.addNode = function(node)
{
    this.zhen[node.flagid] = {
        node : node,
        relate : {}
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
    var finalCount = Object.keys(this.zhen[node.flagid].relate).length;
    var currCount = 0;
    for (var n in this.zhen[node.flagid].relate)
    {
        var photon = new cc.Sprite(res.Photon_png);
        photon.attr({
            x : node.sprite.x,
            y : node.sprite.y,
            scale : 1/20
        });
        layer.addChild(photon, 1);

        photon.runAction(new cc.Sequence(
            new cc.MoveTo(0.3, cc.p(this.zhen[n].node.sprite.x, this.zhen[n].node.sprite.y)),
            new cc.CallFunc(function(m){
                self.zhen[m].node.switchBW();
                currCount ++;
                if (currCount == finalCount && self.isFinished())
                {
                    finishCb ? finishCb() : null;
                }
            }.bind(this, n), layer)
        ));

        //this.zhen[n].node.switchBW();
    }
};

HeiBaiZhen.prototype.showFinish = function(layer)
{

}

/**
 * gen a template depend on difficulty
 * @param {Number} level bigger and more difficulty
 * @returns {*}
 */
HeiBaiZhen.genNewTemplate = function(level)
{
    switch (level)
    {
        case 0:
            return JSON.parse('{"1438270766519ts":{"positionX":101.12359550561797,"positionY":294.3820224719101,"relate":{"1438270767363ts":true}},"1438270767363ts":{"positionX":220.22471910112358,"positionY":465.1685393258427,"relate":{"1438270768477ts":true,"1438270766519ts":true}},"1438270768477ts":{"positionX":105.61797752808988,"positionY":588.7640449438202,"relate":{"1438270769014ts":true,"1438270767363ts":true}},"1438270769014ts":{"positionX":330.3370786516854,"positionY":638.2022471910112,"relate":{"1438270768477ts":true}}}');
        case 1:
            return JSON.parse('{"1438270894456ts":{"positionX":128.08988764044943,"positionY":591.0112359550561,"relate":{"1438270898719ts":true,"1438270897744ts":true}},"1438270895023ts":{"positionX":294.3820224719101,"positionY":485.39325842696627,"relate":{"1438270898719ts":true,"1438270897744ts":true,"1438270896372ts":true}},"1438270895703ts":{"positionX":74.15730337078652,"positionY":325.8426966292135,"relate":{"1438270896372ts":true,"1438270897744ts":true}},"1438270896372ts":{"positionX":325.8426966292135,"positionY":229.2134831460674,"relate":{"1438270895703ts":true,"1438270895023ts":true}},"1438270897744ts":{"positionX":202.24719101123594,"positionY":406.7415730337079,"relate":{"1438270895023ts":true,"1438270894456ts":true,"1438270895703ts":true}},"1438270898719ts":{"positionX":267.4157303370786,"positionY":689.8876404494382,"relate":{"1438270894456ts":true,"1438270895023ts":true}}}');
        default:
            return {};
    }
}