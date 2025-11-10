// ----------------- LISTA DE CANCIONES -----------------
let playlist = [
    { title: "Survivor - the search is over", duration: "00:00", src: "./audio/search_over.mp3" },
    { title: "kenny loggins - meet me half way", duration: "00:00", src: "./audio/way.mp3" },
    { title: "Player - it's for you", duration: "00:00", src: "./audio/for you.mp3" },
    { title: "Level 42 - something about you", duration: "00:00", src: "./audio/something.mp3" },
    { title: "Falco - der Kommissar", duration: "00:00", src: "./audio/der kommissar.mp3" },
    { title: "Glenn Frey - you belong to the city", duration: "00:00", src: "./audio/you belong.mp3" },
    { title: "Eddy Grant - electric avenue", duration: "00:00", src: "./audio/electric avenue.mp3" },
    { title: "The Romantics - talking in your sleep", duration: "00:00", src: "./audio/talking in your sleep.mp3" },
    { title: "Rockwell - somebody's watching me", duration: "00:00", src: "./audio/somebody watching me.mp3" },
    { title: "Glenn Frey - the one you love", duration: "00:00", src: "./audio/the one love.mp3" },
    { title: "DeBarge - who's holding donna now", duration: "00:00", src: "./audio/whos holding.mp3" },
    { title: "Robbie Dupree - steal away", duration: "00:00", src: "./audio/steal away.mp3" },
    { title: "Level 42 - it's over", duration: "00:00", src: "./audio/over.mp3" },
    { title: "Fourplay - between the sheets", duration: "00:00", src: "./audio/between.mp3" },
    { title: "Bobby Goldsboro - summer the first time", duration: "00:00", src: "./audio/summer.mp3" },
    { title: "Real Life - send me an angel", duration: "00:00", src: "./audio/send me.mp3" },
    { title: "Andy Gibb - love is thicker than water", duration: "00:00", src: "./audio/love.mp3" },
    { title: "Cliff Richard - ocean deep", duration: "00:00", src: "./audio/ocean.mp3" },
    { title: "Crystal Gayle & Gary Morris - one more try for love", duration: "00:00", src: "./audio/one more.mp3" },
    { title: "Level 42 - lessons in love", duration: "00:00", src: "./audio/lessons.mp3" },
    { title: "Morris Albert - shes my girl", duration: "00:00", src: "./audio/shes my girl.mp3" },
    { title: "Soft Cell - tainted love", duration: "00:00", src: "./audio/tainted.mp3" },
    { title: "Peaches & Herb - reunited", duration: "00:00", src: "./audio/reunited.mp3" },
    { title: "Andy Gibb - don't throw It all away", duration: "00:00", src: "./audio/our love.mp3" },
    { title: "Joe Jackson - steppin out", duration: "00:00", src: "./audio/steppin.mp3" },
];

let currentPlaylist = [...playlist]; 

// ----------------- ESTADOS DEL REPRODUCTOR -----------------
let currentTrackIndex = 0;
let userInteracted = false; 
let repeatMode = "NONE"; 
let isShuffled = false; 

// ----------------- ELEMENTOS DOM -----------------
const audioPlayer = document.getElementById('audio-player');
const playlistUl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const stopBtn = document.getElementById('stop-btn');
const trackTitle = document.querySelector('.track-actual-titulo');

const currentTimeDisplay = document.querySelector('.tiempo-actual');
const totalTimeDisplay = document.querySelector('.tiempo-total');
const progressBar = document.getElementById('barra-progreso');
const volumeControl = document.getElementById('volumen-control'); 
const loadingSpinner = document.getElementById('loading-spinner');

const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');

const cssVisualizer = document.getElementById('css-visualizer'); 

