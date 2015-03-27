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
    
    paddle : null,
    ball : null,
    balls : null,
    bricks : null,
    
    scoreText : null,
    fpsText : null,
    livesText : null,
    introText : null
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
        ball.body.velocity.y = -300;
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


// Methode d'update principale
GameEngine.update = function(posX, game) { // Déclaration d'une fonction de mouvement du paddle
    var ball = GameEngine.ball;
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
    }

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