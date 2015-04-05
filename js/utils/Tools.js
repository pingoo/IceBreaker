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

// Normalise un angle en radian entre -PI et PI
Tools.modAngle = function (rad) {
    return rad < -Math.PI ? rad + (2 * Math.PI) :
        (rad > Math.PI ? rad - (2 * Math.PI) : rad);
};
