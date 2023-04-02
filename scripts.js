let requestAnim = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function(callback) { window.setTimeout(callback, 1000 / 60); }
let requestAnimDrawPongCanvas = null;
let requestAnimMoveBall = null;
let requestMoveLeftRacket = null;
let requestMoveRightRacket = null;
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const canvasScores = document.getElementById('scores');
const ctxScores = canvasScores.getContext('2d');
const countdownSound = new Audio('http://www.pachd.com/a/button/button18.wav');
const startGameSound = new Audio('http://www.superluigibros.com/downloads/sounds/SNES/SMRPG/wav/smrpg_battle_punch.wav');
const wallHitSound = new Audio('http://web.mit.edu/sahughes/www/Sounds/m=100.mp3');
const racketHitSound = new Audio('http://www.healthfreedomusa.org/downloads/iMovie.app/Contents/Resources/iMovie%20%2708%20Sound%20Effects/Golf%20Hit%201.mp3');
const missSound = new Audio('http://www.sfu.ca/~johannac/IAT202%20Exercise3/hit.wav');
const fanfareSound = new Audio('http://www.ringophone.com/mp3poly/15959.mp3');
const greetingText = 'Turn off the sound on the computer if it might interfere with you now.'

function Settings() {
  this.racketWidth = Math.floor(canvas.width * 0.023);
  this.racketHeight = Math.floor(canvas.height * 0.25);
  this.racketInitialPos1_Y = Math.floor(canvas.height * 0.07);
  this.racketInitialPos2_Y = Math.floor(canvas.height * 0.68);
  this.racketPlayer1_actualPosY = this.racketInitialPos1_Y;
  this.racketPlayer2_actualPosY = this.racketInitialPos2_Y;
  this.ballSize = Math.floor(((canvas.width + canvas.height) / 2) * 0.025);
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
    this.ballPositionStart_X = canvas.width / 2;
    this.ballPositionStart_Y = canvas.height / 2;
    this.ballCurrentPosition = {
      currentPos_X: this.ballPositionStart_X,
      currentPos_Y: this.ballPositionStart_Y,
    };
  }
  this.updateBall = function() {
    this.ballCurrentPosition.currentPos_X;
    this.ballCurrentPosition.currentPos_Y;
  }
}

let settings = new Settings();
settings.init();

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

function blankCanvas(context) {
  if (context === 'ctx') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else if (context === 'ctxScores') {
    ctxScores.clearRect(0, 0, canvasScores.width, canvasScores.height);
  }
}

function drawPongCanvas() {
  if (canvasScores && canvasScores.getContext('2d')) {
    // Blank canvas
    blankCanvas('ctx');
    // Create field
    ctx.beginPath();
    ctx.fillStyle = 'rgb(241, 210, 33)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Create ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(settings.ballCurrentPosition.currentPos_X, settings.ballCurrentPosition.currentPos_Y, settings.ballSize, 0, 2 * Math.PI);
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
  requestAnimDrawPongCanvas = requestAnimationFrame(drawPongCanvas);
}
window.onload = drawPongCanvas()

function drawPongScores(score_1, score_2, text = '') {
  if (canvasScores && canvasScores.getContext('2d')) {
    if (text) {
      // Blank score canvas
      blankCanvas('ctxScores');
      // Create countdown
      ctxScores.save();
      ctxScores.beginPath();
      ctxScores.fillStyle = 'rgb(255, 255, 255)';
      ctxScores.font='28px Orbitron';
      ctxScores.textAlign = 'center';
      ctxScores.fillText(text, canvasScores.width / 2, canvasScores.height / 2 - 1);
      ctxScores.restore();
      return;
    } 
    // Blank score canvas
    blankCanvas('ctxScores');
    // Create players 1 score
    ctxScores.beginPath();
    ctxScores.fillStyle = 'rgb(41, 173, 85)';
    ctxScores.font='28px Orbitron';
    ctxScores.textAlign = 'center';
    ctxScores.fillText(score_1, canvasScores.width / 2 - 33, canvasScores.height / 2);
    // Create colon
    ctxScores.beginPath();
    ctxScores.fillStyle = 'rgb(255, 0, 0)';
    ctxScores.font='28px Orbitron';
    ctxScores.textAlign = 'center';
    ctxScores.fillText(':', canvasScores.width / 2, canvasScores.height / 2 - 1);
    // Create players 2 score
    ctxScores.beginPath();
    ctxScores.fillStyle = 'rgb(25, 0, 255)';
    ctxScores.font='28px Orbitron';
    ctxScores.textAlign = 'center';
    ctxScores.fillText(score_2, canvasScores.width / 2 + 33, canvasScores.height / 2);    
  }
}
window.onload = drawPongScores(settings.playerScoreCounter_1, settings.playerScoreCounter_2, greetingText);

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
  moveBall();
}

