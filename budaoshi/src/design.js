/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var designedTemplate = null;

var DesignLayer = cc.LayerColor.extend({
    sprite:null,
    lineDrawer:null,
    zhen:null,

    drawLine:function () {
        this.zhen.draw(this.lineDrawer, false);
    },
    ctor:function (template) {
        this._super(cc.color(80, 79, 78, 255));
        this.lineDrawer = new cc.DrawNode();
        this.addChild(this.lineDrawer);

        this.zhen = new HeiBaiZhen(template, true);

        for (var existNode in this.zhen.zhen)
        {
            this.zhen.zhen[existNode].node = this.addNode();
                /*this.zhen.zhen[existNode].positionX, this.zhen.zhen[existNode].positionY*/
            this.zhen.zhen[existNode].node.flagid = existNode;

            if (this.zhen.zhen[existNode].initIsGood) {
                this.zhen.zhen[existNode].node.switchBW();
            }
        }

        this.zhen.placeNodes(this);
        this.zhen.draw(this.lineDrawer);

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
                cc.audioEngine.playEffect(res.AddNode_sound,false);
                var n = self.addNode();
                n.place(self, touch.getLocation().x, touch.getLocation().y);
                self.zhen.addNode(n);
                return true;
            }
        });

        cc.eventManager.addListener(this.touchListener, back_sprite);

        this.drawBottomMenu();

        return true;
    },
    showExplainDialog : function()
    {
        var self = this;
        showDialogMenu(self,
            [{
                content : "设计属于自己的阵形",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 10
            },{
                content : "点击空白区域添加新节点",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 90
            },{
                content : "拖动节点改变节点位置",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 190
            },{
                content : "点击可以选中节点，选择\n两个点可以建立或删除连线",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 300
            },{
                content : "重复选择节点可改变\n节点的初始状态",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 400
            },{
                content : "将节点移到屏幕顶端可删除",
                style : "宋体",
                size : 35,
                color : cc.color(255,255,255,255),
                height : 500
            }], [], true
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
    },
    showCheckInDialog : function()
    {
        var self = this;
        showDialogMenu(self,
            [{
                content : "确定要录入这张图吗",
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : -10
            },{
                content : self.zhen.bestStep() == -1 ? '无解':"最少步数为" + self.zhen.curBestStep,
                style : "宋体",
                size : 25,
                color : cc.color(0,0,0,255),
                height : 20
            }], [{
                content : "确定",
                color : cc.color(0,0,0,255),
                x : 47,
                needBg : true,
                cb : function(){
                    var xmlhttp = new XMLHttpRequest();
                    var url = "/map/insert?bestStep="+self.zhen.curBestStep;
                    //url += "&struct=" + encodeURIComponent(JSON.stringify(self.zhen.genTemplate()));

                    xmlhttp.onreadystatechange = function() {
                        cc.director.runScene(new IndexScene());
                    };
                    xmlhttp.open("post", url, true);
                    xmlhttp.send(JSON.stringify(self.zhen.genTemplate()));
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
    },
    drawBottomMenu : function()
    {
        var self = this;

        var menu = new cc.Menu(
            addBottomMenu(this, "返回", -130, function(){
                self.showQuitDialog();
            }, null, null, cc.color(255, 250, 250, 255)),
            addBottomMenu(this, "试玩", 0, function(){
                designedTemplate = self.zhen.genTemplate();
                cc.director.runScene(new PlayScene(self.zhen.genTemplate(), true));
            }, null, 45, cc.color(255, 255, 255, 255)),
            addBottomMenu(this, monitorMode ? "导入":"说明", 130, function(){
                monitorMode ? self.showCheckInDialog() : self.showExplainDialog();
            }, null, null, cc.color(255, 250, 250, 255))
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },
    addNode : function()
    {
        var self = this;

        var n = new BWNode(true);
        n.enableSelect(function(){
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
                    n.switchBW();
                }
            }
            self.drawLine();

        }, function(x, y){
            if (y > cc.winSize.height - n.realHeight/2){
                self.zhen.deleteNode(n);
                if (self.selectedNode == n){
                    self.selectedNode = null;
                }
                n.delete();
            }
            self.drawLine();
        });

        return n;
    }
});

var DesignScene = cc.Scene.extend({
    initTemplate : null,
    ctor:function(template) {
        this._super();
        this.initTemplate = template;
    },
    onEnter:function () {
        this._super();
        var layer = new DesignLayer(this.initTemplate);
        this.addChild(layer);
    }
});
