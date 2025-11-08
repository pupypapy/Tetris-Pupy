// ---- CONTROLES TÁCTILES PARA CELULARES ----
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const swipeZone = document.getElementById("gameCanvas") || document.body; // ajusta el ID si tu canvas tiene otro nombre

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

  // distancia mínima para considerar un movimiento
  const threshold = 30;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Movimiento horizontal
    if (dx > threshold) {
      moveRight(); // deslizar a la derecha
    } else if (dx < -threshold) {
      moveLeft(); // deslizar a la izquierda
    }
  } else {
    // Movimiento vertical
    if (dy >
