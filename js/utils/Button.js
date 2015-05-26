function Button(game, text, posX, posY, scale, buttonSheet, fnCallback, style) {
    this.screen = screen;
    this.text = text;
    this.posX = posX;
    this.posY = posY;

    var style = { font: "32px Arial", align: "center" };
    
    var hasText = text != null && text.length > 0;
    if (hasText) {
        this.button = game.add.button(posX, posY, buttonSheet, fnCallback, this, 1, 0);
    } else {
        this.button = game.add.button(posX, posY, buttonSheet, fnCallback, this);
    }
    this.button.parentButton = this;
    this.button.anchor.setTo(0.5, 0.5);
    this.button.scale.setTo(scale, scale);
    
    if (hasText) {
        this.text = game.add.text(posX, posY, text, style);
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        if(!isNaN(this.text.width) && !isNaN(this.text.fontSize) && !isNaN(this.button.width)) {
            while(this.text.width > this.button.width - 20) {
                this.text.fontSize--;
            }
        }
    }
};

Button.prototype.setVisible = function(visibility) {
    this.button.visible = visibility;
    if (this.text) {
        this.text.visible = visibility;
    }
};

Button.prototype.setTint = function(tint) {
    this.button.tint = tint;
};

Button.prototype.destroy = function() {
    this.button.destroy();
    if (this.text) {
        this.text.destroy();
    }
};