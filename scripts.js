let requestAnim = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function(callback) { window.setTimeout(callback, 1000 / 60); }

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

function Settings() {
  // this.fieldMarginTop = this.svgHeight * 0.2;
this.racketWidth = canvas.width * 0.023;
this.racketHeight = canvas.height * 0.25;
this.racketInitialPos1_Y = canvas.height * 0.07;
this.racketInitialPos2_Y = canvas.height * 0.68;
this.racketPlayer1_actualPosY = this.racketInitialPos1_Y;
this.racketPlayer2_actualPosY = this.racketInitialPos2_Y;
this.ballSize = ((canvas.width + canvas.height) / 2) * 0.025;
  this.racketSpeed = 8;
  this.startCountdown = 3;
  this.countdown = this.startCountdown;
  this.ballSpeed_X = randomBallDirection_X(7);
  this.ballSpeed_Y = randomBallDirection_Y(-4, 4);
  this.ballActualSpeed_X = this.ballSpeed_X;
  this.ballActualSpeed_Y = this.ballSpeed_Y;
  this.playerScoreCounter_1 = 0;
  this.playerScoreCounter_2 = 0;
  this.isCanBallMove = true;
  this.isCanRacketMove = true;
  this.isUpPressedPlayer_1 = false;
  this.isDownPressedPlayer_1 = false;
  this.isUpPressedPlayer_2 = false;
  this.isDownPressedPlayer_2 = false;
  this.isGameOver = false;
  this.isInitialStart = true;
  this.init = function() {
    // this.svgMarginTop = this.svg.getBoundingClientRect().top;
    // this.ball = document.getElementById('ball');
    // this.racket_1 = document.getElementById('racket_1');
    // this.racket_2 = document.getElementById('racket_2');
this.ballPositionStart_X = canvas.width / 2;
this.ballPositionStart_Y = canvas.height / 2;
    this.ballCurrentPosition = {
      currentPos_X: this.ballPositionStart_X,
      currentPos_Y: this.ballPositionStart_Y,
    };
  }
  this.updateBall = function() {
    this.ball.setAttributeNS(null, 'cx', this.ballCurrentPosition.currentPos_X);
    this.ball.setAttributeNS(null, 'cy', this.ballCurrentPosition.currentPos_Y);
  }
  this.update_1 = function() {
    this.racket_1.setAttributeNS(null, 'y', this.racketPlayer1_actualPosY);
  };
  this.update_2 = function() {
    this.racket_2.setAttributeNS(null, 'y', this.racketPlayer2_actualPosY);
  };
}

let settings = new Settings();
settings.init();

function blankCanvas() {
  ctx.clearRect(0, 0, settings.canvasWidth, canvas.height);
}


