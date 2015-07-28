/**
 * Created by chenyuliang01 on 2015/7/28.
 */

var TestLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(255, 255, 255, 255));

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add "HelloWorld" splash screen"
        var black_sprite = new cc.Sprite(res.BlackNode_png);
        black_sprite.attr({
            x: black_sprite.width/2,
            y: black_sprite.height/2,
            scale: 0.5,
            rotation: 0
        });
        this.addChild(black_sprite, 1);

        var white_sprite = new cc.Sprite(res.WhiteNode_png);
        white_sprite.attr({
            x: size.width - white_sprite.width/2,
            y: size.height - white_sprite.height/2,
            scale: 0.5,
            rotation: 0
        });
        this.addChild(white_sprite, 1);

        var line = new cc.DrawNode();
        line.drawSegment(cc.p(black_sprite.x, black_sprite.y), cc.p(white_sprite.x, white_sprite.y), 3, cc.color(0,0,0,255));
        this.addChild(line, 0);

        //line.clear();
        line.drawSegment(cc.p(black_sprite.x, black_sprite.y), cc.p(white_sprite.x, white_sprite.y - 20), 3, cc.color(0,0,0,255));
        return true;
    }
});

var TestScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TestLayer();
        this.addChild(layer);
    }
});

