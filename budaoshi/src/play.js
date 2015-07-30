/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var PlayLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,
    ctor:function (template) {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(255, 255, 255, 255));

        this.lineDrawer = new cc.DrawNode();
        this.addChild(this.lineDrawer);

        var self = this;

        this.zhen = new HeiBaiZhen(template);

        this.zhen.placeNodes(self);
        this.zhen.draw(this.lineDrawer);

        Object.keys(this.zhen.zhen).forEach(function(id)
        {
            var node = self.zhen.zhen[id].node;

            node.enableSwitch(function()
            {
                self.zhen.switchNode(node);

                if (self.zhen.isFinished())
                {
                    cc.log("HAHAHAHA FINISH!!!!!");
                }
            });
        });

        var menu = new cc.Menu(
            addBottomMenu(this, "返回", 0, function(){
                cc.director.runScene(new IndexScene());
            })
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    }
});

var PlayScene = cc.Scene.extend({
    playTemplate : null,
    ctor:function(template) {
        this._super();
        this.playTemplate = template;
    },
    onEnter:function () {
        this._super();
        var layer = new PlayLayer(this.playTemplate);
        this.addChild(layer);
    }
});
