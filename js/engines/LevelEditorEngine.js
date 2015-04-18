// GameEngine est une "classe" statique et "context" du jeu

// Pas de constructeur, attribution des champs statiques
LevelEditorEngine = {
    save : null,
    operation : null,
    
    operationLoad : "LOAD",
    operationSave : "SAVE",
    oldFileRemoved : false
};

LevelEditorEngine.brickAction = function (game, posX, posY) {
    // creation de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionCreate){
        var newBrickPos = LevelEditorEngine.getInboudsPos(posX, posY);
        posX = newBrickPos.x;
        posY = newBrickPos.y;
        LevelEditorScreenContext.actionText.text = Texts.createBrick;
        LevelEditorScreenContext.positionText.text = "x:" + posX + "  y:" + posY;
        LevelEditorScreenContext.positionText.x = LevelEditorScreenContext.actionText.x + LevelEditorScreenContext.actionText.width + 10;
        var brick = new Brick(game, posX, posY, "brick", 20); //TODO : update from selected brick
        LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.add(brick);
        LevelEditorScreenContext.currentBrick = brick;
    }

    // supression de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionDelete){
        var brick = null;
        for (var i = 0, len = LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.children.length; i < len; i++) {
          var currentBrick = LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.children[i];
            if(posX > currentBrick.x && posX < currentBrick.x + currentBrick.width && posY > currentBrick.y && posY < currentBrick.y + currentBrick.height){
                brick = currentBrick;
                break;
            }
        }
        
        if(brick) {
            LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.remove(brick);
            LevelEditorScreenContext.currentBrick = null;
        }
    } 

    // Edition de brique
    if(LevelEditorScreenContext.currentAction === Constants.actionUpdate) {
        var brick = null;
        for (var i = 0, len = LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.children.length; i < len; i++) {
          var currentBrick = LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.children[i];
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


// Nettoyage des boutons au chargement
LevelEditorEngine.clearButtonsLevel = function() {
    // on destroy tout ça
    if(LevelEditorScreenContext.levelButtons){
        for (var i = 0, len = LevelEditorScreenContext.levelButtons.length; i < len; i++) {
            var currentButton = LevelEditorScreenContext.levelButtons[i];
            currentButton.destroy();
        }
        LevelEditorScreenContext.levelButtons = [];
    }
}


// Nettoyage du niveau de ses briques
LevelEditorEngine.clearLevel = function() {
    // on cache juste les briques
    if(LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex] && LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks) {
        LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.callAll('kill');
    }
}

LevelEditorEngine.showBricksLevel = function() {
    // on cache juste les briques
    if(LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex] && LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks){
        LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].bricks.callAll('revive');
    }
}

// Retour au menu
LevelEditorEngine.backToMenuScreen = function() {
    game.state.start("menuState");
}


//Normalize la position de la brique
LevelEditorEngine.getInboudsPos = function(posX, posY) {
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
    return { x : posX, y : posY};
}


// Deplacement de la position
LevelEditorEngine.updatePosition = function(moveX, moveY) {
    if(LevelEditorScreenContext.currentBrick) {
        var newPosX = LevelEditorScreenContext.currentBrick.x + moveX;
        var newPosY = LevelEditorScreenContext.currentBrick.y + moveY;
        LevelEditorEngine.moveBrickTo(newPosX, newPosY);
    }
}

// Changement de la position
LevelEditorEngine.moveBrickTo = function (posX, posY) {
    if(LevelEditorScreenContext.currentBrick) {
        var newBrickPos = LevelEditorEngine.getInboudsPos(posX, posY);
        LevelEditorScreenContext.currentBrick.x =  newBrickPos.x;
        LevelEditorScreenContext.currentBrick.y =  newBrickPos.y;
        
        // ecrire les coordonnees
        LevelEditorScreenContext.actionText.text = Texts.updateBrick;
        LevelEditorScreenContext.positionText.text = "x:" + LevelEditorScreenContext.currentBrick.x + "  y:" + LevelEditorScreenContext.currentBrick.y;
    }
}


// Detection de la position au moment du click sur la sprite
LevelEditorEngine.getSpriteOrigins = function (downX, downY) {
    if(LevelEditorScreenContext.currentBrick) {
        var posX = downX - LevelEditorScreenContext.currentBrick.x;
        var posY = downY - LevelEditorScreenContext.currentBrick.y;
        return {x : posX, y : posY};
    }
}


