// GameEngine est une 'classe' statique et 'context' du jeu

// Pas de constructeur, attribution des champs statiques
GameEngine = {
    game : null,
    
    currentLevel : 0,
    lives : 3,
    score : 0,
    ballOnPaddle : true,
    paused : false,
    mouseOffScreen : false,
    
    brickScore : 20,
    initialVelocityY : -300,
    boundX : 600,
    
    
    paddle : null,
    ball : null,
    balls : null,
    bricks : null,
    tweenBallRotation : null,
    
    scoreText : null,
    fpsText : null,
    livesText : null,
    introText : null,
    debugText : null
};

GameEngine.reset = function () {
    this.currentLevel = 0;
    this.lives = 3;
    this.score = 0;
    this.ballOnPaddle = true;
    this.paused = false;
    this.mouseOffScreen = false;
};

GameEngine.calcPaddlePosition = function (paddleX, mouseX) {
    var result = mouseX;
    if (mouseX > paddleX) {
        result = paddleX + Math.sqrt(mouseX - paddleX);
    } else if (mouseX < paddleX) {
        result = paddleX - Math.sqrt(paddleX - mouseX);
    }
    return result;
};


GameEngine.GameOver = function () {

    GameEngine.ball.body.velocity.setTo(0, 0);
    
    GameEngine.introText.text = Texts.gameOver;
    GameEngine.introText.visible = true;
    
    var timerDead = GameEngine.game.time.create(true);
    timerDead.add(2000, function() {
        game.state.start("default"); //Défault est le nom donné par défault au game state lorsque l'on passe par la fonction create (dans MenuScreen)
    }, this);
    timerDead.start();

};

GameEngine.addScore = function (scoreValue) {
    GameEngine.score += scoreValue;
    GameEngine.scoreText.text = Texts.score + GameEngine.score;
};

GameEngine.allKilled = function () {
    //  New level starts
    GameEngine.addScore(1000);
    GameEngine.score += 1000;
    GameEngine.scoreText.text = Texts.score + GameEngine.score;
    GameEngine.introText.text = Texts.nextLevel;

    //  Let's move the ball back to the paddle
    GameEngine.ballOnPaddle = true;
    this.ball.body.velocity.set(0);
    this.ball.x = GameEngine.paddle.x + 16;
    this.ball.y = GameEngine.paddle.y - 16;
    this.ball.animations.stop();

    //  And bring the bricks back from the dead :)
    this.bricks.callAll('revive');
};


GameEngine.releaseBall = function (ball) {
    console.log("GameEngine.paddle="+GameEngine.ballOnPaddle);
    if (GameEngine.ballOnPaddle)
    {
        GameEngine.ballOnPaddle = false;
        ball.body.velocity.y = GameEngine.initialVelocityY;
        ball.body.velocity.x = -75;
        GameEngine.introText.visible = false;
    }
};


GameEngine.ballLost = function () {

    GameEngine.lives--;
    GameEngine.livesText.text = Texts.lives + GameEngine.lives;

    if (GameEngine.lives === 0) {
        GameEngine.GameOver();
    } else {
        GameEngine.ballOnPaddle = true;
        GameEngine.ball.reset(GameEngine.paddle.body.x + 16, GameEngine.paddle.y - 16);
        
    }
};


GameEngine.ballHitBrick = function (ballSprite, brickSprite) {
    console.log("brickSprite.life="+brickSprite.life);
    brickSprite.damage(ballSprite.damageValue);
};


GameEngine.ballHitPaddle = function (ballSprite, paddleSprite) {
    console.log("called ballHitPaddle");
    var diff = 0;

    if (ballSprite.x < paddleSprite.x) {
        //  La balle tape sur le côté gauche du paddle
        diff = paddleSprite.x - ballSprite.x;
        ballSprite.body.velocity.x = (-5 * diff);
    } else if (ballSprite.x > paddleSprite.x) {
        //  La balle tape sur le côté droit du paddle
        diff = ballSprite.x -paddleSprite.x;
        ballSprite.body.velocity.x = (5 * diff);
    } else {
        //  La balle tape au centre
        //  Ajout d'une velocité minimum pour éviter de la coincer
        ballSprite.body.velocity.x = 2 + Math.random() * 8;
    }
};

GameEngine.ballOverlapPaddle = function (ballSprite, paddleSprite) {
    // On change la vélocité y de la balle pour qu'elle reparte vers le haut
    ballSprite.body.velocity.y = GameEngine.initialVelocityY;
};


// Methode d'update principale
GameEngine.update = function(posX, game) { // Déclaration d'une fonction de mouvement du paddle
    var ball = GameEngine.ball;
    if(posX > GameEngine.boundX - GameEngine.paddle.width / 2){
        posX = GameEngine.boundX - GameEngine.paddle.width / 2;
    }
    GameEngine.paddle.angle = GameEngine.calcPaddleAngle(posX, GameEngine.paddle);
    GameEngine.paddle.x = posX;
    //GameEngine.paddle.x = GameEngine.calcPaddlePosition(GameEngine.paddle.x, posX); // decommenter et commenter la ligne du dessus pour mettre un retard dans le mouvement du paddle

    if (GameEngine.paddle.x < 24) {
        GameEngine.paddle.x = 24;
    } else if (GameEngine.paddle.x > game.width - 24) {
        GameEngine.paddle.x = game.width - 24;
    }

    if (GameEngine.ballOnPaddle) {
        ball.body.x = GameEngine.paddle.x - 8;
    } else {
        game.physics.arcade.collide(ball, GameEngine.paddle, GameEngine.ballHitPaddle, null, this);
        
        game.physics.arcade.collide(ball, GameEngine.bricks, GameEngine.ballHitBrick, null, this);
        
        game.physics.arcade.overlap(ball, GameEngine.paddle, GameEngine.ballOverlapPaddle, null, this)
    }

};

