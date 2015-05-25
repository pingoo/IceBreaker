// Ecran principal du jeu
var gameState = { create: gameCreate, update: gameUpdate };
GameEngine.game.state.add("gameState", gameState);

function gameCreate() {
    document.getElementById("game-view").style.cursor = "none";
    
    game.time.advancedTiming = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  check des collision avec les bords du canvas, sauf en bas
    game.physics.arcade.checkCollision.down = false;
    game.physics.arcade.setBounds(0, 0, Constants.boundX, 600);

    GameScreenContext.backGround = game.add.tileSprite(0, 0, 800, 600, 'bgGameScreen');

    // Creation d'un groupe 'bricks', tous les membres de ce groupe auront un body
    GameScreenContext.bricks = game.add.group();
    //GameEngine.bricks.classType = BaseBrick; // On definit le type du groupe sur la classe étendue crée par nos soins

    // Creation d'un groupe 'bricks', tous les membres de ce groupe auront un body
    GameScreenContext.unbreakableBricks = game.add.group();
    //GameEngine.unbreakableBricks.classType = UnbreakableBrick; // On definit le type du groupe sur la classe étendue crée par nos soins

    // Remplissage basique d'un tableau aléatoire
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 11; x++) {
            var brickChoice = game.rnd.pick([0, 1, 1, 1, 1, 2, 2, 2, 3, 3]);
            //var brickChoice = game.rnd.integerInRange(0, 3);
            var newBrick = buildNewBrick(game, 120 + (x * 36), 100 + (y * 52), brickChoice);
            if (!newBrick.isBreakable()) {
                GameScreenContext.unbreakableBricks.add(newBrick);
            } else {
                GameScreenContext.bricks.add(newBrick);
            }
        }
    }
    
    GameScreenContext.ball = new Ball(game, game.world.centerX, game.world.centerY, 'ball');
    
    GameScreenContext.paddle = new Paddle(game, game.world.centerX, Constants.paddleStartY, 'paddle');
    
    GameScreenContext.impact = game.add.sprite(0, 0, 'impact');
    GameScreenContext.impact.visible = false;
    
    // on définit la position de la balle sur le paddle
    GameScreenContext.ball.y = GameScreenContext.paddle.y - 24;
    

    GameScreenContext.fpsText = game.add.text(game.world.width - 40, 20, '--', { font: "14px Arial", fill: "#00ff00", align: "left" });
    GameScreenContext.debugText = game.add.text(680, 60, '--', { font: "14px Arial", fill: "#00ff00", align: "left" });
    GameScreenContext.scoreText = game.add.text(680, 520, Texts.score + GameEngine.score, { font: "20px Arial", fill: "#00ff00", align: "left" });
    GameScreenContext.livesText = game.add.text(680, 550, Texts.lives + GameEngine.lives, { font: "20px Arial", fill: "#00ff00", align: "left" });
    GameScreenContext.introText = game.add.text(game.world.centerX, 400, Texts.startLevel, { font: "40px Arial", fill: "#00ff00", align: "center" });
    GameScreenContext.introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(function () {
        GameEngine.releaseBall(GameScreenContext.ball);
        if(GameEngine.paused) {
            GameEngine.paused = false;
            gamePause();
        }
    }, this);
    
    // on gère la touche P pour la pause
    game.input.keyboard.onDownCallback = function(e) {
        if(e.keyCode == Phaser.Keyboard.P) {
            GameEngine.paused = !GameEngine.paused;
            gamePause();
        }
    };
    
    GameEngine.reset();
}

function gamePause() {
    if(GameScreenContext.introText) { // D'abord on s'assure que introText ne soit pas null, et donc qu'on soit sur l'écran de jeu
        // on enlève la pause ssi la souris n'est pas hors de l'écran et que l'on n'est pas en pause
        GameEngine.paused = GameEngine.mouseOffScreen || GameEngine.paused;
        GameScreenContext.introText.text = Texts.pause;
        GameScreenContext.introText.visible = GameEngine.paused;
        game.paused = GameEngine.paused;
    }
}

function gameUpdate() {

    // Fun, but a little sea-sick inducing :) Uncomment if you like!
    // backGroundImage.tilePosition.x += (game.input.speed.x / 2);

    if (game.time.fps) {
        GameScreenContext.fpsText.text = game.time.fps;    
    }
    
    // paddle.x = Game.calcPaddlePosition(paddle.x, game.input.x);

    GameEngine.update(game.input.x, game);
    //game.debug.body(GameEngine.paddle); // Decommenter pour voir le body du paddle en debug
    
    GameEngine.calcBallAngleTest2(GameScreenContext.ball);
}
