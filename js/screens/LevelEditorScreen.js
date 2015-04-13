// Ecran principal de l'editeur de niveau
var levelEditorState = { create: levelEditorCreate, update: levelEditorUpdate };
GameEngine.game.state.add("levelEditorState", levelEditorState);

function levelEditorCreate() {
    document.getElementById("game-view").style.cursor = "crosshair";
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    LevelEditorScreenContext.backGround = game.add.tileSprite(0, 0, 800, 600, 'bgGameScreen');

    // Creation d'un groupe 'bricks', tous les membres de ce groupe auront un body
    LevelEditorScreenContext.bricks = game.add.group();
    LevelEditorScreenContext.updateButtons = [];
    
    LevelEditorScreenContext.ball = new Ball(game, game.world.centerX, game.world.centerY, 'ball');
    
    LevelEditorScreenContext.paddle = new Paddle(game, game.world.centerX, Constants.paddleStartY, 'paddle');
    
    // on définit la position de la balle sur le paddle
    LevelEditorScreenContext.ball.y = LevelEditorScreenContext.paddle.y - 16;
    
    LevelEditorScreenContext.positionText = game.add.text(700, 14, '--', { font: "14px Arial", fill: "#0099CC", align: "left" });
    LevelEditorScreenContext.actionText = game.add.text(630, 14, "--", { font: "14px Arial", fill: "#0099CC", align: "left" });
    
    //Boutons de CRUD
    new Button(game, Texts.createBrick, 700, 60, 0.5, 'button', LevelEditorEngine.createBrick);
    
    new Button(game, Texts.deleteBrick, 700, 110, 0.5, 'button', LevelEditorEngine.deleteBrick);
    
    new Button(game, Texts.updateBrick, 700, 160, 0.5, 'button', LevelEditorEngine.updateBrick);
    
    new Button(game, Texts.loadMap, 700, 460, 0.5, 'button', LevelEditorEngine.loadMap);
    
    new Button(game, Texts.saveMap, 700, 510, 0.5, 'button', LevelEditorEngine.saveMap);
    
    new Button(game, Texts.backToMenu, 700, 560, 0.5, 'button', LevelEditorEngine.backToMenuScreen);
    
    //Boutons d'edition de position
    var buttonFiveTop = new Button(game, Texts.five, 680, 200, 0.2, 'button', LevelEditorEngine.fiveTop);
    var buttonOneTop = new Button(game, Texts.one, 720, 200, 0.2, 'button', LevelEditorEngine.oneTop);
    LevelEditorScreenContext.updateButtons.push(buttonFiveTop);
    LevelEditorScreenContext.updateButtons.push(buttonOneTop);
    
    var buttonFiveLeft = new Button(game, Texts.five, 630, 240, 0.2, 'button', LevelEditorEngine.fiveLeft);
    var buttonOneLeft = new Button(game, Texts.one, 670, 240, 0.2, 'button', LevelEditorEngine.oneLeft);
    LevelEditorScreenContext.updateButtons.push(buttonFiveLeft);
    LevelEditorScreenContext.updateButtons.push(buttonOneLeft);
    
    var buttonFiveRight = new Button(game, Texts.five, 730, 240, 0.2, 'button', LevelEditorEngine.fiveRight);
    var buttonOneRight = new Button(game, Texts.one, 770, 240, 0.2, 'button', LevelEditorEngine.oneRight);
    LevelEditorScreenContext.updateButtons.push(buttonFiveRight);
    LevelEditorScreenContext.updateButtons.push(buttonOneRight);
    
    var buttonFiveBottom = new Button(game, Texts.five, 680, 280, 0.2, 'button', LevelEditorEngine.fiveBottom);
    var buttonOneBottom = new Button(game, Texts.one, 720, 280, 0.2, 'button', LevelEditorEngine.oneBottom);
    LevelEditorScreenContext.updateButtons.push(buttonFiveBottom);
    LevelEditorScreenContext.updateButtons.push(buttonOneBottom);
    
    for (var i = 0, len = LevelEditorScreenContext.updateButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.updateButtons[i];
        currentButton.text.fontSize = 12;
        currentButton.setVisible(false);
    }
    
    
    game.input.onDown.add(function () {
        if(game.input.x < Constants.boundX){
            LevelEditorEngine.brickAction(game, game.input.x, game.input.y);
        }
    }, this);
    
    game.input.onHold.add(function () {

    }, this);
}

function levelEditorUpdate() {
    // Plutot que onHold qui ne fonctionne pas, j'utilise ce boolean
    if (game.input.activePointer.isDown) {
        if(game.input.x < Constants.boundX && LevelEditorScreenContext.currentAction === Constants.actionUpdate){
            LevelEditorEngine.moveBrickTo(game.input.x, game.input.y);
        }
    }
}