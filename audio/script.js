// 1. DEFINICIÓN DE LA LISTA DE CANCIONES (¡VERIFICA TUS RUTAS Y NOMBRES DE ARCHIVO!)
let playlist = [
    { id: 133, title: "BERTIN OSBORNE - llueve", duration: "0:00", src: "./audio/llueve.mp3" },
    { id: 131, title: "ALEJANDRO JAEN - a escondidas", duration: "0:00", src: "./audio/escondidas.mp3" },
    { id: 132, title: "MANZANERO - por volverte a ver", duration: "0:00", src: "./audio/por volverte a ver.mp3" },
    { id: 133, title: "MASSE - tu fotografia", duration: "0:00", src: "./audio/tu fotografia.mp3" },
    // AGREGA TUS OTRAS CANCIONES AQUÍ
];

// 2. Obtener elementos del DOM
const audioPlayer = document.getElementById('audio-player');
const playlistUl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const stopBtn = document.getElementById('stop-btn');
const trackTitle = document.querySelector('.track-actual-titulo');

// ELEMENTOS DE CONTROL
const currentTimeDisplay = document.querySelector('.tiempo-actual');
const totalTimeDisplay = document.querySelector('.tiempo-total');
const progressBar = document.getElementById('barra-progreso');
const volumeControl = document.getElementById('volumen-control'); 

// --- NUEVO ELEMENTO: SPINNER ---
const loadingSpinner = document.getElementById('loading-spinner');

let currentTrackIndex = 0; 

// --- Funciones de Utilidad ---

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    
    // Redondear hacia abajo (Math.floor) para eliminar milisegundos y asegurar MM:SS
    const totalSeconds = Math.floor(seconds); 
    
    const min = Math.floor(totalSeconds / 60);
    const sec = Math.floor(totalSeconds % 60);
    
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// --- Funciones de Control de Reproducción ---

function loadTrack(index) {
    if (playlist.length === 0) return;

    currentTrackIndex = index;
    const track = playlist[index];
    
    audioPlayer.src = track.src;
    
    // **MEJORA CLAVE:** Mostrar spinner al cargar
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');

    audioPlayer.load();
    
    trackTitle.textContent = track.title;
    
    // Resetear visualización
    if (progressBar) progressBar.value = 0;
    if (currentTimeDisplay) currentTimeDisplay.textContent = '00:00';
    if (totalTimeDisplay) totalTimeDisplay.textContent = '00:00'; 
    
    highlightCurrentTrack();

    // LÓGICA CLAVE: Ocultar spinner y actualizar la duración real
    audioPlayer.onloadedmetadata = function() {
        // **MEJORA CLAVE:** Ocultar spinner al terminar de cargar los metadatos
        if (loadingSpinner) loadingSpinner.classList.add('hidden');

        if (!isNaN(audioPlayer.duration)) {
            // 1. Actualiza el objeto playlist con la duración real
            playlist[currentTrackIndex].duration = formatTime(audioPlayer.duration);
            
            // 2. Llama a renderPlaylist para redibujar la lista con la duración correcta
            renderPlaylist(); 
            
            // 3. Vuelve a resaltar la canción después de redibujar
            highlightCurrentTrack();
        }
    };
    
    // Opcional: Ocultar spinner si la carga falla 
    audioPlayer.onerror = function() {
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        console.error("Error al cargar el archivo de audio.");
    };
}

function togglePlay() {
    // Obtenemos el elemento <i> (el icono) dentro del botón
    const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;

    if (!playIcon) {
        if (audioPlayer.paused) audioPlayer.play();
        else audioPlayer.pause();
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause'); // Cambia a icono de pausa
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play'); // Cambia a icono de play
    }
}

function nextTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    
    const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    if (playIcon) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
}

function prevTrack() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();

    const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    if (playIcon) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
}

function stopTrack() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    if (playIcon) {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play'); 
    }
    
    if (currentTimeDisplay) currentTimeDisplay.textContent = '00:00';
    if (progressBar) progressBar.value = 0;
}

// --- Lógica de la Barra de Progreso y Tiempo ---

function updateTime() {
    if (!isNaN(audioPlayer.duration)) {
        if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        
        if (progressBar) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progressPercent;
        }
    }
}

function seekTo() {
    if (progressBar && !isNaN(audioPlayer.duration)) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
}

// --- Lógica de la Lista ---

function highlightCurrentTrack() {
    if (!playlistUl) return; 
    
    const items = playlistUl.querySelectorAll('.cancion-item');
    items.forEach((item, index) => {
        item.classList.remove('cancion-actual');
        if (index === currentTrackIndex) {
            item.classList.add('cancion-actual');
        }
    });
}

function renderPlaylist() {
    if (!playlistUl) return; 
    
    playlistUl.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('cancion-item');
        li.dataset.index = index;
        
        li.innerHTML = `
            <span>${track.id}. ${track.title}</span>
            <span>${track.duration}</span>
        `;
        
        li.addEventListener('click', () => {
            loadTrack(index);
            audioPlayer.play();

            const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
            if (playIcon) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            }
        });
        
        playlistUl.appendChild(li);
        
        // Cargar metadatos para obtener la duración de la canción si aún no la tenemos
        if (track.duration === '0:00' || track.duration === '00:00') {
            const tempAudio = new Audio(track.src);
            tempAudio.onloadedmetadata = () => {
                if (!isNaN(tempAudio.duration)) {
                    playlist[index].duration = formatTime(tempAudio.duration);
                    if (li.querySelector('span:last-child').textContent !== playlist[index].duration) {
                        renderPlaylist(); 
                        highlightCurrentTrack(); 
                    }
                }
            };
        }
    });
}


// --- Inicialización Estática ---

window.onload = () => {
    if (volumeControl) {
        audioPlayer.volume = volumeControl.value; 
    }

    // Asegurar que el spinner esté oculto al inicio
    if (loadingSpinner) loadingSpinner.classList.add('hidden');

    if (playlist.length > 0) {
        renderPlaylist(); 
        loadTrack(currentTrackIndex); 
    } else {
        trackTitle.textContent = 'ERROR: La lista de canciones está vacía en script.js';
    }
};

// --- Asignación de Eventos ---

// Eventos de control 
if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (stopBtn) stopBtn.addEventListener('click', stopTrack);

// Eventos del elemento de audio
audioPlayer.addEventListener('ended', nextTrack);
audioPlayer.addEventListener('timeupdate', updateTime); 

// Actualiza el tiempo total en el encabezado
audioPlayer.addEventListener('loadedmetadata', () => {
    if (totalTimeDisplay) {
         totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }
});

if (progressBar) {
    progressBar.addEventListener('input', seekTo); 
}

if (volumeControl) {
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });
}

