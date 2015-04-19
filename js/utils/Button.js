function Button(game, text, posX, posY, scale, buttonSheet, fnCallback, style) {
    this.screen = screen;
    this.textMsg = text;
    this.posX = posX;
    this.posY = posY;
    this.initialScale = scale;

    var style = { font: "32px Arial", align: "center" };
    
    this.button = game.add.button(posX, posY, buttonSheet, fnCallback, this, 1, 0);
    this.button.anchor.setTo(0.5, 0.5);
    this.text = game.add.text(posX, posY, this.textMsg, style);
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.5;
    this.button.scale.setTo(scale, scale);
    if (!isNaN(this.text.width) && !isNaN(this.text.fontSize) && !isNaN(this.button.width)) {
        while(this.text.width > this.button.width - 20) {
            this.text.fontSize--;
        }
    }
    this.unscalledWith = this.button.width;
}

Button.prototype.setVisible = function(visibility) {
    this.button.visible = visibility;
    this.text.visible = visibility;
};

Button.prototype.setTint = function(tint) {
    this.button.tint = tint;
};

Button.prototype.destroy = function() {
    this.button.destroy();
    this.text.destroy();
};

Button.prototype.setPosition = function(posX, posY) {
    this.text.x = posX;
    this.text.y = posY;
    this.button.x = posX;
    this.button.y = posY;
};

Button.prototype.addZoomEffect = function(game) {
    this.button.events.onInputOver.add(function() {
        this.button.bringToTop();
        game.world.bringToTop(this.text);
        var zoomInButton = game.add.tween(this.button.scale);
        zoomInButton.to({x : 0.75, y : 0.75}, 500, Phaser.Easing.Back.Out, true, 10);
        var zoomInText = game.add.tween(this.text.scale);
        zoomInText.to({x : 1.5, y : 1.5}, 500, Phaser.Easing.Back.Out, true, 10);
    }, this);
    
    this.button.events.onInputOut.add(function() {
        var zoomInButton = game.add.tween(this.button.scale);
        zoomInButton.to({x : this.initialScale, y : this.initialScale}, 500, Phaser.Easing.Back.Out, true, 10);
        var zoomInText = game.add.tween(this.text.scale);
        zoomInText.to({x : 1, y : 1}, 500, Phaser.Easing.Back.Out, true, 10);
    }, this);
}