LevelEditorEngine.fiveTop = function () {
    LevelEditorEngine.updatePosition(0, -5);
};

LevelEditorEngine.oneTop = function () {
    LevelEditorEngine.updatePosition(0, -1);
};

LevelEditorEngine.fiveLeft = function () {
    LevelEditorEngine.updatePosition(-5, 0);
};

LevelEditorEngine.oneLeft = function () {
    LevelEditorEngine.updatePosition(-1, 0);
};

LevelEditorEngine.fiveRight = function () {
    LevelEditorEngine.updatePosition(5, 0);
};

LevelEditorEngine.oneRight = function () {
    LevelEditorEngine.updatePosition(1, 0);
};

LevelEditorEngine.fiveBottom = function () {
    LevelEditorEngine.updatePosition(0, 5);
};

LevelEditorEngine.oneBottom = function () {
    LevelEditorEngine.updatePosition(0, 1);
};


// Préparation de la structure des niveaux
LevelEditorEngine.instanciateLevels = function() {
    LevelEditorScreenContext.levels = [];
    LevelEditorEngine.addNewLevel();
};

// Ajout d'un niveau
LevelEditorEngine.addNewLevel = function() {
    var name = window.prompt(Texts.newLevelTitle, Texts.newLevelText);
    if(name) {
        LevelEditorEngine.addLevel(name);
    }
};

// Renomer un niveau
LevelEditorEngine.renameLevel = function() {
    var newName = window.prompt(Texts.newLevelTitle, Texts.newLevelText);
    LevelEditorScreenContext.levels[LevelEditorScreenContext.levelIndex].name = newName;
    LevelEditorScreenContext.levelNameText.text = "-- " + newName + " --";
    var lastButtonPosX = LevelEditorScreenContext.levelNameText.x + LevelEditorScreenContext.levelNameText.width + 60;
    for (var i = 0, len = LevelEditorScreenContext.editorButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.editorButtons[i];
        currentButton.setPosition(lastButtonPosX, 588);
        lastButtonPosX += currentButton.button.width + 2;
    }
}

LevelEditorEngine.addLevel = function(name) {
    var newLevel = {};
    newLevel.name = name;
    newLevel.bricks = game.add.group();
    LevelEditorScreenContext.levels.push(newLevel);
    LevelEditorEngine.addLevelButtonSelector();
};

// Crée un bouton pour sélectionner le niveau
LevelEditorEngine.addLevelButtonSelector = function() {
    var levelNumber = LevelEditorScreenContext.levels.length;
    var newButton = new Button(game, "-" + levelNumber + "-", 34 * levelNumber, 540, 0.2, 'button', function(){
        LevelEditorEngine.changeLevel(levelNumber);
    });
    
    LevelEditorScreenContext.levelButtons.push(newButton);
    LevelEditorEngine.changeLevel(levelNumber);
}

// Action du click depuis un bouton sur le niveau choisi
LevelEditorEngine.changeLevel = function(levelNumber) {
    // Avant toute chose
    LevelEditorEngine.clearLevel();
    
    var index = levelNumber - 1;
    for (var i = 0, len = LevelEditorScreenContext.levelButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.levelButtons[i];
        currentButton.setTint(0xFFFFFF);
    }
    LevelEditorScreenContext.levelButtons[index].setTint(0xF44336);
    LevelEditorScreenContext.levelIndex = index;
    LevelEditorEngine.showBricksLevel();
    LevelEditorScreenContext.levelNameText.text = "-- " + LevelEditorScreenContext.levels[index].name + " --";
    var lastButtonPosX = LevelEditorScreenContext.levelNameText.x + LevelEditorScreenContext.levelNameText.width + 60;
        for (var i = 0, len = LevelEditorScreenContext.editorButtons.length; i < len; i++) {
        var currentButton = LevelEditorScreenContext.editorButtons[i];
        currentButton.setPosition(lastButtonPosX, 588);
        lastButtonPosX += currentButton.button.width + 2;
    }
}

// Chargement des niveaux //
LevelEditorEngine.loadLevels = function() {
    LevelEditorEngine.operation = LevelEditorEngine.operationLoad;
    initFileSystem();
};


