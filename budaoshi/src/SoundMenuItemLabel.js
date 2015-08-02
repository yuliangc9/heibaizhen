/**
 * Created by qiqi on 2015/8/2.
 */

var SoundMenuItemLabel = cc.MenuItemLabel.extend({
    Sound : res.Click_wav,
    ctor : function(easyLabel,onTouch,layer,soundsrc){
        this._super(easyLabel,onTouch,layer);

    },
    selected : function(){
        cc.audioEngine.playEffect(this.Sound,false);
        this._super();
    }
});