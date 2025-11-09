<?php
$files = glob("audio/*.mp3");
$playlist = [];
foreach ($files as $index => $file) {
    // basename() extrae solo el nombre del archivo (ej: cancion1.mp3)
    $title = basename($file, ".mp3"); 
    $playlist[] = [
        'id' => $index + 1,
        'title' => $title,
        'src' => $file, // e.g., 'audio/cancion1.mp3'
        // Podrías usar librerías para leer la duración y otros metadatos ID3, pero es más complejo
        'duration' => 'N/A' 
    ];
}
// Devolver la lista como JSON
header('Content-Type: application/json');
echo json_encode($playlist);
?>