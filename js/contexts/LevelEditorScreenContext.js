// LevelEditorScreenContext est un objet statique qui sert de contexte à l'editeur de niveau

// Pas de constructeur, attribution des champs statiques
LevelEditorScreenContext = {
    backGround : null,
    bricks : null,
    updateButtons : null,
    brickTypeButtons : [],

    positionText : null,
    actionText : null,
    levelNameText : null,
    editorButtons : [],
    
    currentAction : Constants.actionCreate,
    currentBrickType : BrickType.SIMPLE,
    currentBrick : null,
    levels : null,
    levelButtons : [],
    levelIndex : 0,
    
    downSpriteOrigins : null
};