// Creation des niveaux //
LevelEditorEngine.createLevels = function(e) {
    // this.result est le résultat du chargement de la sauvegarde
    console.log(this.result);

    // 1- on enlève les eventuelles bricks déjà présentes et on vide les niveaux
    LevelEditorEngine.clearLevel();
    LevelEditorEngine.clearButtonsLevel();
    LevelEditorScreenContext.levels = [];
    LevelEditorScreenContext.levelButtons = [];
    
    // 2 - on réccupère l'objet de la sauvegarde
    var levels = JSON.parse(this.result).levels;

    // 3 - on réccupère les infos
    for(var i = 0, levelsLength = levels.length; i < levelsLength; i++) {
        LevelEditorScreenContext.levelIndex = i;
        var level = levels[i];
        var bricks = level.bricks;
        var name = level.name;
        
        // 4 - on définit le nom et on replace les briques
        LevelEditorEngine.addLevel(name);
        LevelEditorEngine.createBricks(bricks);
    }
    
    LevelEditorEngine.changeLevel(1);
    LevelEditorScreenContext.currentAction = Constants.actionUpdate;
};

// Creation des briques d'un niveau depuis une liste
LevelEditorEngine.createBricks = function(bricks) {
    LevelEditorScreenContext.currentAction = Constants.actionCreate;
    for(var i = 0, bricksLength = bricks.length; i < bricksLength; i++){
        var brick = bricks[i];
        LevelEditorEngine.brickAction(game, brick.x, brick.y);
    }
}


// Sauvegarde des niveaux //
LevelEditorEngine.saveLevels = function() {
    LevelEditorEngine.operation = LevelEditorEngine.operationSave;
    
    LevelEditorEngine.save = {};
    LevelEditorEngine.save.levels = [];
    
    var aBricks = [];

    for (var i = 0, len = LevelEditorScreenContext.levels.length; i < len; i++) {
        var currentLevel = LevelEditorScreenContext.levels[i];
        aBricks = [];
        for (var j = 0, lenB = currentLevel.bricks.children.length; j < lenB; j++) {
            var currentBrick = currentLevel.bricks.children[j];
            aBricks.push({x : currentBrick.x, y : currentBrick .y});
        }
        
        LevelEditorEngine.save.levels[i] = {};
        LevelEditorEngine.save.levels[i].name = currentLevel.name;
        LevelEditorEngine.save.levels[i].bricks = aBricks;
    }

    console.log(JSON.stringify(LevelEditorEngine.save));
    initFileSystem();
};

function initFileSystem() {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, onInitFileSytem, errorHandler);
    }, function(e) {
        console.log('Error', e);
    });
}

function onInitFileSytem(fileSystem) {
    fileSystem.root.getDirectory("data", {create: true}, onGetDirectory);
}

function onGetDirectory(dirEntry) {
    dirEntry.getFile('levels.json', {create: true}, onGetFile);
}

function onGetFile(fileEntry) {
    if(LevelEditorEngine.operation === LevelEditorEngine.operationSave){
        if(!LevelEditorEngine.oldFileRemoved){
            fileEntry.remove(function() {
                LevelEditorEngine.oldFileRemoved = true;
                LevelEditorEngine.saveLevels();
            }, errorHandler);
        } else {
            fileEntry.createWriter(onWriterReady, errorHandler);
            LevelEditorEngine.oldFileRemoved = false;
        }
    }
    
    if(LevelEditorEngine.operation === LevelEditorEngine.operationLoad){
        fileEntry.file(onFileReady, errorHandler);
    }
}

function onWriterReady(fileWriter) {
    var blob = new Blob([JSON.stringify(LevelEditorEngine.save)], {type: "application/json"});
    fileWriter.write(blob);
}

function onFileReady(fileEntry) {
    var reader = new FileReader();
    reader.onloadend = LevelEditorEngine.createLevels;
    reader.readAsText(fileEntry); 
}

function errorHandler(e) {
  var msg = "";

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = "QUOTA_EXCEEDED_ERR";
      break;
    case FileError.NOT_FOUND_ERR:
      msg = "NOT_FOUND_ERR";
      break;
    case FileError.SECURITY_ERR:
      msg = "SECURITY_ERR";
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = "INVALID_MODIFICATION_ERR";
      break;
    case FileError.INVALID_STATE_ERR:
      msg = "INVALID_STATE_ERR";
      break;
    default:
      msg = "Unknown Error";
      break;
  };

  console.log("Error: " + msg);
}