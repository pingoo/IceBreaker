// GameEngine est une 'classe' statique et 'context' du jeu

// Pas de constructeur, attribution des champs statiques
GameEngine = {
    game : new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example'),
    
    currentLevel : 0,
    lives : Constants.startingLifes,
    score : 0,
    ballOnPaddle : true,
    paused : false,
    mouseOffScreen : false,
};

GameEngine.reset = function () {
    this.currentLevel = 0;
    this.lives = Constants.startingLifes;
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

    GameScreenContext.ball.body.velocity.setTo(0, 0);
    
    GameScreenContext.introText.text = Texts.gameOver;
    GameScreenContext.introText.visible = true;
    
    var timerDead = GameEngine.game.time.create(true);
    timerDead.add(2000, function() {
        game.state.start("menuState");
    }, this);
    timerDead.start();

};

GameEngine.addScore = function (scoreValue) {
    GameEngine.score += scoreValue;
    GameScreenContext.scoreText.text = Texts.score + GameEngine.score;
};

GameEngine.allKilled = function () {
    //  New level starts
    GameEngine.addScore(1000);
    GameEngine.score += 1000;
    GameScreenContext.scoreText.text = Texts.score + GameEngine.score;
    GameScreenContext.introText.text = Texts.nextLevel;

    //  Let's move the ball back to the paddle
    GameEngine.ballOnPaddle = true;
    GameScreenContext.ball.body.velocity.set(0);
    GameScreenContext.ball.x = GameScreenContext.paddle.x + 16;
    GameScreenContext.ball.y = GameScreenContext.paddle.y - 16;
    GameScreenContext.ball.animations.stop();

    //  And bring the bricks back from the dead :)
    GameScreenContext.bricks.callAll('revive');
};

GameEngine.releaseBall = function (ball) {
    //console.log("GameEngine.paddle="+GameEngine.ballOnPaddle);
    if (GameEngine.ballOnPaddle)
    {
        GameEngine.ballOnPaddle = false;
        ball.body.velocity.y = Constants.ballInitialVelocityY;
        ball.body.velocity.x = -75;
        GameScreenContext.introText.visible = false;
    }
};

GameEngine.ballLost = function () {

    GameEngine.lives--;
    GameScreenContext.livesText.text = Texts.lives + GameEngine.lives;

    if (GameEngine.lives === 0) {
        GameEngine.GameOver();
    } else {
        GameEngine.ballOnPaddle = true;
        GameScreenContext.ball.reset(GameScreenContext.paddle.body.x + 16, GameScreenContext.paddle.y - 16);
        
    }
};

GameEngine.ballHitBrick = function (ballSprite, brickSprite) {
    //console.log("brickSprite.life="+brickSprite.life);
    brickSprite.damage(ballSprite.damageValue);
    GameEngine.showImpact(ballSprite);
};

GameEngine.ballHitPaddle = function (ballSprite, paddleSprite) {
    //console.log("called ballHitPaddle");
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
    GameEngine.showImpact(ballSprite);
};

GameEngine.ballOverlapPaddle = function (ballSprite, paddleSprite) {
    // On change la vélocité Y de la balle pour qu'elle reparte vers le haut
    ballSprite.body.velocity.y = Constants.ballInitialVelocityY;
    GameEngine.showImpact(ballSprite);
};

GameEngine.showImpact = function(sprite) {
    var touchingDirection = sprite.body.touching;
    console.log(touchingDirection);
    if(touchingDirection.up) {
        GameScreenContext.impact.x = sprite.x - sprite.width / 2;
        GameScreenContext.impact.y = sprite.y - 20;
    }
    if(touchingDirection.down) {
        GameScreenContext.impact.x = sprite.x - sprite.width / 2;
        GameScreenContext.impact.y = sprite.y + 10;
    }
    if(touchingDirection.left) {
        GameScreenContext.impact.x = sprite.x;
        GameScreenContext.impact.y = sprite.y;
    }
    if(touchingDirection.right) {
        GameScreenContext.impact.x = sprite.x + 10;
        GameScreenContext.impact.y = sprite.y;
    }
    GameScreenContext.impact.visible = true;
    var timer = GameEngine.game.time.create(true);
    timer.add(110, function() {
        GameScreenContext.impact.visible = false;
    }, this);
    timer.start();
};


