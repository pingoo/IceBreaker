// Classe représentant une balle

function Paddle(game, posX, posY, spriteName) {        // Définition du constructeur de la balle
    
    Phaser.Sprite.call(this, game, posX, posY, spriteName);  // Appel du super constructeur
    
    game.physics.enable(this, Phaser.Physics.ARCADE); // Création du body pour la sprite indiquée
    
    this.body.bounce.set(1);                          // paramétrage du 'bounce' du body de la sprite
    
    this.body.immovable = true;                       // je ne sais pas (encore)
    this.anchor.setTo(0.5, 0.5);
    this.body.collideWorldBounds = true;              // TODO : A mettre à false pour y mettre nos propres limites
    this.body.bounce.set(1);
    this.body.immovable = true;
    
    game.add.existing(this);
};


// Extend de la classe sprite pour le paddle
Paddle.prototype = Object.create(Phaser.Sprite.prototype);
Paddle.prototype.constructor = Paddle;