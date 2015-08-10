/**
 * Created by chenyuliang01 on 2015/7/30.
 */

var IndexLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        var self = this;
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
            addCenterJumpMenu(this, "普通模式", '微软雅黑', 50, 130, function() {
                cc.director.runScene(new PlayScene(HeiBaiZhen.genNewTemplate(0)));
            }),
            addCenterJumpMenu(this, "混沌模式", '微软雅黑', 50, 20, function() {
                cc.director.runScene(new PlayScene(HeiBaiZhen.genNewTemplate(1)));
            }),
            addCenterJumpMenu(this, "上帝模式", '微软雅黑', 50, -90, function() {
                cc.director.runScene(new DesignScene());
            }),
            addBottomMenu(this, "退出", -cc.winSize.width/2 + 80, function(){
                cc.director.end();
            }),
            addBottomMenu(this, "说明", cc.winSize.width/2 - 80, function(){
                showDialogMenu(self,
                    [{
                        content : "点击节点改变节点的状态",
                        style : "宋体",
                        size : 35,
                        color : cc.color(255,255,255,255),
                        height : 80
                    },{
                        content : "被点击节点状态改变时\n会改变相连的节点的状态",
                        style : "宋体",
                        size : 35,
                        color : cc.color(255,255,255,255),
                        height : 180
                    },{
                        content : "当所有所有节点都被点亮\n则完成破解",
                        style : "宋体",
                        size : 35,
                        color : cc.color(255,255,255,255),
                        height : 320
                    }], [], true
                );
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


