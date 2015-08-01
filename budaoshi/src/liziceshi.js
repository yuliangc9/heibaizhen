/**
 * Created by chenyuliang01 on 2015/8/1.
 */
var MyActionLayer = cc.LayerColor.extend({
    flagTag: 0,                         // 操作标志
    pLabel: null,
ctor: function (flagTag) {

    this._super(cc.color(255, 255, 255, 255));
    this.flagTag = flagTag;


    cc.log("MyActionLayer init flagTag " + this.flagTag);


    var size = cc.director.getWinSize();


    var backMenuItem = new cc.LabelTTF("<Back", "微软雅黑", 30);
    var backMenuItem = new cc.MenuItemLabel(backMenuItem, this.backMenu, this);
    backMenuItem.x = size.width - 100;
    backMenuItem.y = 100;


    var mn = cc.Menu.create(backMenuItem);
    mn.x = 0;
    mn.y = 0;
    mn.anchorX = 0.5;
    mn.anchorY = 0.5;
    this.addChild(mn);


    this.pLabel =  new cc.LabelTTF("lalala", "微软雅黑", 30);
    this.pLabel.x = size.width /2;
    this.pLabel.y = size.height  - 50;
    this.addChild(this.pLabel, 3);


    return true;
},
backMenu: function (sender) {
    cc.director.popScene();
},
onEnterTransitionDidFinish: function () {
    cc.log("Tag = " + this.flagTag);
//    var sprite = this.getChildByTag(SP_TAG);
    var size = cc.director.getWinSize();


    var system;

//    switch (this.flagTag) {
//        case ActionTypes.kExplosion:
//            system = new cc.ParticleExplosion();
//    //system.setDuration(10);
//    //system.setLife(10);
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Explosion");
//            break;
//        case ActionTypes.kFire:
//            system = new cc.ParticleFire();
//            system.texture = cc.textureCache.addImage(res.WhiteNode_png);
//                this.pLabel.setString("Fire");
//            break;
//        case ActionTypes.kFireworks:
//            system = new cc.ParticleFireworks();
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Fireworks");
//            break;
//        case ActionTypes.kFlower:
            system = new cc.ParticleFlower();
    system.texture = cc.textureCache.addImage(res.BlackNode_png);
            this.pLabel.setString("Flower");
//            break;
//        case ActionTypes.kGalaxy:
//            system = new cc.ParticleGalaxy();
//            this.pLabel.setString("Galaxy");
//            break;
//        case ActionTypes.kMeteor:
//            system = new cc.ParticleMeteor();
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Meteor");
//            break;
//        case ActionTypes.kRain:
//            system = new cc.ParticleRain();
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Rain");
//            break;
//        case ActionTypes.kSmoke:
//            system = new cc.ParticleSmoke();
//            system.texture = cc.textureCache.addImage(res.WhiteNode_png);
//            this.pLabel.setString("Smoke");
//            break;
//        case ActionTypes.kSnow:
//            system = new cc.ParticleSnow();
//    system.texture = cc.textureCache.addImage(res.WhiteNode_png);
//            this.pLabel.setString("Snow");
//            break;
//        case ActionTypes.kSpiral:
//            system = new cc.ParticleSpiral();
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Spiral");
//            break;
//        case ActionTypes.kSun:
//            system = new cc.ParticleSun();
//    system.texture = cc.textureCache.addImage(res.BlackNode_png);
//            this.pLabel.setString("Sun");
//            break;
//    }


    system.x = size.width /2;
    system.y = size.height /2;


    this.addChild(system);
}
});


var MyActionScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MyActionLayer();
        this.addChild(layer);
    }
});