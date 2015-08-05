var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    WhiteNodeLight_png : "res/black_node.png",
    WhiteNode_png : "res/white_node.png",
    BlackNode_png : "res/white_node_light.png",
    Select_png : "res/selected-4.png",
    BackGround_png : "res/transparent.png",
    IndexBackGround_png : "res/index_bg.png",
    Photon_png : "res/guangzi.png",
    Dialog_png : "res/dialog.png",
    Click_wav : "res/click.wav",
    Switch_mp3 : "res/switch.mp3",
    ToLight_sound : "res/toLight.mp3",
    ToBlack_sound : "res/toBlack.mp3",
    AddNode_sound : "res/addNode.mp3",
    Button_sound : "res/button.mp3",
    PlayBackGround_png : "res/play_bg.png"
};

var monitorMode = true;

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}