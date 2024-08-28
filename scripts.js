const audio = document.querySelector("audio");
const playPauseBtn = document.getElementById("playPause");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const volumeBtn = document.getElementById("volume");
const themeToggleBtn = document.getElementById("themeToggle");
const shuffleBtn = document.getElementById("shuffle");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const trackList = document.getElementById("trackList");
const body = document.body;

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

let isPlaying = false;
let lastVolume = 1;
let isShuffling = false;
let currentTrackIndex = 0;

let tracks = [
    {
        src: "sapientdream - Pastlives (lyrics).mp3",
        title: "Pastlives",
        artist: "sapientdream"
    },
    {
        src: "Ember Island - Umbrella.mp3",
        title: "Umbrella",
        artist: "Ember Island"
    },
    {
        src: "Zariya - Khoya (feat. Aseem) [Official Audio].mp3",
        title: "Khoya",
        artist: "Zariya feat. Aseem"
    },
    {
        src: "La Haasil - Sunny Khan Durrani  Urdu Rap.mp3",
        title: "La Haasil",
        artist: "Sunny Khan Durrani"
    },
    {
        src: "Jon Bellion - All Time Low (Official Music Video).mp3",
        title: "All Time Low",
        artist: "Jon Bellion"
    },
];


audio.src = tracks[currentTrackIndex].src;
trackTitle.textContent = tracks[currentTrackIndex].title;
trackArtist.textContent = tracks[currentTrackIndex].artist;

function updateTrackList() {
    trackList.innerHTML = '';

    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('audio-container');
        trackElement.innerHTML = `<p class="track-info">${track.title} - ${track.artist}</p>`;

        trackElement.addEventListener("click", () => {
            playTrack(index);
        });

        trackList.appendChild(trackElement);
    });
}


function createWaterBubbleEffect() {
    const colors = ['red', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF66C4', '#00C2FF', '#FF5733'];
    let colorIndex = 0;

    function createBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.appendChild(bubble);

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        requestAnimationFrame(() => {
            bubble.classList.add('active');
        });

        setTimeout(() => {
            bubble.remove();
        }, 1500);
    }

    document.addEventListener("mousemove", (event) => {
        const x = event.clientX;
        const y = event.clientY;
        createBubble(x, y);
    });
}

function playTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[currentTrackIndex].src;
    trackTitle.textContent = tracks[currentTrackIndex].title;
    trackArtist.textContent = tracks[currentTrackIndex].artist;
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "";
}

function updatePlayPauseButton() {
    if (isPlaying) {
        playPauseBtn.innerHTML = '<i id="playPauseIcon" class="fas fa-pause"></i>';
    } else {
        playPauseBtn.innerHTML = '<i id="playPauseIcon" class="fas fa-play"></i>';
    }
}


function updateSeekBar() {
    const playedPercentage = (audio.currentTime / audio.duration) * 100;
    const playedColor = '#4CAF50'; 
    const unplayedColor = '#e1e1e1'; 

    seekBar.style.background = `linear-gradient(to right, ${playedColor} ${playedPercentage}%, ${unplayedColor} ${playedPercentage}%)`;
    seekBar.value = playedPercentage || 0;
}

function updateVolumeBar() {
    const volumePercentage = volumeBar.value;
    const filledColor = '#4CAF50'; 
    const emptyColor = '#e1e1e1'; 

    volumeBar.style.background = `linear-gradient(to right, ${filledColor} ${volumePercentage}%, ${emptyColor} ${volumePercentage}%)`;
}


seekBar.addEventListener("input", () => {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    updateSeekBar();
});

volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value / 100;
    lastVolume = audio.volume;
    updateVolumeBar();
});

audio.addEventListener('timeupdate', updateSeekBar);


function playPauseTrack() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.classList.remove("fa-pause");
        playPauseBtn.classList.add("fa-play");
    } else {
        audio.play();
        playPauseBtn.classList.remove("fa-play");
        playPauseBtn.classList.add("fa-pause");
    }
    isPlaying = !isPlaying;
}
playPauseBtn.addEventListener("click", playPauseTrack);

volumeBtn.addEventListener("click", () => {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
        volumeBtn.textContent = "";
    } else {
        audio.volume = lastVolume;
        volumeBar.value = lastVolume * 100;
        volumeBtn.textContent = "🔊";
    }
    updateVolumeBar();
});


themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
});


shuffleBtn.addEventListener("click", () => {
    isShuffling = !isShuffling;
    shuffleBtn.classList.toggle("active", isShuffling);

    if (isShuffling) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
        playTrack(currentTrackIndex);
    }
});


function nextTrack() {
    if (isShuffling) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    playTrack(currentTrackIndex);
}


document.getElementById("next").addEventListener("click", nextTrack);

document.getElementById("prev").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
});


searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
        alert("Please enter a search term.");
        return;
    }

    const foundIndex = tracks.findIndex(track => 
        track.title.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query)
    );

    if (foundIndex !== -1) {
        playTrack(foundIndex);
    } else {
        alert("Track not found.");
    }
});


window.addEventListener('load', () => {
    createWaterBubbleEffect();
    playTrack(0);
    updateTrackList();
    updateSeekBar();
    updateVolumeBar();
});
