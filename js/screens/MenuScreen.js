// Ecran du menu
var menuState = { preload: menuPreload, create: menuCreate};
GameEngine.game.state.add("menuState", menuState);

function menuPreload() {
    document.getElementById("game-view").style.cursor = "pointer";
    
    game.load.image('bgGameScreen', 'assets/images/bgGameScreen.png');
    game.load.image('brick', 'assets/images/brick.png');
    game.load.image('ball', 'assets/images/ball.png');
    game.load.image('paddle', 'assets/images/paddle.png');
    game.load.image('impact', 'assets/images/impact.png');
    game.load.image('bgMenuScreen', 'assets/images/bgMenuScreen.png');
    game.load.spritesheet('button', 'assets/images/button.png', 180, 90);
}

function menuCreate() {    
    MenuScreenContext.background = game.add.tileSprite(0, 0, 800, 600, 'bgMenuScreen');
    
    MenuScreenContext.loadNextScreen = false;
    MenuScreenContext.timer = null;
    
    var buttonStartGameOnClick = function() {
        game.state.start("gameState");
    };
    
    var buttonLevelEditorOnClick = function() {
        game.state.start("levelEditorState");
    };
    
    new Button(game, Texts.startGame, 400, 200, 1, 'button', buttonStartGameOnClick);
    
    new Button(game, Texts.levelEditor, 400, 320, 1, 'button', buttonLevelEditorOnClick);
}