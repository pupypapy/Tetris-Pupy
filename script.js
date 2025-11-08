document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid-container");
  const scoreDisplay = document.getElementById("score");
  const startButton = document.getElementById("start-button");

  // AJUSTE CLAVE: Dimensiones del tablero 10x20
  const width = 10; // columnas
  const height = 20; // filas
  let squares = [];
  let timerId;
  let score = 0;
  let isPaused = true;

  // Crear la cuadrícula de 10x20 (200 celdas)
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    gridContainer.appendChild(div);
    squares.push(div);
  }

  // AÑADIR CELDAS DEL SUELO (1 fila extra "taken" invisible)
  for (let i = 0; i < width; i++) {
    const groundDiv = document.createElement("div");
    // Clase 'taken' para detener, 'invisible-ground' para ocultar (definida en style.css)
    groundDiv.classList.add("taken", "invisible-ground"); 
    gridContainer.appendChild(groundDiv);
    squares.push(groundDiv);
  }


  // ---- Definición de las piezas (Tetrominos) AJUSTADAS PARA width = 10 ----
  
  // La forma I (COLOR 1)
  const iTetromino = [
    [0, width, width * 2, width * 3],     // |
    [width, width + 1, width + 2, width + 3], // ----
    [0, width, width * 2, width * 3],     // |
    [width, width + 1, width + 2, width + 3]  // ----
  ];

  // La forma J (COLOR 2)
  const jTetromino = [
    [1, width + 1, width * 2 + 1, width * 2],  
    [width, width + 1, width + 2, 2],         
    [1, width + 1, width * 2 + 1, 0],         
    [width, width * 2, width * 2 + 1, width * 2 + 2] 
  ];

  // La forma L (COLOR 3)
  const lTetromino = [
    [0, width, width * 2, width * 2 + 1], 
    [width, width + 1, width + 2, 0],     
    [1, width + 1, width * 2 + 1, width * 2], 
    [width, width * 2, width * 2 + 1, width * 2 + 2] 
  ];

  // La forma O (COLOR 4)
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  // La forma S (COLOR 5)
  const sTetromino = [
    [width, width + 1, 1, 2],             
    [1, width + 1, width * 2, width * 2 + 1], 
    [width, width + 1, 1, 2],             
    [1, width + 1, width * 2, width * 2 + 1]  
  ];

  // La forma T (COLOR 6)
  const tTetromino = [
    [1, width, width + 1, width + 2],     
    [1, width + 1, width + 2, width * 2 + 1], 
    [width, width + 1, width + 2, width * 2 + 1], 
    [1, width, width + 1, width * 2 + 1]  
  ];

  // La forma Z (COLOR 7)
  const zTetromino = [
    [0, 1, width + 1, width + 2],         
    [1, width, width + 1, width * 2],     
    [0, 1, width + 1, width + 2],         
    [1, width, width + 1, width * 2]      
  ];
  
  // ORDEN CRÍTICO: Debe coincidir con los colores 1 a 7
  const tetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];

  // Variables de inicio:
  let currentPosition = 4; // Inicia más centrado para 10 columnas
  let currentRotation = 0;
  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random][currentRotation];
  let colorIndex = random + 1; // El índice del color va de 1 a 7

  // ---- Dibujar y borrar pieza ----
  function draw() {
    current.forEach(index => {
      // Usamos !! para asegurar que la celda exista antes de dibujar (robustez)
      if (!!squares[currentPosition + index]) { 
        squares[currentPosition + index].classList.add(`tetromino-color-${colorIndex}`);
      }
    });
  }

  function undraw() {
    current.forEach(index => {
      if (!!squares[currentPosition + index]) {
        squares[currentPosition + index].classList.remove(`tetromino-color-${colorIndex}`);
      }
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
    // Si la pieza toca el 'suelo' (gracias a la fila extra) o una pieza 'taken'
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
      
      // La pieza actual se convierte en "tomada"
      current.forEach(index => squares[currentPosition + index].classList.add("taken"));
      
      // Nueva pieza
      currentRotation = 0; 
      random = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      colorIndex = random + 1;
      currentPosition = 4;
      
      // Comprobar Game Over y dibujar la nueva pieza
      gameOver();
      draw(); 
      addScore();
    }
  }

  function moveLeft() {
    undraw();
    // 1. Verificar si tocará el borde izquierdo O una pieza 'taken'
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    const willCollide = current.some(index => squares[currentPosition + index - 1].classList.contains("taken"));

    if (!isAtLeftEdge && !willCollide) {
        currentPosition -= 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    // 1. Verificar si tocará el borde derecho O una pieza 'taken'
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    const willCollide = current.some(index => squares[currentPosition + index + 1].classList.contains("taken"));
    
    if (!isAtRightEdge && !willCollide) {
        currentPosition += 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    const originalRotation = currentRotation;
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    
    // Intenta usar la nueva rotación
    let next = tetrominoes[random][currentRotation];
    
    // Comprobar si la rotación choca con una pieza "taken"
    const willCollide = next.some(index => squares[currentPosition + index].classList.contains("taken"));

    // Si choca, vuelve a la rotación anterior
    if (willCollide) {
        currentRotation = originalRotation;
        current = tetrominoes[random][currentRotation];
    } else {
        current = next;
    }
    draw();
  }

  // ---- Botón de inicio / pausa ----
  startButton.addEventListener("click", () => {
    if (isPaused) {
      isPaused = false;
      startButton.textContent = "Pausar";
      draw();
      timerId = setInterval(moveDown, 800);
    } else {
      isPaused = true;
      startButton.textContent = "Continuar";
      clearInterval(timerId);
    }
  });

  // ---- Puntaje / Eliminación de filas ----
  function addScore() {
    // Solo iteramos sobre las filas visibles (height)
    for (let i = 0; i < height * width; i += width) { 
      const row = Array.from({ length: width }, (_, k) => i + k);
      
      // Si todos los cuadros de la fila tienen la clase "taken"
      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        
        // 1. Limpiar las clases de la fila
        row.forEach(index => {
          squares[index].classList.remove(
            "taken",
            "tetromino-color-1", "tetromino-color-2", "tetromino-color-3", "tetromino-color-4",
            "tetromino-color-5", "tetromino-color-6", "tetromino-color-7"
          );
        });
        
        // 2. Eliminar la fila del array 'squares'
        const removed = squares.splice(i, width);
        
        // 3. Insertar la fila eliminada (vacía) al inicio
        squares = removed.concat(squares);
        
        // 4. Actualizar visualmente la cuadrícula
        squares.forEach(cell => gridContainer.appendChild(cell));
      }
    }
  }

  // ---- Game Over ----
  function gameOver() {
    // Comprueba si la nueva pieza choca inmediatamente con una pieza 'taken'
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      clearInterval(timerId);
      isPaused = true;
      startButton.textContent = "Juego Terminado";
      alert("🎮 Juego terminado! Puntuación: " + score);
    }
  }

  // ---- CONTROLES TÁCTILES PARA CELULARES (Botones) ----
  document.getElementById("left-btn").addEventListener("click", moveLeft);
  document.getElementById("right-btn").addEventListener("click", moveRight);
  document.getElementById("rotate-btn").addEventListener("click", rotate);
  document.getElementById("down-btn").addEventListener("click", moveDown);
  
  // Lógica de Swiping
  let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
  const swipeZone = document.querySelector(".grid-container") || document.body;

  swipeZone.addEventListener("touchstart", function(e) {
    if (isPaused) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, false);

  swipeZone.addEventListener("touchmove", function(e) {
    if (isPaused) return;
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
  }, false);

  swipeZone.addEventListener("touchend", function() {
    if (isPaused) return;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const threshold = 30; // Sensibilidad del swipe

    if (Math.abs(dx) > Math.abs(dy)) {
      // Movimiento horizontal (Swipe Left/Right)
      if (dx > threshold) moveRight();
      else if (dx < -threshold) moveLeft();
    } else if (Math.abs(dy) > threshold) {
      // Movimiento vertical (Swipe Down)
      if (dy > threshold) moveDown();
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && touchStartX !== 0) {
      // Tocado (Tap) para rotar
      rotate();
    }
    // Reiniciar valores táctiles
    touchStartX = touchStartY = touchEndX = touchEndY = 0;

  }, false);

});
