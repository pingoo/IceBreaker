// Ecran principal de l'editeur de niveau
var levelEditorState = { create: levelEditorCreate, update: levelEditorUpdate };
GameEngine.game.state.add("levelEditorState", levelEditorState);

function levelEditorCreate() {
    document.getElementById("game-view").style.cursor = "crosshair";
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    LevelEditorScreenContext.backGround = game.add.tileSprite(0, 0, 800, 600, 'bgGameScreen');

    // Creation d'un groupe 'bricks', tous les membres de ce groupe auront un body
    LevelEditorScreenContext.bricks = game.add.group();
    
    LevelEditorScreenContext.ball = new Ball(game, game.world.centerX, game.world.centerY, 'ball');
    
    LevelEditorScreenContext.paddle = new Paddle(game, game.world.centerX, Constants.paddleX, 'paddle');
    
    // on définit la position de la balle sur le paddle
    LevelEditorScreenContext.ball.y = LevelEditorScreenContext.paddle.y - 16;
    
    LevelEditorScreenContext.debugText = game.add.text(680, 60, '--', { font: "14px Arial", fill: "#00ff00", align: "left" });
    LevelEditorScreenContext.introText = game.add.text(game.world.centerX, 400, "", { font: "40px Arial", fill: "#00ff00", align: "center" });
    LevelEditorScreenContext.introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(function () {
        LevelEditorEngine.createBrick(game, game.input.x, game.input.y, 'brick', Constants.brickScore);
    }, this);
    
    
}

function levelEditorUpdate() {

}