function drawPongCanvas() {
  if (canvas && canvas.getContext('2d')) {
    // Blank canvas
    blankCanvas();
    // Canvas center point
    let xpos = canvas.width / 2;
    let ypos = canvas.height / 2;
    // Create field
    ctx.beginPath();
    ctx.fillStyle = 'rgb(241, 210, 33)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Create ball
    ctx.save();
    ctx.beginPath();
    console.log(settings.ballPositionStart_X)
    ctx.arc(settings.ballPositionStart_X, settings.ballPositionStart_Y, settings.ballSize, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fill();
    ctx.restore();
    // Create racket_1
    ctx.beginPath();
    ctx.fillStyle = 'rgb(41, 173, 85)';
    ctx.fillRect(0, settings.racketPlayer1_actualPosY, settings.racketWidth, settings.racketHeight);
    // Create racket_1
    ctx.beginPath();
    ctx.fillStyle = 'rgb(25, 0, 255)';
    ctx.fillRect(canvas.width - settings.racketWidth, settings.racketPlayer2_actualPosY, settings.racketWidth, settings.racketHeight);  
      
  }
  // drawRequestAdaptiveCanvas = requestAnimationFrame(adaptiveResizeCanvas);
  // drawRequestCanvas = requestAnimationFrame(drawClockCanvas);
}
                    window.onload =  drawPongCanvas()















function randomBallDirection_X(ballSpeed_X) {
  const randomNumber = Math.round(Math.random() * ballSpeed_X);
  const direction_X = randomNumber % 2 === 0 ? -1 : 1;
  return ballSpeed_X * direction_X;
}
function randomBallDirection_Y(min, max) {
  const randomDirection_Y = Math.round(min - 0.5 + Math.random() * (max - min + 1))
  if (randomDirection_Y >= 1 || randomDirection_Y <= -1) {
    return randomDirection_Y;
  } else return randomBallDirection_X(3);
}

const curryHandler = function(duration, fn) {
  return () => startTimer(duration, fn);
}; 
const startBtnHandler = curryHandler(settings.startCountdown, startGame);
document.querySelector('.start-btn').addEventListener('click', startBtnHandler);

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const countdownSound = new Audio('http://www.pachd.com/a/button/button18.wav');
const startGameSound = new Audio('http://www.superluigibros.com/downloads/sounds/SNES/SMRPG/wav/smrpg_battle_punch.wav');
const wallHitSound = new Audio('http://web.mit.edu/sahughes/www/Sounds/m=100.mp3');
const racketHitSound = new Audio('http://www.healthfreedomusa.org/downloads/iMovie.app/Contents/Resources/iMovie%20%2708%20Sound%20Effects/Golf%20Hit%201.mp3');
const missSound = new Audio('http://www.sfu.ca/~johannac/IAT202%20Exercise3/hit.wav');
const fanfareSound = new Audio('http://www.ringophone.com/mp3poly/15959.mp3');

// function gameSoundInit(...args) {
//   for (let arg of args) {
//     arg.play();
//     arg.pause();
//   }
// }

function gameSound(item) {
  item.currentTime = 0;
  item.play();
}

function startGame() {
  settings.playerScoreCounter_1 = 0;
  settings.playerScoreCounter_2 = 0;
  settings.isCanRacketMove = true;
  moveBall(); // window.requestAnimationFrame(moveBall);
}


function restart() {
  settings.isCanBallMove = !settings.isCanBallMove;
  settings.isCanRacketMove = !settings.isCanRacketMove;
  settings.ballCurrentPosition.currentPos_X = settings.ballPositionStart_X;
  settings.ballCurrentPosition.currentPos_Y = settings.ballPositionStart_Y;
  moveBall();
}

function refreshGameplay() {
  document.getElementById('start_btn').addEventListener('click', startBtnHandler);
  document.getElementById('score_1').textContent = 0;
  document.getElementById('score_2').textContent = 0;
  document.getElementById('countdown').textContent = 'Press Start! button';
  settings.isGameOver = !settings.isGameOver;
  settings.isCanBallMove = true;
  settings.ballCurrentPosition.currentPos_X = settings.ballPositionStart_X;
  settings.ballCurrentPosition.currentPos_Y = settings.ballPositionStart_Y;
}

function keyDownHandler(e) {
  if (e.repeat == false && settings.isCanRacketMove) {
    if (e.code === 'ShiftLeft') {settings.isUpPressedPlayer_1 = true; moveLeftRacket();} 
    if (e.code === 'ControlLeft') {settings.isDownPressedPlayer_1 = true; moveLeftRacket();}
    if (e.code === 'ArrowUp') {settings.isUpPressedPlayer_2 = true; moveRightRacket();}
    if (e.code === 'ArrowDown') {settings.isDownPressedPlayer_2 = true; moveRightRacket();}
  }
}

function keyUpHandler(e) {
  switch(e.code) {
    case 'ShiftLeft': settings.isUpPressedPlayer_1 = false;
      break;
    case 'ArrowUp': settings.isUpPressedPlayer_2 = false;
      break;
    case 'ControlLeft': settings.isDownPressedPlayer_1 = false;
      break;
    case 'ArrowDown': settings.isDownPressedPlayer_2 = false;
      break;
    default: false;
  }
}


document.getElementById('pong').addEventListener('click', function(e) {
  console.log(e.clientX, e.clientY);
})