// --- Configuración del Tablero ---
const grid = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

// ¡DIMENSIONES DEL TABLERO 20x30!
const width = 20; 
const height = 30; 
const totalCells = width * height; 

let squares = []; 
let score = 0;
let timerId = null; 
let currentPosition = Math.floor(width / 2) - 1; // Posición central
let nextRandom = 0; // Para la próxima pieza

// Crear el tablero (600 divs)
function createGrid() {
    for (let i = 0; i < totalCells; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }
    // Agregar la fila "fantasma" de colisión
    for (let i = 0; i < width; i++) {
        const blocker = document.createElement('div');
        blocker.classList.add('taken'); 
        grid.appendChild(blocker);
        squares.push(blocker);
    }
}
createGrid();

// --- Definición de las 7 Piezas (Tetrominos) ---

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const jTetromino = [
    [1, width + 1, width * 2 + 1, 0],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const sTetromino = [
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

const zTetromino = [
    [1, width + 1, width, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width + 1, width, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2]
];

// Array con todas las piezas
const theTetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];

let random = Math.floor(Math.random() * theTetrominoes.length);
let currentRotation = 0;
let current = theTetrominoes[random][currentRotation];
let currentColor = random + 1; 

// --- Funciones del Juego ---

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add(`tetromino-color-${currentColor}`);
    });
}

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove(`tetromino-color-${currentColor}`);
    });
}

function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = nextRandom; 
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        currentColor = random + 1;
        currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        currentPosition = Math.floor(width / 2) - 1;
        draw();
        addScore();
        gameOver();
    }
}

function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

function rotate() {
    undraw();
    const originalRotation = currentRotation;
    currentRotation++;
    if(currentRotation === current.length) { 
        currentRotation = 0; 
    }
    current = theTetrominoes[random][currentRotation];
    const isNextToLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    const isNextToRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if (current.some(index => squares[currentPosition + index].classList.contains('taken')) || 
        (isNextToLeftEdge && isNextToRightEdge) ) {
        currentRotation = originalRotation;
        current = theTetrominoes[random][currentRotation];
    }
    draw();
}

// Control con teclado
function control(e) {
    if (timerId === null) return; 
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
}
document.addEventListener('keydown', control);

function addScore() {
    for (let i = 0; i < totalCells; i += width) {
        const row = [];
        for (let j = 0; j < width; j++) row.push(i + j);
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].className = '';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// Botón de inicio/pausa/reinicio
startButton.addEventListener('click', () => {
    if (startButton.textContent === 'Reiniciar Juego') {
        window.location.reload();
        return;
    }
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Reanudar';
    } else {
        draw();
        timerId = setInterval(moveDown, 1000); 
        startButton.textContent = 'Pausa';
    }
});

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = '¡Fin del Juego! Puntuación Final: ' + score;
        clearInterval(timerId);
        timerId = null;
        document.removeEventListener('keydown', control);
        startButton.textContent = 'Reiniciar Juego'; 
    }
}

// --- Inicialización del Juego ---
draw();
timerId = setInterval(moveDown, 1000);
startButton.textContent = 'Pausa';

// --- NUEVO: Controles táctiles (swipes para móviles) ---
let startX, startY, endX, endY;

document.addEventListener("touchstart", function(event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}, false);

document.addEventListener("touchend", function(event) {
  endX = event.changedTouches[0].clientX;
  endY = event.changedTouches[0].clientY;
  handleSwipe();
}, false);

function handleSwipe() {
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 30) {
      moveRight(); 
    } else if (diffX < -30) {
      moveLeft();
    }
  } else {
    if (diffY > 30) {
      moveDown();
    } else if (diffY < -30) {
      rotate();
    }
  }
}
