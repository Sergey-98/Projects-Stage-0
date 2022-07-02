`use strict`;

import playlist from './components/playList.js';

const audio = document.querySelector('audio');
const page = document.querySelector('.page');
const poster = document.querySelector('.poster');
const play = document.querySelector('.play');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const artist = document.querySelector('.artist');
const songTitle = document.querySelector('.song-title');
const current = document.querySelector('.current');
const duration = document.querySelector('.duration');
const progress = document.querySelector('.progress-song');
const nowSong = document.querySelector('.now-song');
const allSong = document.querySelector('.all-song');
let list = document.querySelector('.list');
const vol = document.querySelector('.volume');
const hamburger = document.querySelector('.hamburger');
const playListPage = document.querySelector('.play-list');
const mute = document.querySelector('.vol-mute');

let isPlay = false;
let isSound = true;
let playlistLength = Object.keys(playlist).length;
let numberPlay = 0;
let nowSound = playlist[numberPlay].src;
let artistSong = playlist[numberPlay].artist;
let title = playlist[numberPlay].title;
let songPoster = playlist[numberPlay].poster;
let background = playlist[numberPlay].backPoster;
let audioTime = 0;
let audioLength;
let minutes;
let second;
let seconds;
let changeVolume;
let Play;
//------------
for (let i = 0; i < playlistLength; i++) {
    let li = document.createElement('li');
    li.className = "new-artist";
    li.textContent = `${playlist[i].artist}. (${playlist[i].title})`;
    list.append(li);
}
let newArtist = document.querySelectorAll('.new-artist');
//------------
audio.src = nowSound;
poster.style.backgroundImage = playlist[numberPlay].poster;
page.src = playlist[numberPlay].backPoster;
allSong.textContent = playlistLength;
nowSong.textContent = numberPlay + 1;

function songData(number) {
    audio.src = playlist[number].src;
    artist.textContent = playlist[number].artist;
    songTitle.textContent = playlist[number].title;
    poster.style.backgroundImage = playlist[number].poster;
    page.src = playlist[number].backPoster;
}
audio.addEventListener('loadedmetadata', function() {
    audioLength = Math.round(audio.duration);
    let min = Math.floor(audio.duration / 60);
    let sec = Math.floor((audio.duration % 60));
    let secDuration = (sec < 10) ? `0${sec}` : sec;
    duration.textContent = `${Math.floor(audio.duration / 60)}:${Math.floor((audio.duration % 60))}`;
    duration.textContent = `${min}:${secDuration}`;
    progress.max = audioLength;
    artist.textContent = playlist[numberPlay].artist;
    songTitle.textContent = playlist[numberPlay].title;
});
function playAudio() {
    if (!isPlay) {
        nowSound = playlist[numberPlay].src;
        artistSong = playlist[numberPlay].artist;
        title = playlist[numberPlay].title;
        songPoster = playlist[numberPlay].poster;
        background = playlist[numberPlay].backPoster;
        nowSong.textContent = numberPlay + 1;
        if (artistSong.length > 15) {
            artist.style.cssText = 'white-space: nowrap; text-align: center; animation: text 10s infinite linear;';
        } else {
            artist.style.cssText = 'white-space: nowrap;'; 
        }
        audio.play();
        activeSong (numberPlay);
        play.style.backgroundImage = 'url(assets/svg/pause.svg)';
        poster.style.backgroundSize = "120%";
        poster.style.backgroundPosition = "center 35%";
        isPlay = true;
        Play = setInterval(function() {
            audioTime = Math.round(audio.currentTime);
            audioLength = Math.round(audio.duration);
            minutes = Math.floor(audio.currentTime / 60);
            second = Math.floor((audio.currentTime % 60));
            seconds = (second < 10) ? `0${second}` : second;
            progress.value = audio.currentTime;
            current.textContent = `${minutes}:${seconds}`;
            if (audioTime == audioLength) {
                playNext();
            }
        }, 1000);
        
    } else {
        audio.pause();
        play.style.backgroundImage = 'url(assets/svg/play.svg)';
        poster.style.backgroundSize = "100%";
        clearInterval(Play);
        isPlay = false;
    }
}
function soundAudio() {
    if (isSound) {
        changeVolume = audio.volume;
        audio.volume = 0;
        vol.value = 0;
        mute.style.backgroundImage = 'url(assets/svg/mute.svg)';
        isSound = false;
    } else {
        vol.value = changeVolume;
        audio.volume = changeVolume;
        mute.style.backgroundImage = 'url(assets/svg/unmute.svg)';
        isSound = true;
    }
}
function changeCurTime() {
    audio.currentTime = progress.value;
    minutes = Math.floor(audio.currentTime / 60);
    second = Math.floor((audio.currentTime % 60));
    seconds = (second < 10) ? `0${second}` : second;
    current.textContent = `${minutes}:${seconds}`;
}
progress.addEventListener('change',() => {
    changeCurTime();
})
vol.addEventListener('change',() => {
    audio.volume = vol.value;
})
mute.addEventListener('click',() => {
    soundAudio()
})
function playNext() {
    if (numberPlay >= playlistLength-1) {
        numberPlay = 0;    
    }
    else {
        numberPlay += 1;
    }
    isPlay = false;
    audio.currentTime = 0;
    progress.value = 0;
    songData(numberPlay);
    playAudio();
}


function playPrev() {
    if (numberPlay == 0) {
        numberPlay = playlistLength-1;
    }
    else {
        numberPlay -= 1;
    }
    isPlay = false;
    audio.currentTime = 0;
    progress.value = 0;
    songData(numberPlay);
    playAudio();
}

play.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('play')) {
        playAudio();
    }
});

next.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('next')) {
        playNext();
    }
});

prev.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('prev')) {
        playPrev();
    }
});

function activeSong (number) {
    newArtist.forEach((elem) => elem.classList.remove('active'));
    newArtist[number].classList.add('active');  
}

newArtist.forEach((art, index) => {
    art.addEventListener('click', (event) => {
        let target = event.target;
        if (target.classList.contains('new-artist')) {
            numberPlay = index;
            isPlay = false;
            audio.currentTime = 0;
            progress.value = 0;
            songData(numberPlay);
            playAudio();
            if (hamburger.classList.contains('active') && playListPage.classList.contains('active')) {
                hamburger.classList.remove('active');
                playListPage.classList.remove('active');  
            } else {
                hamburger.classList.add('active');
                playListPage.classList.add('active');  
            }
        }
    });
})
hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('active') && playListPage.classList.contains('active')) {
        hamburger.classList.remove('active');
        playListPage.classList.remove('active');  
    } else {
        hamburger.classList.add('active');
        playListPage.classList.add('active');  
    }
});
document.addEventListener('keydown', function(event) {
    if (event.code == 'Space') {
        if (isPlay) {
            isPlay = true;
            playAudio();
        } else {
            isPlay = false;
            playAudio();
        }
    }
});
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowRight') {
        audio.currentTime += 5;
    }
});
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowLeft') {
        audio.currentTime -= 5;
    }
});