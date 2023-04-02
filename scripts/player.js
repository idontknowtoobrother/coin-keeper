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
    } else if (keysDown[K_UP]) {
      blockedHold = true;
      this.setSpeed(speed);
      this.setCurrentCycle("up");
      this.playAnimation();
      this.setMoveAngle(0);
    } else if (keysDown[K_LEFT]) {
      this.setSpeed(speed);
      this.setCurrentCycle("left");
      this.playAnimation();
      this.setMoveAngle(270);
    } else if (keysDown[K_RIGHT]) {
      blockedHold = true;
      this.setSpeed(speed);
      this.setCurrentCycle("right");
      this.playAnimation();
      this.setMoveAngle(90);
    }else if(keysDown[K_SPACE]){
      this.setSpeed(0);
      this.pauseAnimation()
        this.setCurrentCycle("down");
      this.setMoveAngle(180);
    }else if(keysDown[K_SHIFT]){
        console.log('dash')
    }
  }; // end checkKeys

  return character;
} // end car def


coins_component = (game) => {
  // Create new sprite
  var coins = new Sprite(game, "coin.png", 60, 60);

  coins.setSpeed(4);

  coins.walk = function () {
    this.setSpeed(config.coinSpeed);
    var newDirection = Math.random() * 90 - 45;
    this.changeAngleBy(newDirection);
  };

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
  var arrsComp = [];
  for (let i = 0; i < n; i++) {
    const coin = coins_component(game);
    arrsComp.push(coin);
  }
  return arrsComp;
};


// Initial Variables
let game;
let player;
let score;
let coins;
let time;
let timer;

// Initial Games
function init() {
  game = new Scene();

  player = new Player(game);

  coins = spawnCoins(game, config.coinsMax);
  score = 0;

  timer = new Timer();
  game.start();
}

// Time tick for check a is time out
function timeTick() {
  time = timer.getElapsedTime(config.maxTime).toFixed(0);
  if (time <= 0) {
    game.clear();
    game.stop();
  }
  updateScore();
}

// Tick for check that player take the 'coin'
function update() {
  game.clear();
  player.checkKeys();

  // check close to 'coins'
  for (const coin of coins) {
    coin.walk();
    if (closeToXY(player.x, player.y, coin.x, coin.y)) {
      score++;
      updateScore();
      coin.reset(player);
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
  ).innerHTML = `COINS: ${score}/${config.coinsGoal} | TIME: ${time}`;
}

function restart() {
  document.location.href = "";
}