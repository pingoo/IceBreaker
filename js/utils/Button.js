function Button(game, text, posX, posY, fnCallback, style) {
    this.screen = screen;
    this.text = text;
    this.posX = posX;
    this.posY = posY;

    var style = { font: "32px Arial", align: "center" };
    
    this.button = game.add.button(posX, posY, 'button', fnCallback, this, 1, 0);
    this.button.anchor.setTo(0.5, 0.5);
    
    this.text = game.add.text(posX, posY, text, style);
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.5;
    if(!isNaN(this.text.width) && !isNaN(this.text.fontSize) && !isNaN(this.button.width)) {
        while(this.text.width > this.button.width - 20) {
            this.text.fontSize--;
        }
    }
};
