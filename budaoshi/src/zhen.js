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
 */
HeiBaiZhen.prototype.draw = function(lineDrawer)
{
    lineDrawer.clear();
    for (var n in this.zhen)
    {
        for (var l in this.zhen[n].relate)
        {
            lineDrawer.drawSegment(
                cc.p(this.zhen[n].node.sprite.x, this.zhen[n].node.sprite.y),
                cc.p(this.zhen[l].node.sprite.x, this.zhen[l].node.sprite.y),
                3, cc.color(0,0,0,255));
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

HeiBaiZhen.prototype.switchNode = function(node)
{
    for (var n in this.zhen[node.flagid].relate)
    {
        this.zhen[n].node.switchBW();
    }
};