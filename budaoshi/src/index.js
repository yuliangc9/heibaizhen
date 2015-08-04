/**
 * Created by chenyuliang01 on 2015/7/30.
 */

var IndexLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(255, 255, 255, 255));
        var size = cc.winSize;

        this.sprite = new cc.Sprite(res.IndexBackGround_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.sprite, 0);

        var menu = new cc.Menu(
            addCenterJumpMenu(this, "开始游戏", '微软雅黑', 50, 100, function() {
                cc.director.runScene(new PlayScene(HeiBaiZhen.genNewTemplate(0)));
            }),
//            addCenterJumpMenu(this, "高级模式", '微软雅黑', 50, 10, function() {
//                cc.director.runScene(new PlayScene(HeiBaiZhen.genNewTemplate(1)));
//            }),
            addCenterJumpMenu(this, "自定义", '微软雅黑', 50, -90, function() {
                cc.director.runScene(new DesignScene());
            }),
            addBottomMenu(this, "退出", 0, function(){
                cc.director.end();
            })
        );
        menu.setPosition(cc.p(0, 0));

        this.addChild(menu);

        return true;
    }
});

var IndexScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new IndexLayer();
        this.addChild(layer);
    }
});


