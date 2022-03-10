
function Car(game, missile){
    var car = new Sprite(game, "car.png", 50, 30);
    car.setSpeed(5);
    car.setAngle(135);
    
    car.checkKeys = function(){
        if (keysDown[K_LEFT]){
            this.turnBy(-5);
        }
        if (keysDown[K_RIGHT]){
            this.turnBy(5);
        }
        if (keysDown[K_SPACE]){
            missile.fire();
        }
    } // end checkKeys
    
    return car;
} // end car def

function Missile(game){
    var missile = new Sprite(game, "missile.png", 30, 20);
    missile.hide();
    
    missile.fire = function(){
        this.show();
        this.setSpeed(15);
        this.setBoundAction(DIE);
        this.setPosition(car.x, car.y);
        this.setAngle(car.getImgAngle());
        this.setSpeed(15);
    }
    
    return missile;
}
    

checkCollision = (missile, car, coin) => {
    var hit = false
    var isMissile = false
    if(missile.collidesWith(coin)){
        hit = false
        isMissile = true
    }else if(car.collidesWith(coin)){
        hit = true
    }

    if (hit) {
        coin.reset()
        if (isMissile){
            missile.hide()
        }
        return true
    }
    
    return false
}

coins_component = (game) => {

    // Create new sprite
    var coins = new Sprite(game, "coins.gif", 30, 30)

    coins.setSpeed(5)
    coins.walk = function(){
        var newDirection = (Math.random()*90)-45
        this.changeAngleBy(newDirection)
    }

    coins.reset = function(){
        var newX = Math.random()*this.cWidth
        var newY = Math.random()*this.cHeight
        this.setPosition(newX, newY)
    }

    coins.reset()

    return coins

}


spawnCoins = (game, n) => {
    var arrsComp = []
    for(let i = 0; i < n; i++){
        var coin = coins_component(game)
        arrsComp.push(coin)
    }
    return arrsComp
}