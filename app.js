const sections = document.querySelectorAll('.section');
const sectBtns = document.querySelectorAll('.controls');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelectorAll('.main-content')[0];

function PageTransition() {
    // Button click active class
    for (let i = 0; i < sectBtn.length; i++){
        sectBtn[i].addEventListener('click', function() {
            let currentBtn = document.querySelectorAll('.active-btn');
            currentBtn[0].className = currentBtn[0].className.replace('active-btn','');
            this.classList.add('active-btn');
        })
    }
    // Sections Active class
    allSections.addEventListener('click', (e) =>{
        const id = e.target.dataset.id;
        if(id) {
            //remove selected from the other buttons
            sectBtns.forEach((btn) =>{
                btn.classList.remove('active');
            })
            e.target.classList.add('active')

            //hide other sections
            sections.forEach((section) =>{
                section.classList.remove('active')
            })

            const element =document.getElementById(id);
            element.classList.add('active');
        }   
    })

    //Toggle theme
    const themeBtn = document.querySelector('.theme-btn');
    themeBtn.addEventListener('click',() => {
        let element =document.body;
        element.classList.toggle('light-mode')
    })
}


PageTransition()

//Game Logic
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const bootScreen = document.getElementById("bootScreen");

const box = 16;
let snake;
let direction;
let food;
let score;
let gameInterval;
let gameStarted = false;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;
  food = spawnFood();
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

document.addEventListener("keydown", (e) => {

  if (!gameStarted && e.key === "Enter") {
    startGame();
  }

  if (gameStarted) {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  }
});

function startGame() {
  bootScreen.style.display = "none";
  gameStarted = true;
  initGame();
  gameInterval = setInterval(draw, 100);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(0,255,0,0.05)";
  for (let i = 0; i < canvas.width; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += box) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#00ff66" : "#00cc55";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = "#ff0033";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    snake.some(segment => segment.x === headX && segment.y === headY)
  ) {
    clearInterval(gameInterval);
    gameStarted = false;
    bootScreen.style.display = "flex";
    bootScreen.innerHTML = `
      <p>> Game Over</p>
      <p>> Score: ${score}</p>
      <p class="start-text">PRESS ENTER TO RESTART</p>
    `;
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}