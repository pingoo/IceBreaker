var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bg', 'assets/images/background.jpg');
    game.load.image('paddle', 'assets/images/paddle.jpg');
    game.load.image('ball', 'assets/images/ball.png');

}

var GameEngine;

var backGroundImage;

function create() {
    game.time.advancedTiming = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  check des collision avec les bords du canvas, sauf en bas
    // TODO : changer ce colllision check
    game.physics.arcade.checkCollision.down = false;

    backGroundImage = game.add.tileSprite(0, 0, 800, 600, 'bg');

    // Creation d'un groupe 'bricks', tous les membres de ce groupe auront un body
    GameEngine.bricks = game.add.group();
    //GameEngine.bricks.classType = Brick; // On definit le type du groupe sur la classe étendue crée par nos soins

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 15; x++) {
            GameEngine.bricks.add(new Brick(game, 120 + (x * 36), 100 + (y * 52), 'paddle', GameEngine.brickScore));
        }
    }
    
    GameEngine.ball = new Ball(game, game.world.centerX, game.world.centerY, 'ball');
    
    GameEngine.paddle = new Paddle(game, game.world.centerX, 500, 'paddle');
    
    // on définit la position de la balle sur le paddle
    GameEngine.ball.y = GameEngine.paddle.y - 16;
    

    GameEngine.fpsText = game.add.text(20, 20, '--', { font: "14px Arial", fill: "#00ff00", align: "left" });
    GameEngine.scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    GameEngine.livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    GameEngine.introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    GameEngine.introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(function () {
        GameEngine.releaseBall(GameEngine.ball);
    }, this);
    
}

function update () {

    // Fun, but a little sea-sick inducing :) Uncomment if you like!
    // backGroundImage.tilePosition.x += (game.input.speed.x / 2);

    if (game.time.fps) {
        GameEngine.fpsText.text = game.time.fps;    
    }
    
    // paddle.x = Game.calcPaddlePosition(paddle.x, game.input.x);

    GameEngine.update(game.input.x, game);
    //game.debug.body(GameEngine.paddle); // Decommenter pour voir le body du paddle en debug
}
