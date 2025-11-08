  // ---- Definición de las piezas (Tetrominos) AJUSTADAS PARA width = 10 ----

  // La forma I
  const iTetromino = [
    [0, width, width * 2, width * 3],     // |
    [width, width + 1, width + 2, width + 3], // ----
    [0, width, width * 2, width * 3],     // |
    [width, width + 1, width + 2, width + 3]  // ----
  ];

  // La forma J
  const jTetromino = [
    [1, width + 1, width * 2 + 1, width * 2],  //   |
    [width, width + 1, width + 2, 2],         // ---.
    [1, width + 1, width * 2 + 1, 0],         //  .|
    [width, width * 2, width * 2 + 1, width * 2 + 2] // .---
  ];

  // La forma L
  const lTetromino = [
    [0, width, width * 2, width * 2 + 1],  // |
    [width, width + 1, width + 2, 0],     // .---
    [1, width + 1, width * 2 + 1, width * 2], //  .|
    [width, width * 2, width * 2 + 1, width * 2 + 2] // .---
  ];

  // La forma O (cuadrado)
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  // La forma S
  const sTetromino = [
    [width, width + 1, 1, 2],             //  .--
    [1, width + 1, width * 2, width * 2 + 1], // |.--
    [width, width + 1, 1, 2],             //  .--
    [1, width + 1, width * 2, width * 2 + 1]  // |.--
  ];

  // La forma T
  const tTetromino = [
    [1, width, width + 1, width + 2],     //  .--.
    [1, width + 1, width + 2, width * 2 + 1], //  .|
    [width, width + 1, width + 2, width * 2 + 1], // .--.
    [1, width, width + 1, width * 2 + 1]  //   .|
  ];

  // La forma Z
  const zTetromino = [
    [0, 1, width + 1, width + 2],         // .--
    [1, width, width + 1, width * 2],     //  .|
    [0, 1, width + 1, width + 2],         // .--
    [1, width, width + 1, width * 2]      //  .|
  ];
  
  const tetrominoes = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];

  // Ahora, el 'currentPosition' inicial debe ser más central para un ancho de 10
  let currentPosition = 3; // En lugar de 4, para que inicie más al centro
