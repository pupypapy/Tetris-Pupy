// ---- CONTROLES TÁCTILES PARA CELULARES ----
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Puedes usar el contenedor del tablero para los gestos
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
  const threshold = 30; // distancia mínima para considerar movimiento

  if (Math.abs(dx) > Math.abs(dy)) {
    // Movimiento horizontal
    if (dx > threshold) {
      moveRight(); // deslizar a la derecha
    } else if (dx < -threshold) {
      moveLeft(); // deslizar a la izquierda
    }
  } else {
    // Movimiento vertical o toque
    if (dy > threshold) {
      moveDown(); // deslizar hacia abajo
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      rotate(); // toque rápido = rotar pieza
    }
  }

  // Reiniciar valores
  touchStartX
