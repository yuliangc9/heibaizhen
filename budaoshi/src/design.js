/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var designedTemplate = null;

var DesignLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,

    drawLine:function () {
        this.zhen.draw(this.lineDrawer, true);
    },
    ctor:function () {
        this._super(cc.color(255, 255, 255, 255));
        this.lineDrawer = new cc.DrawNode();
        this.addChild(this.lineDrawer);

        this.zhen = new HeiBaiZhen();

        var size = cc.winSize;
        var self = this;

        var back_sprite = new cc.Sprite(res.BackGround_png);
        back_sprite.attr({
            x: size.width/2,
            y: size.height/2,
            scale: 1,
            rotation: 0
        });
        this.addChild(back_sprite, 0);

        this.selectedNode = null;

        this.touchListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : function(touch)
            {
                var n = new BWNode(true);

                n.enableSelect(function(){
                    cc.log("get select %s", n.selectBackGround ? "true" : "false");
                    if (n.selectBackGround){
                        if (!self.selectedNode){
                            self.selectedNode = n;
                        }else{
                            if (self.zhen.isConnected(self.selectedNode, n)){
                                self.zhen.disconnectNode(self.selectedNode, n);
                            }else{
                                self.zhen.connectNode(self.selectedNode, n);
                            }
                            self.selectedNode.switchSelect();
                            n.switchSelect();
                            self.selectedNode = null;
                        }
                    }else{
                        if (self.selectedNode == n){
                            self.selectedNode = null;
                        }
                    }
                    self.drawLine();

                }, function(x, y){
                    if (y > size.height - n.realHeight/2){
                        self.zhen.deleteNode(n);
                        if (self.selectedNode == n){
                            self.selectedNode = null;
                        }
                        n.delete();
                    }
                    self.drawLine();
                });
                n.place(self, touch.getLocation().x, touch.getLocation().y);

                self.zhen.addNode(n);

                return true;
            }
        });

        cc.eventManager.addListener(this.touchListener, back_sprite);

        var menu = new cc.Menu(
            addBottomMenu(this, "开始", 0, function(){
                designedTemplate = self.zhen.genTemplate();
                cc.log(JSON.stringify(designedTemplate));
                cc.director.runScene(new PlayScene(designedTemplate));
            })
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    }
});

var DesignScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new DesignLayer();
        this.addChild(layer);
    }
});
