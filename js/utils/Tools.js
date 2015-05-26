Tools = {};

// Calculer l'angle pour un vecteur
Tools.calcAngle = function (velocityX, velocityY) {
    var angle = Math.atan2(velocityY, velocityX);
    //console.log(angle);
    return angle;
};

// Calculer le signe d'un nombre : -1, 0, 1, NaN
Tools.sign = function (x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
};

Array.prototype.last = function() {
    return this[this.length-1];
}