// Methode d'update principale
GameEngine.update = function(posX, game) { // Déclaration d'une fonction de mouvement du paddle
    var ball = GameScreenContext.ball;
    
    // TODO : pourquoi 2 checks sur les limites horizontales du paddle ?
    var halfWidthPaddle = GameScreenContext.paddle.width / 2;
    posX = Phaser.Math.clamp(posX, halfWidthPaddle, Constants.boundX - halfWidthPaddle);
    GameScreenContext.paddle.angle = GameEngine.calcPaddleAngle(posX, GameScreenContext.paddle);
    GameScreenContext.paddle.x = posX;
    //GameScreenContext.paddle.x = GameEngine.calcPaddlePosition(GameScreenContext.paddle.x, posX);
    // decommenter et commenter la ligne du dessus pour mettre un retard dans le mouvement du paddle

    GameScreenContext.paddle.x = Phaser.Math.clamp(GameScreenContext.paddle.x, 24, game.width - 24);

    if (GameEngine.ballOnPaddle) {
        ball.body.x = GameScreenContext.paddle.x - 8;
    } else {
        game.physics.arcade.collide(ball, GameScreenContext.paddle, GameEngine.ballHitPaddle, null, this);
        
        game.physics.arcade.collide(ball, GameScreenContext.bricks, GameEngine.ballHitBrick, null, this);
        
        game.physics.arcade.overlap(ball, GameScreenContext.paddle, GameEngine.ballOverlapPaddle, null, this);
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
    
    GameScreenContext.debugText.y = ballSprite.y;
    GameScreenContext.debugText.x = ballSprite.x+10;
    GameScreenContext.debugText.text = ballSprite.rotation;
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
        ballSprite.body.prevVelocity = { x : 0, y : 0 };
    } else {
        // Calculer la coordonnée Z du produit vectoriel entre les vélocités courante et précédente
        var dotProductZ = (ballSprite.body.velocity.x * ballSprite.body.prevVelocity.y) - (ballSprite.body.prevVelocity.x * ballSprite.body.velocity.y);
        if (Math.abs(dotProductZ) >= 0.1) {
            // Si la vélocité a considérablement changé, récupérer son signe
            ballSprite.body.signDotProductZ = Tools.sign(dotProductZ);
        }
        // Pour le tour suivant, remplir la vélocité précédente
        ballSprite.body.prevVelocity.x = ballSprite.body.velocity.x;
        ballSprite.body.prevVelocity.y = ballSprite.body.velocity.y;
    }
    
    // Les angles sont exprimés en radian
    var angleTarget = ballSprite.body.angle; // Angle cible du body
    var angleCurrent = ballSprite.rotation; // Angle affiché par le sprite
    var diffAngle = Phaser.Math.wrapAngle(angleCurrent - angleTarget, true); // Différence normalisée [-PI, PI] entre ces deux angles
    
    if (Math.abs(diffAngle) < Constants.ballAngularSpeed) {
        // Si les deux angles sont très proches, on a fini la rotation
        ballSprite.rotation = angleTarget;
        ballSprite.body.signDotProductZ = null;
    } else {
        // Sinon prendre le signe du de la coordonnée Z si elle existe, ou bien le signe de la différence d'angle
        var signDiffAngle = ballSprite.body.signDotProductZ == null ? -Tools.sign(diffAngle) : ballSprite.body.signDotProductZ;
        // et l'appliquer en rotation au sprite
        ballSprite.rotation += signDiffAngle * Constants.ballAngularSpeed;
    }
};

GameEngine.howManyBricksLeft = function() {
    return GameScreenContext.bricks.countLiving();
};