function startTimer(duration, fn) {
  // gameSoundInit(countdownSound, startGameSound, wallHitSound, racketHitSound, missSound, fanfareSound);
  document.querySelector('.start-btn').removeEventListener('click', startBtnHandler);
  if (!settings.isGameOver) {                           
    let timer = duration;
    const intervalStartCountdown = setInterval(function () {
      gameSound(countdownSound);
      drawPongScores(settings.playerScoreCounter_1, settings.playerScoreCounter_2, timer);
      if (--timer < 0) {
        clearInterval(intervalStartCountdown);
        drawPongScores(settings.playerScoreCounter_1, settings.playerScoreCounter_2, 'Start!');
        const timerStartCountdown = setTimeout(() => {
          gameSound(startGameSound);
          drawPongScores(settings.playerScoreCounter_1, settings.playerScoreCounter_2,'');
          fn();
          settings.isInitialStart = false;            
          clearTimeout(timerStartCountdown);
        }, 600)
      };
    }, 600);
  }
}

function showScore(player, score) {
  if (player === 'player1') {
    drawPongScores(score, settings.playerScoreCounter_2, text = '')
    if (score >= 5) {
      drawPongScores(score, settings.playerScoreCounter_2, text = 'Player 1 Wins!');
      settings.isGameOver = true;
      gameSound(fanfareSound);
      const newGameTimer = setTimeout(() => {
        refreshGameplay();
        clearTimeout(newGameTimer);
      }, 2000);
    }
  } else if (player === 'player2') {
    drawPongScores(settings.playerScoreCounter_1, score, text = '')
    if (score >= 5) {
      drawPongScores(score, settings.playerScoreCounter_2, text = 'Player 2 Wins!');
      settings.isGameOver = true;
      gameSound(fanfareSound);
      const newGameTimer = setTimeout(() => {
        refreshGameplay();
        clearTimeout(newGameTimer);
      }, 2000);
    }
  }
}

function restart() {
  cancelAnimationFrame(requestAnimMoveBall);
  settings.isCanBallMove = true;
  settings.isCanRacketMove = true;
  settings.ballCurrentPosition.currentPos_X = settings.ballPositionStart_X;
  settings.ballCurrentPosition.currentPos_Y = settings.ballPositionStart_Y;
  moveBall();
}