// ----------------- UTILIDADES -----------------
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds < 0) return "00:00";
    const totalSeconds = Math.floor(seconds);
    const min = Math.floor(totalSeconds / 60);
    const sec = Math.floor(totalSeconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function getAudioDuration(src) {
    return new Promise((resolve) => {
        const tempAudio = document.createElement('audio');
        tempAudio.onloadedmetadata = () => {
            resolve(formatTime(tempAudio.duration));
            tempAudio.remove();
        };
        tempAudio.onerror = () => {
            resolve("ERROR");
            tempAudio.remove();
        };
        setTimeout(() => {
             tempAudio.src = src;
        }, 5);
    });
}

async function prefetchDurations() {
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    
    const durationPromises = playlist.map(track => getAudioDuration(track.src));
    const durations = await Promise.all(durationPromises);

    durations.forEach((duration, index) => {
        playlist[index].duration = duration;
    });

    if (loadingSpinner) loadingSpinner.classList.add('hidden');
    renderPlaylist(); 
}

// ----------------- CARGAR Y RENDERIZAR -----------------
function loadTrack(index) {
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    currentTrackIndex = index;
    const track = currentPlaylist[index];

    if (loadingSpinner) loadingSpinner.classList.remove('hidden');

    audioPlayer.src = track.src;
    audioPlayer.load();

    trackTitle.textContent = track.title;

    if (currentTimeDisplay) currentTimeDisplay.textContent = '00:00';
    if (totalTimeDisplay) totalTimeDisplay.textContent = track.duration; 
    if (progressBar) {
        progressBar.value = 0;
        // La siguiente línea ayuda a la barra de progreso personalizada en CSS
        progressBar.style.setProperty('--progress-value', '0%');
    }

    highlightCurrentTrack();

    const onCanPlay = () => {
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        audioPlayer.removeEventListener('canplay', onCanPlay);
    };
    audioPlayer.addEventListener('canplay', onCanPlay);
    
    audioPlayer.onerror = function() {
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        trackTitle.textContent = "ERROR cargando: " + track.title;
        console.error("Error al cargar MP3. Verifique la ruta del archivo: " + track.src);
    };
}

function renderPlaylist() {
    if (!playlistUl) return;
    playlistUl.innerHTML = '';
    currentPlaylist.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('cancion-item');
        li.dataset.index = index; 
        
        li.innerHTML = `<span>${index + 1}. ${track.title}</span><span>${track.duration}</span>`;

        li.addEventListener('click', (e) => {
            const clickedIndex = Number(e.currentTarget.dataset.index);
            
            if (clickedIndex === currentTrackIndex && !audioPlayer.paused) {
                 togglePlayPause();
            } else {
                loadTrack(clickedIndex);
                audioPlayer.play().then(setPlayIconToPause).catch(setPlayIconToPlay);
            }
            userInteracted = true;
        });

        playlistUl.appendChild(li);
    });
    highlightCurrentTrack();
}

function highlightCurrentTrack() {
    if (!playlistUl) return;
    const items = playlistUl.querySelectorAll('.cancion-item');
    items.forEach((item, idx) => {
        item.classList.toggle('cancion-actual', idx === currentTrackIndex);
    });
    const currentItem = playlistUl.querySelector('.cancion-actual');
    if (currentItem) {
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}


// ----------------- CONTROLES DE REPRODUCCIÓN -----------------

function setPlayIconToPause() {
    const i = playPauseBtn?.querySelector('i');
    if (i) {
        i.classList.remove('fa-play');
        i.classList.add('fa-pause');
    }
    if (cssVisualizer) cssVisualizer.classList.add('active'); // Muestra el visualizador CSS
}

function setPlayIconToPlay() {
    const i = playPauseBtn?.querySelector('i');
    if (i) {
        i.classList.remove('fa-pause');
        i.classList.add('fa-play');
    }
    if (cssVisualizer) cssVisualizer.classList.remove('active'); // Oculta el visualizador CSS
}

function togglePlayPause() {
    userInteracted = true;

    if (audioPlayer.paused || audioPlayer.ended) {
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');

        audioPlayer.play().then(setPlayIconToPause).catch(setPlayIconToPlay).finally(() => {
            if (loadingSpinner && audioPlayer.paused) { 
                 loadingSpinner.classList.add('hidden');
            }
        });
    } else {
        audioPlayer.pause();
        setPlayIconToPlay();
    }
}

function playNextTrack() {
    if (!currentPlaylist || currentPlaylist.length === 0) return;

    if (repeatMode === "ONE") {
        // La repetición de uno ya está manejada por audioPlayer.loop = true
        loadTrack(currentTrackIndex); 
    } else if (repeatMode === "ALL") {
        currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
        loadTrack(currentTrackIndex);
    } else { 
        const nextIndex = currentTrackIndex + 1;
        if (nextIndex < currentPlaylist.length) {
            currentTrackIndex = nextIndex;
            loadTrack(currentTrackIndex);
        } else {
            // Final de la lista sin repetición, detener y resetear
            stopTrack(); 
            currentTrackIndex = 0; 
            loadTrack(currentTrackIndex); // Carga la primera canción para la próxima reproducción
            return;
        }
    }
    
    audioPlayer.play().then(setPlayIconToPause).catch(setPlayIconToPlay);
}

function prevTrack() {
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    
    // Si la canción ha avanzado más de 3 segundos, retrocede al inicio
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }

    currentTrackIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadTrack(currentTrackIndex);
    if (userInteracted) audioPlayer.play().then(setPlayIconToPause).catch(setPlayIconToPlay);
}

