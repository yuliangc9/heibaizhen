/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var BASE_WIDTH_NUM = 7;
var TOUCH_THRESHOLD = 15;

/**
 * a black white node instance
 * @constructor
 */
function BWNode(notLigth)
{
    this.notLigth = notLigth;
    this.sprite = new cc.Sprite(notLigth ? res.WhiteNode_png : res.WhiteNodeLight_png);
    this.isWhite = true;
    this.isSelected = false;
    this.selectBackGround = null;
    this.scaleSize = cc.winSize.width / BASE_WIDTH_NUM / this.sprite.width;
    this.realWith = this.sprite.width * this.scaleSize;
    this.realHeight = this.sprite.height * this.scaleSize;

    this.flagid = new Date().getTime() + "ts";
}

/**
 * when node is touch, switch its color
 * @param {Function} [cb] when node state change cb with BWNode
 */
BWNode.prototype.enableSwitch = function(cb)
{
    var self = this;
    this.switchListener = cc.EventListener.create({
        event : cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches : true,
        onTouchBegan : function(touch, event)
        {

            var pos = touch.getLocation();
            var target = event.getCurrentTarget();

            if (cc.rectContainsPoint(target.getBoundingBox(),pos))
            {
                cc.audioEngine.playEffect(res.Switch_mp3,false);
                self.switchBW();
                cb ? cb(self) : null;
                return true;
            }
            return false;
        },
        onTouchEnded : function(touch, event)
        {
            //cb ? cb(self) : null;
        }
    });

    cc.eventManager.addListener(this.switchListener, this.sprite);
}

/**
 * switch node color
 */
BWNode.prototype.switchBW = function()
{

    if (this.isWhite)
    {
        this.sprite.setTexture(res.BlackNode_png);
        this.isWhite = false;
    }
    else
    {
        this.sprite.setTexture(this.notLigth ? res.WhiteNode_png : res.WhiteNodeLight_png);
        this.isWhite = true;
    }
}

/**
 * when node is touch, set it selected
 * @param {Function} [selectCb] when is selected cb with BWNode
 * @param {Function} [moveCb] when is dragged cb with BWNode
 */
BWNode.prototype.enableSelect = function(selectCb, moveCb)
{
    var self = this;
    var initTouchX = -1;
    var initTouchY = -1;

    this.selectListener = cc.EventListener.create({
        event : cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches : true,
        onTouchBegan : function(touch, event)
        {
            var pos = touch.getLocation();
            var target = event.getCurrentTarget();

            initTouchX = pos.x;
            initTouchY = pos.y;

            if (cc.rectContainsPoint(target.getBoundingBox(),pos))
            {
                self.isSelected = true;
                return true;
            }
            return false;
        },
        onTouchMoved : function(touch, event)
        {
            var pos = touch.getLocation();

            if (self.isSelected)
            {
                if (pos.x - initTouchX < TOUCH_THRESHOLD &&
                    initTouchX - pos.x < TOUCH_THRESHOLD &&
                    pos.y - initTouchY < TOUCH_THRESHOLD &&
                    initTouchY - pos.y < TOUCH_THRESHOLD)
                {
                    return;
                }
            }

            self.sprite.setPosition(pos);
            if (self.selectBackGround)
            {
                self.selectBackGround.setPosition(pos);
            }

            moveCb ? moveCb(pos.x, pos.y) : null;

            self.isSelected = false;
        },
        onTouchEnded : function(touch, event)
        {
            if (self.isSelected)
            {
                self.isSelected = false;
                self.switchSelect();
                selectCb ? selectCb(self) : null;
            }
        }
    });

    cc.eventManager.addListener(this.selectListener, this.sprite);
}

/**
 * switch select state
 */
BWNode.prototype.switchSelect = function()
{
    if (this.selectBackGround)
    {
//        this.selectBackGround.removeFromParent(true);
//          this.selectBackGround.removeFromParent(true);
        this.selectBackGround = null;
        this.sprite.setTexture(res.WhiteNode_png);
    }
    else
    {
//        var layer = this.sprite.getParent();
//        this.selectBackGround = new cc.Sprite(res.Select_png);
//        this.selectBackGround.attr({
//            x : this.sprite.x,
//            y : this.sprite.y,
//            scale  : 0.5,
//            rotation : 0
//        });
//        layer.addChild(this.selectBackGround, 0);
        this.selectBackGround = true;
        this.sprite.setTexture(res.BlackNode_png);
    }
}

/**
 * place a new node in layer
 * @param layer
 * @param x
 * @param y
 * @param [level]
 */
BWNode.prototype.place = function(layer, x, y, level)
{
    this.sprite.attr({
        x : x,
        y : y,
        scale  : this.scaleSize,
        rotation : cc.random0To1() * 180
    });

//    this.sprite.runAction(
//        new cc.RepeatForever(
//            new cc.RotateBy(0.5, 360)
//        )
//    );
    layer.addChild(this.sprite, level ? level : 3);
}

BWNode.prototype.moveTo = function(t, x, y)
{
    cc.log("get move target %d %d", x, y);
    var action = new cc.MoveTo(t, cc.p(x, y));
    this.sprite.runAction(action);

    if (this.selectBackGround)
    {
        this.selectBackGround.runAction(action.clone());
    }
}

BWNode.prototype.delete = function()
{
    this.sprite.removeFromParent(true);
    this.sprite = null;

    if (this.selectBackGround)
    {
        this.selectBackGround.removeFromParent(true);
        this.selectBackGround = null;
    }

    this.switchListener ? cc.eventManager.removeListener(this.switchListener) : null;
    this.selectListener ? cc.eventManager.removeListener(this.selectListener) : null;
}