// Constants
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const btn = document.querySelector(".btn");
const btnContainer = document.querySelector(".btn_container");
const circle = document.querySelector(".circle");

const sprite = new Image();
sprite.src = "src/img/Mobile - Flappy Bird - Version 12 Sprites.png";

const POINT = new Audio();
POINT.src = "src/audio/sfx_point.wav";

const WING = new Audio();
WING.src = "src/audio/sfx_wing.wav";

const HIT = new Audio();
HIT.src = "src/audio/sfx_hit.wav";

// Functions
let frames = 0;

let randomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let multipleTwo = function (num) {
  return num * 2;
};

canvas.addEventListener("click", (e) => {
  if (state.current === state.game) {
    let cltRect = canvas.getBoundingClientRect();
    let cltX = e.clientX - cltRect.left;
    let cltY = e.clientY - cltRect.top;

    if (pauseBtn.isPause === true) {
      bird.speed = 0;
    }

    if (
      cltX >= pauseBtn.x &&
      cltX <= pauseBtn.x + pauseBtn.width &&
      cltY >= pauseBtn.y &&
      cltY <= pauseBtn.y + pauseBtn.height &&
      pauseBtn.isPause === false
    ) {
      pauseBtn.isPause = true;
    } else if (
      (cltX >= pauseBtn.x &&
        cltX <= pauseBtn.x + pauseBtn.width &&
        cltY >= pauseBtn.y &&
        cltY <= pauseBtn.y + pauseBtn.height) ||
      pauseBtn.isPause === true
    ) {
      pauseBtn.isPause = false;
    }
  }
});

// Event Listener
canvas.addEventListener("click", (e) => {
  let cltRect = canvas.getBoundingClientRect();
  let cltX = e.clientX - cltRect.left;
  let cltY = e.clientY - cltRect.top;

  if (state.current === state.getReady && getReady.frame === 0) {
    getReady.frame = 1;
  } else if (state.current === state.getReady && getReady.frame === 1) {
    state.current = state.game;
  } else if (
    state.current === state.game &&
    !(
      cltX >= pauseBtn.x &&
      cltX <= pauseBtn.x + pauseBtn.width &&
      cltY >= pauseBtn.y &&
      cltY <= pauseBtn.y + pauseBtn.height
    )
  ) {
    bird.flap();
  } else if (state.current === state.gameOver) {
    let overBtn = gameOver.gameOverMsg[2];

    if (
      cltX >= overBtn.x &&
      cltX <= overBtn.x + overBtn.width &&
      cltY >= overBtn.y &&
      cltY <= overBtn.y + overBtn.height
    ) {
      state.current = state.getReady;
      getReady.frame = 0;

      bird.reset();
      pipes.reset();
      score.reset();
    }
  }
});

document.addEventListener("keydown", () => {
  bird.flap();
});

btnContainer.addEventListener("click", () => {
  circle.classList.toggle("active");
});

// Objects
// States
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  gameOver: 2,
};

// Background
const background = {
  sX: 0,
  sY: 0,
  sWidth: 144,
  sHeight: 256,

  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,

  draw() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.sWidth,
      this.sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },

  update() {
    if (circle.classList.contains("active")) {
      this.sX = 146;
      btn.style.background = "#fb9f49";
    } else {
      this.sX = 0;
      btn.style.background = "#57d857";
    }
  },
};

// Pipes
const pipes = {
  top: {
    sX: 56,
    sY: 323,
  },

  bottom: {
    sX: 84,
    sY: 323,
  },

  sWidth: 26,
  sHeight: 160,

  position: [],

  width: multipleTwo(26),
  height: multipleTwo(160),

  maxPos: -230,
  minPos: -100,

  gap: 90,

  frames: 0,
  period: 170,

  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let position = this.position[i];
      let bottomPosY = this.height + position.y + this.gap;

      if (
        bird.x + bird.width > position.x &&
        bird.x < position.x + this.width &&
        bird.y < position.y + this.height &&
        bird.y + bird.height > position.y
      ) {
        state.current = state.gameOver;
      }

      if (
        bird.x + bird.width > position.x &&
        bird.x < position.x + this.width &&
        bird.y < bottomPosY + this.height &&
        bird.y + bird.height > bottomPosY
      ) {
        state.current = state.gameOver;
      }

      if (
        bird.x + bird.width === position.x + this.width / 2 &&
        bird.y >= position.y + this.height &&
        bird.y + bird.height <= bottomPosY
      ) {
        score.current++;
        localStorage.setItem("high", score.high);
        POINT.play();
      }

      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.sWidth,
        this.sHeight,
        position.x,
        position.y,
        this.width,
        this.height
      );

      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.sWidth,
        this.sHeight,
        position.x,
        bottomPosY,
        this.width,
        this.height
      );
    }
  },

  update() {
    if (state.current === state.game && pauseBtn.isPause === false) {
      for (let i = 0; i < this.position.length; i++) {
        let position = this.position[i];
        position.x -= 1;

        if (this.position.x + this.width <= 0) {
          this.position.shift();
        }
      }
    }
    if (state.current !== state.game) return false;

    if (!(state.current === state.gameOver) && pauseBtn.isPause === false) {
      if (this.frames % this.period === 0) {
        this.position.push({
          x: canvas.width,
          y: randomNum(this.maxPos, this.minPos),
        });
      }

      this.frames++;
    }

    console.log(frames);
  },

  reset() {
    this.position = [];
  },
};

