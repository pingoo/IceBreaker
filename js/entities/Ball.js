// Classe représentant une balle
function Ball(game, posX, posY, spriteName) {   // Définition du constructeur de la balle
    this.damageValue = 1; // Dégats que fait la balle en frappant une brique
    this.lastAngle = null;
    
    Phaser.Sprite.call(this, game, posX, posY, spriteName); // Appel du super constructeur
    
    game.physics.enable(this, Phaser.Physics.ARCADE); // Création du body pour la sprite indiquée
    
    this.anchor.set(0.5);                             // Origine du sprite par rapport au coin supérieur gauche
    this.checkWorldBounds = true; // TODO : mettre à false plus tard

    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);

    // Fonction appelée à la sortie de la balle de l'écran
    this.events.onOutOfBounds.add(function(){
        GameEngine.ballLost();
    }, this);
    
    // On ajoute la balle à l'objet 'game', on l'affiche à l'écran
    game.add.existing(this);
};


// Extend de la classe Sprite pour pouvoir traiter de notre 'ball'
// Comme une sprite++
// En terme d'objet pur ce n'est pas correct mais avec la gestion des
// group de ce framework ça reste la solution la plus simple à mettre en place.

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;