GameEngine.calcBallAngleTest = function (ballSprite) {
    // Valeurs des angles exprimées en radiants ici.
    
    var angle = Tools.calcAngle(ballSprite.body.velocity.x, ballSprite.body.velocity.y);
    
    //var angle = ballSprite.angle; // Valeur in engine, marche parfaitement.
    
    // Si la precedente valeur de angle est egale à la valeur de ballSprite.rotation * -1
    // alors faire la rotation dans l'autre sens, c'est à dire forcer angle à valoir angle - 2 * Math.PI
    
    if (ballSprite.lastAngle == ballSprite.rotation * -1) {
        angle = angle - 2 * Math.PI;
        ballSprite.lastAngle = ballSprite.lastAngle - 2 * Math.PI;
    }
    
    GameEngine.debugText.y = ballSprite.y;
    GameEngine.debugText.x = ballSprite.x+10;
    GameEngine.debugText.text = ballSprite.rotation;
    console.log("bs="+ballSprite.rotation);
    
    ballSprite.lastAngle = angle;
    
    if(ballSprite.rotation - 0.1 > angle) {
        ballSprite.rotation -= 0.1;
    } else if(ballSprite.rotation + 0.1 < angle) {
        ballSprite.rotation += 0.1;
    }
    
    // tween fonctionne parfaitement
    // GameEngine.tweenBallRotation = game.add.tween(ballSprite).to({rotation : angle}, 120, Phaser.Easing.Bounce.Out, true);

};

GameEngine.calcBallAngle = function (ballSprite) {
    // Valeurs des angles exprimées en radiants ici.
    var angle = ballSprite.body.angle; // Valeur in engine, marche parfaitement.
    GameEngine.tweenBallRotation = game.add.tween(ballSprite).to({rotation : angle}, 90, Phaser.Easing.Bounce.Out, true);

};

GameEngine.calcPaddleAngle = function (posX, paddle) {

    var distance = posX - paddle.x;
    var angle = paddle.angle;
    
    angle = distance * 3 / 2;
    if(angle > 8) {
        angle = 8;
    }
    if(angle < -8) {
        angle = -8;
    }
    return angle;
};

// Calculer la rotation de la balle
GameEngine.calcBallAngleTest2 = function (ballSprite) {
    if (ballSprite.body.prevVelocity == null) {
        // Initialise dans le body de la balle l'objet contenant la vélocité précédente
        ballSprite.body.prevVelocity = {
            x : 0,
            y : 0
        };
    } else {
        // Calculer la coordonnée Z du produit vectoriel entre les vélocités courante et précédente
        var dotProductZ = (ballSprite.body.velocity.x * ballSprite.body.prevVelocity.y) - (ballSprite.body.prevVelocity.x * ballSprite.body.velocity.y);
        if (Math.abs(dotProductZ) >= 0.1) {
            // Si la vélocité a considérablement changé, récupérer son signe
            ballSprite.body.signDotProductZ = GameEngine.sign(dotProductZ);
        }
        // Pour le tour suivant, remplir la vélocité précédente
        ballSprite.body.prevVelocity.x = ballSprite.body.velocity.x;
        ballSprite.body.prevVelocity.y = ballSprite.body.velocity.y;
    }
    
    // Les angles sont exprimés en radian
    var angleTarget = ballSprite.body.angle; // Angle cible du body
    var angleCurrent = ballSprite.rotation; // Angle affiché par le sprite
    var diffAngle = GameEngine.modAngle(angleCurrent - angleTarget); // Différence normalisée entre ces deux angles
    
    var vitesseAngulaire = 0.2; // Constante en radian/frame
    if (Math.abs(diffAngle) < vitesseAngulaire) {
        // Si les deux angles sont très proches, on a fini la rotation
        ballSprite.rotation = angleTarget;
        ballSprite.body.dotProductZ = null;
    } else {
        // Sinon prendre le signe du de la coordonnée Z si elle existe, ou bien le signe de la différence d'angle
        var signDiffAngle = ballSprite.body.signDotProductZ == null ? -GameEngine.sign(diffAngle) : ballSprite.body.signDotProductZ;
        // et l'appliquer en rotation au sprite
        ballSprite.rotation += signDiffAngle * vitesseAngulaire;
    }
};

// Calculer le signe d'un nombre : -1, 0, 1, NaN
GameEngine.sign = function (x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
};

// Normalise un angle en radian entre -PI et PI
GameEngine.modAngle = function (rad) {
    return rad < -Math.PI ? rad + (2 * Math.PI) :
        (rad > Math.PI ? rad - (2 * Math.PI) : rad);
};
