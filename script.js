document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid-container");
  const scoreDisplay = document.getElementById("score");
  const startButton = document.getElementById("start-button");

  const width = 20; // columnas
  const height = 30; // filas
  let squares = [];
  let timerId;
  let score = 0;
  let isPaused = true;

  // Crear la cuadrícula
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    gridContainer.appendChild(div);
    squares.push(div);
  }

  // ---- Definición de las piezas (Tetrominos) ----
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random][currentRotation];
  let colorIndex = random + 1;

  // ---- Dibujar y borrar pieza ----
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add(`tetromino-color-${colorIndex}`);
    });
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove(`tetromino-color-${colorIndex}`);
    });
  }

  // ---- Controles del teclado ----
  function control(e) {
    if (isPaused) return;
    if (e.key === "ArrowLeft") moveLeft();
    else if (e.key === "ArrowRight") moveRight();
    else if (e.key === "ArrowDown") moveDown();
    else if (e.key === "ArrowUp") rotate();
  }
  document.addEventListener("keydown", control);

  // ---- Movimiento de piezas ----
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width]?.classList.contains("taken"))) {
      current.forEach(index => squares[currentPosition + index].classList.add("taken"));
      random = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      colorIndex = random + 1;
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    current = tetrominoes[random][currentRotation];
    draw();
  }

  // ---- Botón de inicio / pausa ----
  startButton.addEventListener("click", () => {
    if (isPaused) {
      isPaused = false;
      draw();
      timerId = setInterval(moveDown, 800);
    } else {
      isPaused = true;
      clearInterval(timerId);
    }
  });

  // ---- Puntaje ----
  function addScore() {
    for (let i = 0; i < height * width; i += width) {
      const row = Array.from({ length: width }, (_, k) => i + k);
      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove(
            "taken",
            "tetromino-color-1",
            "tetromino-color-2",
            "tetromino-color-3",
            "tetromino-color-4",
            "tetromino-color-5",
            "tetromino-color-6",
            "tetromino-color-7"
          );
        });
        const removed = squares.splice(i, width);
        squares = removed.concat(squares);
        squares.forEach(cell => gridContainer.appendChild(cell));
      }
    }
  }

  // ---- Game Over ----
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      clearInterval(timerId);
      alert("🎮 Juego terminado!");
    }
  }

  // ---- CONTROLES TÁCTILES PARA CELULARES ----
  let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
  const swipeZone = document.querySelector(".grid-container") || document.body;

  swipeZone.addEventListener("touchstart", function(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, false);

  swipeZone.addEventListener("touchmove", function(e) {
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
  }, false);

  swipeZone.addEventListener("touchend", function() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const threshold = 30;

    if (isPaused) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) moveRight();
      else if (dx < -threshold) moveLeft();
    } else {
      if (dy > threshold) moveDown();
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) rotate();
    }
  }, false);
});
