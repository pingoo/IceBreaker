var menuState = { preload: menuPreload, create: menuCreate, update: menuUpdate };
GameEngine.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', menuState);

var game = GameEngine.game;

function menuPreload() {

    game.load.image('bg', 'assets/images/background.jpg');
    game.load.image('paddle', 'assets/images/paddle.jpg');
    game.load.image('ball', 'assets/images/ball.png');

}

function menuCreate() {    
    MenuScreenContext.background = game.add.tileSprite(0, 0, 800, 600, 'bg');
    
    MenuScreenContext.startGameText = game.add.text(game.world.centerX, game.world.centerY,
                                                               Texts.startGame, { font: "34px Arial", fill: "#00ff00", align: "center" });
    MenuScreenContext.startGameText.anchor.setTo(0.5, 0.5);
    
    game.input.onDown.add(function () {
        game.state.start("gameState");
    }, this);
}

function menuUpdate() {
    
}