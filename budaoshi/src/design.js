/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var designedTemplate = null;

var DesignLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,

    drawLine:function () {
        this.zhen.draw(this.lineDrawer);
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
                var n = new BWNode();

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

        this.tryLabel = new cc.LabelTTF("开始", 'Times New Roman', 35);
        // position the label on the center of the screen
        this.tryLabel.x = size.width / 2;
        this.tryLabel.y = this.tryLabel.height;
        this.tryLabel.color = cc.color(0, 0, 0, 255);
        // add the label as a child to this layer
        this.addChild(this.tryLabel, 5);

        this.tryListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : function(touch, event)
            {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();

                if (cc.rectContainsPoint(target.getBoundingBox(),pos))
                {
                    designedTemplate = self.zhen.genTemplate();
                    cc.director.runScene(new PlayScene());
                    return true;
                }
                return false;
            }
        });

        cc.eventManager.addListener(this.tryListener, this.tryLabel);

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
