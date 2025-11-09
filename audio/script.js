// 1. Declaramos 'playlist' como una variable que se llenará dinámicamente
let playlist = [];

// 2. Obtener elementos del DOM (igual que antes)
const audioPlayer = document.getElementById('audio-player');
const playlistUl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const trackTitle = document.querySelector('.track-actual-titulo');
// const trackDetails = document.querySelector('.track-details'); // No usado en este ejemplo
// const tiempoActual = document.querySelector('.tiempo-actual'); // No usado en este ejemplo

let currentTrackIndex = 0; // Índice de la canción que se está reproduciendo

// ----------------------------------------------------
// FUNCIONES DE CONTROL (Se mantienen iguales)
// ----------------------------------------------------

function loadTrack(index) {
    if (playlist.length === 0) return; // Si la lista está vacía, no hace nada

    currentTrackIndex = index;
    const track = playlist[index];
    
    audioPlayer.src = track.src;
    audioPlayer.load();
    
    trackTitle.textContent = track.title;
    
    highlightCurrentTrack();
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸️'; // Símbolo de Pausa
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️'; // Símbolo de Play
    }
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸️';
}

function prevTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸️';
}

function renderPlaylist() {
    playlistUl.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('cancion-item');
        li.dataset.index = index;
        // Muestra el ID y el Título generado dinámicamente
        li.innerHTML = `
            <span>${track.id}. ${track.title}</span>
            <span>${track.duration}</span>
        `;
        
        li.addEventListener('click', () => {
            loadTrack(index);
            audioPlayer.play();
            playPauseBtn.textContent = '⏸️';
        });
        
        playlistUl.appendChild(li);
    });
}

function highlightCurrentTrack() {
    const items = playlistUl.querySelectorAll('.cancion-item');
    items.forEach((item, index) => {
        item.classList.remove('cancion-actual');
        if (index === currentTrackIndex) {
            item.classList.add('cancion-actual');
        }
    });
}

// ----------------------------------------------------
// FUNCIÓN CLAVE: Cargar la lista dinámicamente
// ----------------------------------------------------

async function fetchAndInitializePlayer() {
    try {
        // Hacemos una petición al archivo PHP para obtener el JSON de la playlist
        const response = await fetch('get_playlist.php'); 
        const dynamicPlaylist = await response.json();
        
        if (dynamicPlaylist.length > 0) {
            // Asigna la lista dinámica a la variable global 'playlist'
            playlist = dynamicPlaylist; 
            
            // 1. Renderiza la interfaz de la lista
            renderPlaylist(); 
            // 2. Carga la primera canción y la prepara para la reproducción
            loadTrack(currentTrackIndex); 
            
            console.log(`Lista cargada exitosamente. Total: ${playlist.length} canciones.`);
        } else {
            trackTitle.textContent = 'No se encontraron canciones en la carpeta "audio/"';
        }
        
    } catch (error) {
        console.error('Error al cargar la lista de reproducción. ¿Está el servidor PHP funcionando?', error);
        trackTitle.textContent = 'ERROR DE CARGA: Verifique el servidor y el archivo get_playlist.php';
    }
}

// ----------------------------------------------------
// Inicialización y Eventos
// ----------------------------------------------------

// Llamar a la función de inicialización al cargar la ventana
window.onload = fetchAndInitializePlayer;

// Asignar eventos a los botones
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audioPlayer.addEventListener('ended', nextTrack); // Al terminar, reproduce la siguiente