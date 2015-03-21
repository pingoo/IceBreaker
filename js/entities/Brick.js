function Brick(game, posX, posY, spriteName, scoreValue) {      // Définition du constructeur d'une brique

    this.life = 1;
    this.scoreValue = GameEngine.brickScore; // Score par defaut
    
    // callback functions
    this.addScore = null;
    this.allKilled = null;
    
    Phaser.Sprite.call(this, game, posX, posY, spriteName); // Appel du super constructeur
    
    game.physics.enable(this, Phaser.Physics.ARCADE); // Création du body pour la sprite indiquée
    
    this.body.bounce.set(1);
    this.body.immovable = true;
    this.scoreValue = scoreValue;
};


// Extend de la classe Sprite pour les bricks
Brick.prototype = Object.create(Phaser.Sprite.prototype);
Brick.prototype.constructor = Brick;


Brick.prototype.damage = function(damageAmount) { // Déclaration d'une fonction de dégat sur une brique
    this.life -= damageAmount;
    
    if(this.life <= 0) {
       this.killBrick(); 
    }
};


Brick.prototype.killBrick = function() { // Déclaration d'une fonction de déstruction de la brique
    this.kill();
    GameEngine.addScore(this.scoreValue);  // Appel  de la fonction pour augmenter le score

    //  Reste t'il des briques ?
    if (GameEngine.bricks.countLiving() == 0) {
        GameEngine.allKilled();  // Appel  de la fonction pour signifier au jeu que toutes les briques sont détruites
    }
};