/**
 * Created by qiqi on 2015/8/2.
 */

var SoundMenuItemLabel = cc.MenuItemLabel.extend({
    Sound : res.Button_sound,
    ctor : function(easyLabel,onTouch,layer,soundsrc){
        this._super(easyLabel,onTouch,layer);
    },
    selected : function(){
        cc.audioEngine.playEffect( res.Button_sound,false);
        this._super();
    }
});