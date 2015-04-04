Tools = {

};

Tools.calcAngle = function (velocityX, velocityY) {
    var angle = Math.atan2(velocityY, velocityX);
    console.log(angle);
    return angle;
};