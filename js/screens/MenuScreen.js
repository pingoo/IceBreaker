var menuState = { preload: menuPreload, create: menuCreate, update: menuUpdate };
GameEngine.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', menuState);

var game = GameEngine.game;

function menuPreload() {

    game.load.image('bgGameScreen', 'assets/images/bgGameScreen.png');
    game.load.image('brick', 'assets/images/brick.png');
    game.load.image('ball', 'assets/images/ball.png');
    game.load.image('paddle', 'assets/images/paddle.png');
    game.load.image('bgMenuScreen', 'assets/images/bgMenuScreen.png');
}

function menuCreate() {    
    MenuScreenContext.background = game.add.tileSprite(0, 0, 800, 600, 'bgMenuScreen');
    
    MenuScreenContext.startGameText = game.add.text(game.world.centerX, game.world.centerY,
                                                               Texts.startGame, { font: "34px Arial", fill: "#00ff00", align: "center" });
    MenuScreenContext.startGameText.anchor.setTo(0.5, 0.5);
    
    MenuScreenContext.loadNextScreen = false;
    MenuScreenContext.timer = null;
    
    game.input.onDown.add(function () {
        MenuScreenContext.loadNextScreen = true;
    }, this);
}

function menuUpdate() {
    if (!MenuScreenContext.loadNextScreen) {
        if (MenuScreenContext.currentInterval < MenuScreenContext.maxInterval) {
            MenuScreenContext.currentInterval++;
            MenuScreenContext.startGameText.width = MenuScreenContext.startGameText.width + 2 * MenuScreenContext.blink;
            MenuScreenContext.startGameText.height = MenuScreenContext.startGameText.height + 0.5 * MenuScreenContext.blink;
            MenuScreenContext.startGameText.angle = MenuScreenContext.startGameText.angle + 0.15 * MenuScreenContext.blink;
        }

        if (MenuScreenContext.currentInterval >= MenuScreenContext.maxInterval) {
            MenuScreenContext.blink = MenuScreenContext.blink * -1;
            MenuScreenContext.currentInterval = 0;
        }
    } else {
        MenuScreenContext.startGameText.angle = MenuScreenContext.startGameText.angle + 4;
        
        if(!MenuScreenContext.timer) {
            var delay = 1400;
            var onComplete = function() {
                game.state.start("gameState");  
            };

            MenuScreenContext.timer = game.time.create();
            MenuScreenContext.timer.add(delay, onComplete, this);
            MenuScreenContext.timer.start();
        }
    }
}