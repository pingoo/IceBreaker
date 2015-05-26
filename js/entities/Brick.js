// Types de briques
var BrickType = {
    UNBREAKABLE : 0,
    SIMPLE : 1,      // Toujours 1 = 1 vie
    TWO_SHOTS : 2,   // Toujours 2 = 2 vies
    THREE_SHOTS : 3, // Toujours 3 = 3 vies
};
// Freeze de l'énumération BrickType
if (Object.freeze) {
    Object.freeze(BrickType);
}

//////////////////////////////////////////////////////////////////////////////

// Teintes pour les briques
var BrickTints = [ 0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF ];

// Définition du constructeur d'une brique abstraite
// Pour créer une brique, utiliser plutôt un autre contructeur
function BaseBrick(game, posX, posY, spriteNames, life, tint, brickType) {

    Phaser.Sprite.call(this, game, posX, posY, spriteNames[spriteNames.length - 1]); // Appel du super constructeur
    
    this.life = life;
    this.baseLife = life;
    this.scoreValue = Constants.brickScore; // Score par defaut
    this.spriteNames = spriteNames;
    this.tint = tint;
    this.brickType = brickType;
    
    game.physics.enable(this, Phaser.Physics.ARCADE); // Création du body pour la sprite indiquée
    
    this.body.bounce.set(1);
    this.body.immovable = true;
};

// Extend de la classe Sprite pour BaseBrick
BaseBrick.prototype = Object.create(Phaser.Sprite.prototype);
BaseBrick.prototype.constructor = BaseBrick;

// Déclaration d'une fonction de dégât sur une brique
BaseBrick.prototype.damage = function(damageAmount) {
    if (this.life) {
        this.life -= damageAmount;

        if (this.life <= 0) {
           this.killBrick(); 
        } else {
            this.loadTexture(spriteNames[this.life - 1]);
        }
    }
};

// Déclaration d'une fonction de destruction de la brique
BaseBrick.prototype.killBrick = function() {
    this.kill();
    GameEngine.addScore(this.scoreValue);  // Appel  de la fonction pour augmenter le score

    //  Reste t'il des briques ?
    if (GameEngine.howManyBricksLeft() == 0) {
        GameEngine.allKilled();  // Appel de la fonction pour signifier au jeu que toutes les briques sont détruites
    }
};

// Est-ce que la brique est cassable
BaseBrick.prototype.isBreakable = function() {
    return this.life != null;
}

// Lors du revive, remettre la brique avec sa vie et son image d'origine
BaseBrick.prototype.revive = function() {
    Phaser.Sprite.prototype.revive.call(this);
    this.life = this.baseLife;
    this.loadTexture(spriteNames[spriteNames.length - 1]);
}

//////////////////////////////////////////////////////////////////////////////

// Définition du constructeur d'une brique de cassable
function SimpleBrick(game, posX, posY, life) {
    // Choix d'une teinte au hasard
    //if (tint == null) {
    //    tint = BrickTints[(life - 1) % BrickTints.length];
    //}
    
    life = (life == null) || (life < 1) ? 1 : (life > 3 ? 3 : life);
    spriteNames = life == 1 ? ['brickSimple'] : ['brick3Shot_1', 'brick3Shot_2', 'brick3Shot_3'].splice(0, life);
    brickType = life; //[BrickType.SIMPLE, BrickType.TWO_SHOTS, BrickType.THREE_SHOTS][life - 1];
    BaseBrick.call(this, game, posX, posY, spriteNames, life, 0xFFFFFF, brickType);
}

// Extend de la classe BaseBrick pour les SimpleBrick
SimpleBrick.prototype = Object.create(BaseBrick.prototype);
SimpleBrick.prototype.constructor = SimpleBrick;

//////////////////////////////////////////////////////////////////////////////

// Définition du constructeur d'une brique incassable
function UnbreakableBrick(game, posX, posY) {
    BaseBrick.call(this, game, posX, posY, ['brickWall'], null, 0xFFFFFF, BrickType.UNBREAKABLE);
}

// Extend de la classe SimpleBrick pour UnbreakableBrick
UnbreakableBrick.prototype = Object.create(BaseBrick.prototype);
UnbreakableBrick.prototype.constructor = UnbreakableBrick;

// Construit une brique à partir de son BrickType
function buildNewBrick (game, x, y, brickType) {
    var newBrick;
    switch (brickType) {
        case BrickType.UNBREAKABLE:
            newBrick = new UnbreakableBrick(game, x, y);
            break;
        case BrickType.SIMPLE:
        case BrickType.TWO_SHOTS:
        case BrickType.THREE_SHOTS:
            newBrick = new SimpleBrick(game, x, y, brickType);
            break;
        default:
            newBrick = new SimpleBrick(game, x, y, BrickType.SIMPLE);
    }
    return newBrick;
}