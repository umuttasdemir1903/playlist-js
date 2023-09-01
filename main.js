/* elementlere ulasma - obje olusturma*/
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('play-list')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('play-list-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('play-list-songs')

const currentProgress = document.getElementById('current-progress')

let index;
let loop;

const songsList = [
    {
        name: "Yıllar Utansın",
        link: "assets/music/Yıllar Utansın.mp3",
        artist: "Müslüm Gürses",
        image: "assets/images/müslüm-1.jpeg"
    },
    {
        name: "Duygularim",
        link: "assets/music/duygularım.mp3",
        artist: "Azer Bülbül",
        image: "assets/images/azer-1.jpeg"
    },
    {
        name: "Adını Sen Koy",
        link: "assets/music/Adını Sen Koy.mp3",
        artist: "Müslüm Gürses",
        image: "assets/images/müslüm-2.jpeg"
    },
    {
        name: "Sen Affetsen",
        link: "assets/music/Sen Affetsen.mp3",
        artist: "Bergen",
        image: "assets/images/bergen.jpeg"
    },
    {
        name: "Bir Güzele Gönül Verdim",
        link: "assets/music/Bir Güzele Gönül Verdim.mp3",
        artist: "Azer Bülbül",
        image: "assets/images/azer-2.jpeg"
    }]

let events = {
    mouse: {
        click:"click"
    },
    touch:{
        click:"touchstart"
    }
}

let deviceType =""

const isTouchDevice = ()=> {
    try {
        document.createEvent('TouchEvent');
        deviceType = "touch";
        return true;
    }catch(err) {
        deviceType="mouse";
        return false;

    }
}

//zaman formatlama

const timeFormatter = (timeInput) => {
    let minute=Math.floor(timeInput/60);
    minute = minute<10 ? "0"+minute : minute;
    let second =Math.floor(timeInput%60);
    second = second<10 ? "0"+ second : second;
    return minute +":" + second;
}

//set songs

const setSong = (arrayIndex) => {
    let{name, link, artist, image} = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML=name;
    songArtist.innerHTML = artist;
    songImage.src = image;
    //süreyi göster
    audio.onloadedmetadata = ()=> {
        maxDuration.innerHTML = timeFormatter(audio.duration);
       
    }
    playListContainer.classList.add("hide");
    playAudio();
}

// şarkıyı oynat
const playAudio = () => {
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide")
}

//şarkıyı tekrar et
repeatButton.addEventListener("click",()=> {
    if(repeatButton.classList.contains("active")) {
        repeatButton.classList.remove("active");
        audio.loop = false;
    }else {
        repeatButton.classList.add("active");
        audio.loop = true
    }
})

//sonraki şarkıya git

const nextSong = () => {
    currentProgress.style.width =0;
    //eğer loop açıksa 
    if(loop) {
        if(index==(songsList.length-1)) {
            index=0;
        }else {
            index++;
        }
        setSong(index);
    }else {
        let randomIndex = Math.floor((Math.random())*songsList.length);
    
        setSong(randomIndex);
    }
}

//sarkıyı durdur

const pauseAudio =() => {
    audio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
}

//önceki şarkıya geç

const previousSong = () => {
    currentProgress.style.width=0;
    if(index>0) {
        pauseAudio()
        index--;
    }else {
        index = songsList.length-1;
    }
    setSong(index);
}

//sıradakine geç

audio.onended = () => {
    nextSong()
}

//shuffle song 

shuffleButton.addEventListener("click",()=> {
    if(shuffleButton.classList.contains("active")) {
        shuffleButton.classList.remove("active");
        loop =true
    }else {
        shuffleButton.classList.add("active");
        loop= false;
    }
})

//playbtn
playButton.addEventListener("click",playAudio);

nextButton.addEventListener("click",nextSong);

pauseButton.addEventListener("click",pauseAudio);

prevButton.addEventListener("click",previousSong);

isTouchDevice()

progressBar.addEventListener(events[deviceType].click,(event)=> {
    let coordStart = progressBar.getBoundingClientRect().left

    //farre ile dokunma
    let coordEnd = !isTouchDevice() ? event.clientX :event.touches[0].clientX
    let progress = (coordEnd-coordStart) / progressBar.offsetWidth

    //genişliği ata
    currentProgress.style.width = progress*100+"%";

    //zamanı ata
    audio.currentTime = progress*audio.duration

    playAudio()
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
})

//zmaan aktıkça güncelle
setInterval(()=> {
    currentTimeRef.innerHTML= timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3))*100 + "%";

},1000)

//zaman
audio.addEventListener("timeupdate",()=> {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

window.onload = () => {
    index=0;
    setSong(index)
    initPlayList()
}

const initPlayList = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `
    <li class = "play-list-song" onclick= "setSong(${i})">
        <div class= "play-list-image-container">
            <img class="list-image" src="${songsList[i].image}"/> 
        </div>
        <div class= "play-list-details">
        <span id = "play-list-song-name">${songsList[i].name}</span> <br>
        <span id = "play-list-song-album">${songsList[i].artist}</span>
    </div>   
    </li>    
        ` 
    }
}
//sarkı listesini göster
playListButton.addEventListener("click", ()=> {
    playListContainer.classList.remove("hide");
})

//sarkı listesini kapat
closeButton.addEventListener("click",()=> {
    playListContainer.classList.add("hide")
})
