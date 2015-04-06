// GameEngine est une 'classe' statique et 'context' du jeu

// Pas de constructeur, attribution des champs statiques
LevelEditorEngine = {

};

LevelEditorEngine.createBrick = function (game, posX, posY, spriteName, brickScore) {
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
    var brick = new Brick(game, posX, posY, spriteName, brickScore);
    LevelEditorScreenContext.bricks.add(brick);
};