function stopTrack() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    setPlayIconToPlay();
    if (currentTimeDisplay) currentTimeDisplay.textContent = '00:00';
    if (progressBar) progressBar.value = 0;
    
    if (cssVisualizer) cssVisualizer.classList.remove('active');
}

// ----------------- LÓGICA DE MODOS -----------------

function toggleRepeatMode() {
    const repeatIcon = repeatBtn.querySelector('i');
    
    if (repeatMode === "NONE") {
        repeatMode = "ALL";
        repeatIcon.className = 'fas fa-redo';
        repeatBtn.classList.add('active');
        audioPlayer.loop = false; 
    } else if (repeatMode === "ALL") {
        repeatMode = "ONE";
        repeatIcon.className = 'fas fa-redo-alt'; 
        repeatBtn.classList.add('active');
        audioPlayer.loop = true; 
    } else { // ONE
        repeatMode = "NONE";
        repeatIcon.className = 'fas fa-redo';
        repeatBtn.classList.remove('active');
        audioPlayer.loop = false;
    }
    console.log("Modo Repetir:", repeatMode);
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);

    const currentTrack = currentPlaylist[currentTrackIndex];

    if (isShuffled) {
        currentPlaylist = shuffleArray([...playlist]); 
        
        // Mantenemos la pista actual al inicio de la lista mezclada para una transición suave
        const currentIndexInShuffled = currentPlaylist.findIndex(t => t.src === currentTrack.src);
        if (currentIndexInShuffled !== -1) {
            currentPlaylist.splice(currentIndexInShuffled, 1);
            currentPlaylist.unshift(currentTrack);
        }
        currentTrackIndex = 0; 
    } else {
        // Volver a la lista original y encontrar el índice actual
        currentPlaylist = [...playlist];
        currentTrackIndex = currentPlaylist.findIndex(t => t.src === currentTrack.src);
        if (currentTrackIndex === -1) currentTrackIndex = 0;
    }
    
    renderPlaylist();
    highlightCurrentTrack(); 
    console.log("Modo Aleatorio:", isShuffled);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------- TIEMPO / BARRA DE PROGRESO -----------------
function updateTime() {
    if (!isNaN(audioPlayer.duration) && audioPlayer.duration !== Infinity) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        
        if (progressBar) {
            if (!progressBar.isDragging) {
                progressBar.value = percentage;
            }
            // Esto actualiza el color de relleno de la barra de progreso
            progressBar.style.setProperty('--progress-value', `${percentage}%`);
        }
    }
}

function seekTo() {
    if (progressBar && !isNaN(audioPlayer.duration) && audioPlayer.duration !== Infinity) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
}


// ----------------- INICIALIZACIÓN Y EVENTOS -----------------
window.addEventListener('load', () => {
    if (volumeControl) audioPlayer.volume = Number(volumeControl.value);

    if (playlist.length > 0) {
        prefetchDurations().then(() => {
            loadTrack(currentTrackIndex);
        });
    } else {
        trackTitle.textContent = 'ERROR: Lista vacía';
    }

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (nextBtn) nextBtn.addEventListener('click', playNextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (stopBtn) stopBtn.addEventListener('click', stopTrack);
    
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeatMode);

    audioPlayer.addEventListener('timeupdate', updateTime);
    audioPlayer.addEventListener('ended', () => {
        // Si loop es true (repeatMode="ONE"), el navegador lo manejará
        if (!audioPlayer.loop) {
            playNextTrack();
        }
    }); 

    if (progressBar) {
        progressBar.isDragging = false;
        
        const startSeek = () => { progressBar.isDragging = true; };
        const endSeek = () => {
            progressBar.isDragging = false;
            seekTo(); 
            // Si el usuario estaba buscando (seeking) y el audio estaba pausado, lo reproduce
            if (userInteracted && audioPlayer.paused) {
                audioPlayer.play().then(setPlayIconToPause).catch(setPlayIconToPlay);
            }
        };
        
        progressBar.addEventListener('mousedown', startSeek);
        progressBar.addEventListener('touchstart', startSeek);
        progressBar.addEventListener('mouseup', endSeek);
        progressBar.addEventListener('touchend', endSeek);
        
        progressBar.addEventListener('input', () => {
            if (currentTimeDisplay && !isNaN(audioPlayer.duration)) {
                 const previewTime = (progressBar.value / 100) * audioPlayer.duration;
                 currentTimeDisplay.textContent = formatTime(previewTime);
            }
            progressBar.style.setProperty('--progress-value', `${progressBar.value}%`);
        });
    }

    if (volumeControl) volumeControl.addEventListener('input', () => {
        audioPlayer.volume = Number(volumeControl.value);
    });

});