function refreshGameplay() {
  document.querySelector('.start-btn').addEventListener('click', startBtnHandler);
  settings.playerScoreCounter_1 = 0;
  settings.playerScoreCounter_2 = 0;
  drawPongScores(settings.playerScoreCounter_1, settings.playerScoreCounter_2);
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

function moveBall() {
  cancelAnimationFrame(requestAnimMoveBall);
  settings.updateBall();
  if (settings.isCanBallMove) {
    settings.ballCurrentPosition.currentPos_X += settings.ballActualSpeed_X;
    // Checking if the ball hits the right racket
    if ((settings.ballCurrentPosition.currentPos_X + settings.ballSize > canvas.width - settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y + Math.floor(settings.ballSize / 2) > settings.racketPlayer2_actualPosY)
        && (settings.ballCurrentPosition.currentPos_X + settings.ballSize > canvas.width - settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y - Math.floor(settings.ballSize / 2) < settings.racketPlayer2_actualPosY + settings.racketHeight)) {
        settings.ballCurrentPosition.currentPos_X = canvas.width - settings.ballSize - settings.racketWidth;
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        gameSound(racketHitSound);
    } else if (settings.ballCurrentPosition.currentPos_X + settings.ballSize + Math.abs(settings.ballActualSpeed_X) > canvas.width) { // Right racket misses
        gameSound(missSound);
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = canvas.width - settings.ballSize;
        settings.isCanBallMove = false;
        settings.isCanRacketMove = false;
        settings.playerScoreCounter_1++;
        cancelAnimationFrame(requestMoveLeftRacket);
        cancelAnimationFrame(requestMoveRightRacket);
        showScore('player1', settings.playerScoreCounter_1);
        startTimer(settings.startCountdown, restart);
      }  
    // Checking if the ball hits the left racket
    if ((settings.ballCurrentPosition.currentPos_X - settings.ballSize < settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y + Math.floor(settings.ballSize / 2) > settings.racketPlayer1_actualPosY)
        && (settings.ballCurrentPosition.currentPos_X - settings.ballSize + Math.abs(settings.ballActualSpeed_X) / 2 < settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y - Math.floor(settings.ballSize / 2) < settings.racketPlayer1_actualPosY + settings.racketHeight)) {
              settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = settings.racketWidth + settings.ballSize;
        gameSound(racketHitSound);
    } else if (settings.ballCurrentPosition.currentPos_X - settings.ballSize < 0) { // Left racket misses
        gameSound(missSound);
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = settings.ballSize;
        settings.isCanBallMove = false;
        settings.isCanRacketMove = false;
        settings.playerScoreCounter_2++;
        cancelAnimationFrame(requestMoveLeftRacket);
        cancelAnimationFrame(requestMoveRightRacket);
        showScore('player2', settings.playerScoreCounter_2);
        startTimer(settings.startCountdown, restart);
      }
    settings.ballCurrentPosition.currentPos_Y += settings.ballActualSpeed_Y;
    // Checking if the ball is inside the bottom bound
    if (settings.ballCurrentPosition.currentPos_Y + settings.ballSize > canvas.height) {
      settings.ballCurrentPosition.currentPos_Y = canvas.height - settings.ballSize;  
      settings.ballActualSpeed_Y = -settings.ballActualSpeed_Y;
      gameSound(wallHitSound);
    }
    // Checking if the ball is inside the top bound
    if (settings.ballCurrentPosition.currentPos_Y - settings.ballSize < 0) {
      settings.ballCurrentPosition.currentPos_Y = 0 + settings.ballSize;
      settings.ballActualSpeed_Y = -settings.ballActualSpeed_Y;
      gameSound(wallHitSound);
    }
    settings.updateBall();
    requestAnimMoveBall = requestAnim(moveBall);
  }
}

function moveLeftRacket() {
  if (settings.isUpPressedPlayer_1) {
      settings.racketPlayer1_actualPosY -= settings.racketSpeed;
      if (settings.racketPlayer1_actualPosY - settings.racketSpeed <= 0) {
        settings.racketPlayer1_actualPosY = 0;
      }
      requestMoveLeftRacket = requestAnim(moveLeftRacket);
  } else if (settings.isDownPressedPlayer_1) {
      settings.racketPlayer1_actualPosY += settings.racketSpeed;
      if (settings.racketPlayer1_actualPosY + settings.racketHeight >= canvas.height) {
        settings.racketPlayer1_actualPosY = canvas.height - settings.racketHeight;
      } 
      requestMoveLeftRacket = requestAnim(moveLeftRacket);
  }
}

function moveRightRacket() {
  if (settings.isUpPressedPlayer_2) {
    settings.racketPlayer2_actualPosY -= settings.racketSpeed;
      if (settings.racketPlayer2_actualPosY - settings.racketSpeed <= 0) {
        settings.racketPlayer2_actualPosY = 0;
      }
    requestMoveRightRacket = requestAnim(moveRightRacket);
  } else if (settings.isDownPressedPlayer_2) {
    settings.racketPlayer2_actualPosY += settings.racketSpeed;
    if (settings.racketPlayer2_actualPosY + settings.racketHeight >= canvas.height) {
      settings.racketPlayer2_actualPosY = canvas.height - settings.racketHeight;
    } 
    requestMoveRightRacket = requestAnim(moveRightRacket);
  }
}