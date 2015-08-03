/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var PlayLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,
    fromDesign:null,
    stepCount:0,
    addLight : function() {

    },
    deleteLight : function() {

    },
    ctor:function (template, fromDesign) {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(88, 87, 86, 255));

        this.fromDesign = fromDesign;

        this.lineDrawer = new cc.DrawNode();
        this.addChild(this.lineDrawer, 1);

        var self = this;

        this.zhen = new HeiBaiZhen(template);

        this.zhen.placeNodes(self);
        this.zhen.draw(this.lineDrawer);

        Object.keys(this.zhen.zhen).forEach(function(id)
        {
            var node = self.zhen.zhen[id].node;

            node.enableSwitch(function()
            {
                self.stepCount ++;
                self.zhen.switchNode(node, self, function()
                {
                    self.showFinishDialog();
                });
            });
        });
        this.drawBottomMenu();
        return true;
    },
    drawBottomMenu : function()
    {
        var self = this;

        var menu = new cc.Menu(
            addBottomMenu(this, "返回", -130, function(){
                if (self.fromDesign) {
                    cc.director.runScene((new DesignScene(self.zhen.genTemplate())));
                } else {
                    self.showQuitDialog();
                }
            }, null, null, cc.color(255, 250, 250, 255)),
            addBottomMenu(this, "分享", 0, function(){
                self.showShareDialog();
            }, null, 45, cc.color(255, 255, 255, 255)),
            addBottomMenu(this, "重置", 130, function(){
                self.stepCount = 0;
                self.zhen.reset();
            }, null, null, cc.color(255, 250, 250, 255))
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },
    showFinishDialog : function()
    {
        var self = this;
        showDialogMenu(self,
            [{
                content : "厉害！！",
                style : "宋体",
                size : 28,
                color : cc.color(0,0,0,255),
                height : 0
            },{
                content : "用" + self.stepCount + "步完成破解",
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : 46
            }], [{
                content : "炫耀",
                color : cc.color(255,0,0,255),
                x : 0,
                needBg : true,
                size : 32,
                cb : function(){

                }
            },{
                content : "重试",
                color : cc.color(0,0,0,255),
                x : -95,
                size : 25,
                needBg : true,
                cb : function(dialog){
                    self.stepCount = 0;
                    self.zhen.reset();
                    dialog.removeFromParent(true);
                }
            },{
                content : self.fromDesign ? "返回":"下一关",
                color : cc.color(0,0,0,255),
                x : 100,
                size : 25,
                needBg : true,
                cb : function(dialog){
                    self.fromDesign ?
                        cc.director.runScene((new DesignScene(self.zhen.genTemplate()))) :
                        cc.director.runScene(new PlayScene({}));
                }
            }]
        );
    },
    showShareDialog : function()
    {
        var self = this;
        showDialogMenu(self,
            [{
                content : self.fromDesign ? "把自己设计的这张图" : "分享给朋友",
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : 0
            },{
                content : self.fromDesign ? "分享给朋友" : "一起解锁这张图",
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : 46
            }], [{
                content : "确定",
                color : cc.color(0,0,0,255),
                x : 47,
                needBg : true,
                cb : function(){}
            },{
                content : "取消",
                color : cc.color(0,0,0,255),
                x : -47,
                needBg : true,
                cb : function(dialog){
                    dialog.removeFromParent(true);
                }
            }]
        );
    },
    showQuitDialog : function()
    {
        var self = this;
        showDialogMenu(self,
            [{
                content : "确定要放弃这张图吗",
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : 0
            }], [{
                content : "确定",
                color : cc.color(0,0,0,255),
                x : 47,
                needBg : true,
                cb : function(){
                    if (self.fromDesign) {
                        cc.director.runScene((new DesignScene(self.zhen.genTemplate())));
                    } else {
                        cc.director.runScene(new IndexScene());
                    }
                }
            },{
                content : "取消",
                color : cc.color(0,0,0,255),
                x : -47,
                needBg : true,
                cb : function(dialog){
                    dialog.removeFromParent(true);
                }
            }]
        );
    }
});

var PlayScene = cc.Scene.extend({
    playTemplate : null,
    fromDesign : null,
    ctor:function(template, fromDesign) {
        this._super();
        this.playTemplate = template;
        this.fromDesign = fromDesign;
    },
    onEnter:function () {
        this._super();
        var layer = new PlayLayer(this.playTemplate, this.fromDesign);
        this.addChild(layer);
    }
});
