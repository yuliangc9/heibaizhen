/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var stepCount = 0;
var PlayLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,
    fromDesign:null,
    addLight : function() {

    },
    deleteLight : function() {

    },
    ctor:function (template, fromDesign) {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(88, 87, 86, 255));

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
                stepCount ++;
                self.zhen.switchNode(node, self, function()
                {
                    showDialogMenu(self,
                        [{
                            content : "厉害！！",
                            style : "宋体",
                            size : 28,
                            color : cc.color(0,0,0,255),
                            height : 0
                        },{
                            content : "用" + stepCount + "步完成破解",
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
                            x : -75,
                            needBg : true,
                            cb : function(dialog){
                                stepCount = 0;
                                self.zhen.reset();
                                dialog.removeFromParent(true);
                            }
                        },{
                            content : "下一关",
                            color : cc.color(0,0,0,255),
                            x : 90,
                            needBg : true,
                            cb : function(){
                                cc.director.runScene(new PlayScene({}));
                            }
                        }]
                    );
                });
            });
        });

        var menu = new cc.Menu(
            addBottomMenu(this, "返回", -130, function(){
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
                            cc.director.runScene(new IndexScene());
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
            }, null, null, cc.color(255, 250, 250, 255)),
            addBottomMenu(this, "分享", 0, function(){
                showDialogMenu(self,
                    [{
                        content : "分享给朋友",
                        style : "宋体",
                        size : 25,
                        color : cc.color(0,0,0,255),
                        height : 0
                    },{
                        content : "一起解锁这张图",
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
            }, null, 45, cc.color(255, 255, 255, 255)),
            addBottomMenu(this, "重置", 130, function(){
                stepCount = 0;
                self.zhen.reset();
            }, null, null, cc.color(255, 250, 250, 255))
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
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
