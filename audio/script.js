let playlist = []; // Esta lista se llenará con los datos del JSON

// Obtener elementos del DOM
const audioPlayer = document.getElementById('audio-player');
const playlistUl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const trackTitle = document.querySelector('.track-actual-titulo');

let currentTrackIndex = 0;

// --- Funciones de Control ---

function loadTrack(index) {
    if (playlist.length === 0) return;

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
        playPauseBtn.textContent = '⏸️'; 
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️'; 
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

function highlightCurrentTrack() {
    const items = playlistUl.querySelectorAll('.cancion-item');
    items.forEach((item, index) => {
        item.classList.remove('cancion-actual');
        if (index === currentTrackIndex) {
            item.classList.add('cancion-actual');
        }
    });
}

function renderPlaylist() {
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
            playPauseBtn.textContent = '⏸️';
        });
        
        playlistUl.appendChild(li);
    });
}

// --- Función de Carga (JSON) ---

async function fetchAndInitializePlayer() {
    try {
        const response = await fetch('playlist.json'); 
        const dynamicPlaylist = await response.json(); 
        
        if (dynamicPlaylist.length > 0) {
            playlist = dynamicPlaylist; 
            renderPlaylist(); 
            loadTrack(currentTrackIndex); 
        } else {
            trackTitle.textContent = 'ERROR: La lista JSON está vacía.';
        }
        
    } catch (error) {
        console.error('Error al cargar la lista JSON. Asegúrate de que "playlist.json" existe y está bien formado.', error);
        trackTitle.textContent = 'ERROR DE CARGA: Verifique el archivo playlist.json';
    }
}

// --- Inicialización y Eventos ---

window.onload = fetchAndInitializePlayer;

playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audioPlayer.addEventListener('ended', nextTrack);
