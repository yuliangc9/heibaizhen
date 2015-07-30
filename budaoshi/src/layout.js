/**
 * Created by chenyuliang01 on 2015/7/31.
 */

/**
 * add center menu item
 * @param layer
 * @param text
 * @param fontType
 * @param fontSize
 * @param height
 * @param targetScene
 * @returns {cc.MenuItemLabel}
 */
function addCenterJumpMenu(layer, text, fontType, fontSize, height, cb)
{
    var easyLabel = new cc.LabelTTF(text, fontType, fontSize);
    easyLabel.color = cc.color(0,0,0,255);
    var easyItem = new cc.MenuItemLabel(easyLabel, cb, layer);
    easyItem.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2 + height));

    return easyItem;
}

/**
 * add bottom menu item
 * @param layer
 * @param {String} text
 * @param {Number} x
 * @param {Function} cb
 * @param {String} [fontType]
 * @param {String} [fontSize]
 * @returns {cc.MenuItemLabel}
 */
function addBottomMenu(layer, text, x, cb, fontType, fontSize)
{
    fontType = fontType ? fontType : "微软雅黑";
    fontSize = fontSize ? fontSize : 35;

    var easyLabel = new cc.LabelTTF(text, fontType, fontSize);
    easyLabel.color = cc.color(0,0,0,255);
    var easyItem = new cc.MenuItemLabel(easyLabel, cb, layer);
    easyItem.setPosition(cc.p(cc.winSize.width/2 + x, 40));

    return easyItem;
}