// Floor
const floor = {
  sX: 292,
  sY: 0,
  sWidth: 168,
  sHeight: 56,

  x: 0,
  y: canvas.height - multipleTwo(56),
  width: canvas.width,
  height: multipleTwo(56),

  draw() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.sWidth,
      this.sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.sWidth,
      this.sHeight,
      this.x - this.width + 1,
      this.y,
      this.width,
      this.height
    );
  },

  update() {
    if (pauseBtn.isPause === false) {
      if (!(state.current === state.gameOver)) {
        this.x += 1;

        if ((this.x - this.width) / 2 >= 0) {
          this.x = 0;
        }
      }
    }
  },
};

// Bird
const bird = {
  animate: [
    { sX: 3, sY: 491 },
    { sX: 31, sY: 491 },
    { sX: 59, sY: 491 },
    { sX: 3, sY: 491 },
  ],

  sWidth: 17,
  sHeight: 12,

  x: 60,
  y: canvas.height / 3.25,
  width: multipleTwo(17),
  height: multipleTwo(13),

  frames: 0,
  frame: 0,

  speed: 0,
  gravity: 0.135,

  jump: 2.6,

  draw() {
    ctx.drawImage(
      sprite,
      this.animate[this.frame].sX,
      this.animate[this.frame].sY,
      this.sWidth,
      this.sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },

  update() {
    if (pauseBtn.isPause === false) {
      if (!(state.current === state.gameOver)) {
        this.period = state.current == state.game ? 5 : 8;
        this.frame += this.frames % this.period ? 0 : 1;
        this.frame = this.frame % this.animate.length;
      }

      if (state.current === state.getReady) {
        this.y = this.y;
      } else {
        this.speed += this.gravity;
        this.y += this.speed;

        if (this.y + this.height >= floor.y) {
          this.y = floor.y - this.height;
          state.current = state.gameOver;
        } else if (this.y <= 0) {
          this.y *= -0.5;
          this.gravity = 0.75;
        } else {
          this.gravity = 0.1;
          gameOver.isOver = false;
        }
      }

      if (state.current === state.getReady && getReady.frame === 0) {
        this.x = getReady.animate[0].x + getReady.animate[0].width + 15;
      } else {
        this.x = 60;
      }

      this.frames++;
    }
  },
  flap() {
    if (pauseBtn.isPause === false) {
      this.speed = -this.jump;
      WING.play();
    }
  },

  reset() {
    this.speed = 0;
    this.y = canvas.height / 3.25;
  },
};

// Get Ready [State]
const getReady = {
  animate: [
    {
      sX: 351,
      sY: 91,
      sWidth: 89,
      sHeight: 24,

      width: multipleTwo(89),
      height: multipleTwo(24),
      x: canvas.width / 2 - (89 + bird.x / 2),
      y: bird.y - 24 / 3,
    },
    [
      {
        sX: 295,
        sY: 59,
        sWidth: 92,
        sHeight: 25,

        width: multipleTwo(92),
        height: multipleTwo(25),
        x: canvas.width / 2 - 92,
        y: bird.y - multipleTwo(40),
      },

      {
        sX: 292,
        sY: 91,
        sWidth: 57,
        sHeight: 49,

        width: multipleTwo(57),
        height: multipleTwo(49),
        x: canvas.width / 2 - 57,
        y: bird.y,
      },
    ],
  ],

  frame: 0,

  draw() {
    for (let i = 0; i < this.animate.length; i++) {
      if (state.current === state.getReady && this.frame === 0) {
        ctx.drawImage(
          sprite,
          this.animate[i].sX,
          this.animate[i].sY,
          this.animate[i].sWidth,
          this.animate[i].sHeight,
          this.animate[i].x,
          this.animate[i].y,
          this.animate[i].width,
          this.animate[i].height
        );
      }
      for (let n = 0; n < this.animate[i].length; n++) {
        if (state.current === state.getReady && this.frame === 1) {
          ctx.drawImage(
            sprite,
            this.animate[i][n].sX,
            this.animate[i][n].sY,
            this.animate[i][n].sWidth,
            this.animate[i][n].sHeight,
            this.animate[i][n].x,
            this.animate[i][n].y,
            this.animate[i][n].width,
            this.animate[i][n].height
          );
        }
      }
    }
  },
};

// Game Over [State]
const gameOver = {
  gameOverMsg: [
    {
      sX: 395,
      sY: 59,
      sWidth: 96,
      sHeight: 21,
      x: canvas.width / 2 - 96,
      y: canvas.height / 5 - 30,
      width: multipleTwo(96),
      height: multipleTwo(21),
    },
    {
      sX: 3,
      sY: 259,
      sWidth: 113,
      sHeight: 57,
      x: canvas.width / 4 - 57 / 2,
      y: canvas.height / 4,
      width: multipleTwo(113),
      height: multipleTwo(57),
    },
    {
      sX: 462,
      sY: 42,
      sWidth: 40,
      sHeight: 14,
      x: canvas.width / 2 - 40,
      y: canvas.height / 2 + 5,
      width: multipleTwo(40),
      height: multipleTwo(14),
    },
  ],

  draw() {
    for (let i = 0; i < this.gameOverMsg.length; i++) {
      if (state.current === state.gameOver) {
        ctx.drawImage(
          sprite,
          this.gameOverMsg[i].sX,
          this.gameOverMsg[i].sY,
          this.gameOverMsg[i].sWidth,
          this.gameOverMsg[i].sHeight,
          this.gameOverMsg[i].x,
          this.gameOverMsg[i].y,
          this.gameOverMsg[i].width,
          this.gameOverMsg[i].height
        );
      }
    }
  },

  update() {},
};

// Pause Button
const pauseBtn = {
  sX: 121,
  sY: 306,
  sWidth: 13,
  sHeight: 14,

  x: 15,
  y: 15,
  width: multipleTwo(13),
  height: multipleTwo(14),

  isPause: false,

  draw() {
    if (state.current === state.game) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.sWidth,
        this.sHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  },

  update() {
    if (this.isPause === true) {
      this.sX = 334;
      this.sY = 142;
    } else {
      this.sX = 121;
      this.sY = 306;
    }
  },
};

// Score
const score = {
  current: 0,
  high: parseInt(localStorage.getItem("high")) || 0,

  draw() {
    let gameOverMsg = gameOver.gameOverMsg[1];
    ctx.fillStyle = "#fafafa";
    ctx.strokeStyle = "#553847";

    if (state.current === state.game) {
      ctx.font = "42px Flappy Bird";
      ctx.lineWidth = 2;
      ctx.fillText(this.current, canvas.width / 2 - 5, 40);
      ctx.strokeText(this.current, canvas.width / 2 - 5, 40);
    }
    if (state.current === state.gameOver) {
      ctx.font = "25px Flappy Bird";
      ctx.lineWidth = 1;

      ctx.fillText(
        this.high,
        gameOverMsg.x + gameOverMsg.width - 47,
        gameOverMsg.y + gameOverMsg.height - 23
      );
      ctx.strokeText(
        this.high,
        gameOverMsg.x + gameOverMsg.width - 47,
        gameOverMsg.y + gameOverMsg.height - 23
      );

      ctx.fillText(
        this.current,
        gameOverMsg.x + gameOverMsg.width - 47,
        gameOverMsg.y + 50
      );
      ctx.strokeText(
        this.current,
        gameOverMsg.x + gameOverMsg.width - 47,
        gameOverMsg.y + 50
      );
    }
  },

  update() {
    if (this.current > this.high) {
      this.high = this.current;
    }
  },

  reset() {
    this.current = 0;
  },
};

// Functions

// Animation Functions
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  background.draw();
  pipes.draw();
  floor.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  pauseBtn.draw();
  score.draw();
}

function update() {
  background.update();
  pipes.update();
  floor.update();
  bird.update();
  gameOver.update();
  pauseBtn.update();
  score.update();
}

function animate() {
  draw();
  update();

  requestAnimationFrame(animate);
}

animate();
