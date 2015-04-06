// GameEngine est une 'classe' statique et 'context' du jeu

// Pas de constructeur, attribution des champs statiques
LevelEditorEngine = {};

LevelEditorEngine.brickAction = function (game, posX, posY) {
    // creation de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionCreate){
        if (posX < Constants.minBrickX) {
            posX = Constants.minBrickX;
        }
        if(posX > Constants.maxBrickX) {
            posX = Constants.maxBrickX
        }
        if(posY < Constants.minBrickY) {
            posY = Constants.minBrickY;
        }
        if(posY > Constants.maxBrickY) {
            posY = Constants.maxBrickY;
        }
        LevelEditorScreenContext.actionText.text = Texts.createBrick;
        LevelEditorScreenContext.positionText.text = "x:" + posX + "  y:" + posY;
        LevelEditorScreenContext.positionText.x = LevelEditorScreenContext.actionText.x + LevelEditorScreenContext.actionText.width + 10;
        var brick = new Brick(game, posX, posY, 'brick', 20); //TODO : update from selected brick
        LevelEditorScreenContext.bricks.add(brick);
        LevelEditorScreenContext.currentBrick = brick;
    } 

    // supression de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionDelete){
        var brick = null;
        for (var i = 0, len = LevelEditorScreenContext.bricks.children.length; i < len; i++) {
          var currentBrick = LevelEditorScreenContext.bricks.children[i];
            if(posX > currentBrick.x && posX < currentBrick.x + currentBrick.width && posY > currentBrick.y && posY < currentBrick.y + currentBrick.height){
                brick = currentBrick;
                break;
            }
        }
        
        if(brick) {
            LevelEditorScreenContext.bricks.remove(brick);
            LevelEditorScreenContext.currentBrick = null;
        }
    } 

    // Edition de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionUpdate) {
        var brick = null;
        for (var i = 0, len = LevelEditorScreenContext.bricks.children.length; i < len; i++) {
          var currentBrick = LevelEditorScreenContext.bricks.children[i];
            if(posX > currentBrick.x && posX < currentBrick.x + currentBrick.width && posY > currentBrick.y && posY < currentBrick.y + currentBrick.height){
                brick = currentBrick;
                break;
            }
        }
        
        if(brick) {
            LevelEditorScreenContext.currentBrick = brick;
            LevelEditorScreenContext.positionText.text = "x:" + LevelEditorScreenContext.currentBrick.x + "  y:" + LevelEditorScreenContext.currentBrick.y;
        } else {
            LevelEditorScreenContext.currentBrick = null;
        }
    }
    
};

LevelEditorEngine.createBrick = function () {
    LevelEditorScreenContext.currentAction = Constants.actionCreate;
    LevelEditorScreenContext.actionText.text = Texts.createBrick;
    for (var i = 0, len = LevelEditorScreenContext.updateButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.updateButtons[i];
        currentButton.setVisible(false);
    }
};

LevelEditorEngine.deleteBrick = function () {
    LevelEditorScreenContext.currentAction = Constants.actionDelete;
    LevelEditorScreenContext.actionText.text = Texts.deleteBrick;
    LevelEditorScreenContext.positionText.text = "";
    for (var i = 0, len = LevelEditorScreenContext.updateButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.updateButtons[i];
        currentButton.setVisible(false);
    }
};

LevelEditorEngine.updateBrick = function () {
    LevelEditorScreenContext.currentAction = Constants.actionUpdate;
    LevelEditorScreenContext.actionText.text = Texts.updateBrick;
    for (var i = 0, len = LevelEditorScreenContext.updateButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.updateButtons[i];
        currentButton.setVisible(true);
    }
};



// Sauvegarde du niveau
LevelEditorEngine.saveMap = function() {

}



// Edition de la position
LevelEditorEngine.updatePosition = function(moveX, moveY) {
    if(LevelEditorScreenContext.currentBrick) {
        LevelEditorScreenContext.currentBrick.x +=  moveX;
        LevelEditorScreenContext.currentBrick.y +=  moveY;     
        
        // ecrire les coordonnees
        LevelEditorScreenContext.actionText.text = Texts.updateBrick;
        LevelEditorScreenContext.positionText.text = "x:" + LevelEditorScreenContext.currentBrick.x + "  y:" + LevelEditorScreenContext.currentBrick.y;
    }
}

LevelEditorEngine.fiveTop = function () {
    LevelEditorEngine.updatePosition(null, -5);
};

LevelEditorEngine.oneTop = function () {
    LevelEditorEngine.updatePosition(null, -1);
};

LevelEditorEngine.fiveLeft = function () {
    LevelEditorEngine.updatePosition(-5, null);
};

LevelEditorEngine.oneLeft = function () {
    LevelEditorEngine.updatePosition(-1, null);
};

LevelEditorEngine.fiveRight = function () {
    LevelEditorEngine.updatePosition(5, null);
};

LevelEditorEngine.oneRight = function () {
    LevelEditorEngine.updatePosition(1, null);
};

LevelEditorEngine.fiveBottom = function () {
    LevelEditorEngine.updatePosition(null, 5);
};

LevelEditorEngine.oneBottom = function () {
    LevelEditorEngine.updatePosition(null, 1);
};