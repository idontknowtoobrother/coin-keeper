let blockedHold = false;

function Player(game) {
  const width = 242;
  const height = 315.31;
  const cutWidth = 60.5;
  const cutHeight = 78.75;
  const speed = config.playerSpeed;
  var character = new Sprite(game, "player.png", width, height);
  character.loadAnimation(width, height, cutWidth, cutHeight);
  character.generateAnimationCycles();
  character.renameCycles(new Array("down", "right", "left", "up"));
  character.setAnimationSpeed(500);
  character.dashed = function(){
    if(this.dash)return
    this.dash = true
    const self = this
    let intervalCool = setInterval(()=>{
      self.dash = false
      clearInterval(intervalCool)
      return
    }, config.dashCooldown)

    let sc = 0
    let scaleUp = config.dashScale/10
    let intervalDash = setInterval(()=>{
      if(!self.lastDirection)return
      if(sc >= config.dashScale){
        clearInterval(intervalDash)
        return
      }
      sc+=scaleUp
      if(self.lastDirection == 'down'){
        self.changeYby(sc)
      }else if(self.lastDirection == 'up'){
        self.changeYby(-sc)
      }else if(self.lastDirection == 'right'){
        self.changeXby(sc)
      }else if(self.lastDirection == 'left'){
        self.changeXby(-sc)
      }
    }, 10)
  }
  character.setPosition(440, 380);
  character.setSpeed(0);
  character.pauseAnimation();
  character.setCurrentCycle("down");

  character.checkKeys = function () {
    if (keysDown[K_DOWN]) {
      blockedHold = true;
      this.setSpeed(speed);
      this.setCurrentCycle("down");
      this.playAnimation();
      this.setMoveAngle(180);
      this.lastDirection = 'down'
    } else if (keysDown[K_UP]) {
      blockedHold = true;
      this.setSpeed(speed);
      this.setCurrentCycle("up");
      this.playAnimation();
      this.setMoveAngle(0);
      this.lastDirection = 'up'
    } else if (keysDown[K_LEFT]) {
      this.setSpeed(speed);
      this.setCurrentCycle("left");
      this.playAnimation();
      this.setMoveAngle(270);
      this.lastDirection = 'left'
    } else if (keysDown[K_RIGHT]) {
      blockedHold = true;
      this.setSpeed(speed);
      this.setCurrentCycle("right");
      this.playAnimation();
      this.setMoveAngle(90);
      this.lastDirection = 'right'
    }else if(keysDown[K_SPACE]){
      this.setSpeed(0);
      this.pauseAnimation()
      this.setCurrentCycle("down");
      this.setMoveAngle(180);
      this.lastDirection = 'down'
    }else if(keysDown[K_SHIFT]){
      console.log('dash')
      this.dashed()
    }
  }; // end checkKeys

  return character;
} // end car def


const coinAnims = ["upAndDown", "upAndDown2", "upAndDown3"]
coins_component = (game) => {
  // Create new sprite
  var coins = new Sprite(game, "coin.png", 256, 210);
  coins.loadAnimation(256, 210, 51.2, 70);
  coins.generateAnimationCycles();

  coins.renameCycles(new Array(coinAnims[0], coinAnims[1], coinAnims[2]));
  coins.setCurrentCycle(coinAnims[Math.floor(Math.random() * coinAnims.length)]);
  coins.setAnimationSpeed(450);
  coins.setSpeed(0);

  coins.reset = function (player) {
    var newX = Math.random() * this.cWidth;
    var newY = Math.random() * this.cHeight;
    if (player) {
      while (closeToXY(player.x, player.y, newX, newY)) {
        newX = Math.random() * this.cWidth;
        newY = Math.random() * this.cHeight;
      }
    }

    this.setPosition(newX, newY);
  };

  coins.reset();

  return coins;
};

spawnCoins = (game, n) => {
  let delay = 100
  for (let i = 0; i < n; i++) {
    setTimeout(function(){
      const coin = coins_component(game);
      coins.push(coin);
      console.log(delay)
    }, delay)
    delay += 100
  }
};


// Initial Variables
let game;
let player;
let score;
let coins;
let time;
let timer;

// Initial Games
function init(start) {
  document.getElementById('end-game-congrats-anm').style.display = 'none'
  document.getElementById('end-game-defeat-anm').style.display = 'none'
  document.getElementById('restart-btn').style.display = 'none'

  game = new Scene();
  game.setBG('#4F3862', '../land.png')
  player = new Player(game);

  coins = [];
  spawnCoins(game, config.coinsMax)

  score = 0;

  timer = new Timer();
  
  if(start){
    game.start()
  } 
}

// Time tick for check a is time out
function timeTick() {
  time = timer.getElapsedTime(config.maxTime).toFixed(0);
  updateScore();
  if (time <= 0 && score < config.coinsGoal) {
    game.clear();
    game.stop();
    document.getElementById('end-game-defeat-anm').style.display = 'block'
    document.getElementById('restart-btn').style.display = 'block'
  }
}

// Tick for check that player take the 'coin'
function update() {
  game.clear();
  player.checkKeys();

  // check close to 'coins'
  for (const coin of coins) {
    if (closeToXY(player.x, player.y, coin.x, coin.y)) {
      score++;
      updateScore();
      coin.reset(player);
      if(score >= config.coinsGoal){
        game.clear();
        game.stop();
        document.getElementById('end-game-congrats-anm').style.display = 'block'
        document.getElementById('restart-btn').style.display = 'block'
      }
    }
  }

  player.update();
  timeTick();

  // update 'coins'
  for (const coin of coins) {
    coin.update();
  }
}

function closeToXY(x1, y1, x2, y2) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return distance <= 50;
}

// Update User Interface 'score'
function updateScore() {
 
  document.getElementById(
    "scoreBoard"
  ).innerHTML = `<img src="./coin_label.png" alt="coin"> ${score}/${config.coinsGoal} <img id="clock" src="./clock.png" alt="clock"> <span ${time <= 10 ? 'style="color:#FF4B4B;"' : ''}>${time < 0 ? 0 : time}</span>`;
}

function restart() {
  // document.location.href = "";
  init(true)
}

function startGame(){
  document.getElementById('start-btn').style.display = 'none'
  game.start();
}
