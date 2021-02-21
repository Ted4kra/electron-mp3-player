const { ipcRenderer } = require("electron")
const { $, convertDuration } = require("./helper")

const musicAudio = new Audio()
let allTracks = []
let currentTrack

$("add-music-button").addEventListener("click", () => {
    ipcRenderer.send("add-music-window")
})

const renderListHTML = (tracks) => {
    const trackList = $("track-list")
    const trackListItemsHtml = tracks.reduce((html, track) => {
        html += `<li class="row list-group-item d-flex justify-content-between align-items-center track-music">
            <div class="col-10">
                <i class="fas fa-music mr-2 text-secondary"></i>
                <b>${track.fileName}</b>
            </div>
            <div class="col-2">
                <i class="fas fa-play mr-3" data-id="${track.id}"></i>
                <i class="fas fa-trash" data-id="${track.id}"></i>
            </div>
        </li>`
        return html
    }, "")
    const emptyInnerHTML = "<div class='alert alert-primary'>还没有添加任何音乐，赶紧去添加吧～</div>"
    trackList.innerHTML = tracks.length ? `<ul class="list-group">${trackListItemsHtml}</ul>` : emptyInnerHTML
}

const renderPlayerHTML = (name, duration) => {
    const palyStatus = $("play-status")
    const html = 
    `<div class="col">
        正在播放${name}
    </div>
    <div class="col">
        <span id="current-seeker">0:00</span>/ ${convertDuration(duration)}
    </div>
    `
    palyStatus.innerHTML = html
}

const renderProgress = (second, total) => {
    const seeker = $("current-seeker")
    seeker.innerHTML = convertDuration(second)
    const palyerProgrss = $("player-progress")
    const progress = Math.floor(second / total * 100) + "%"
    palyerProgrss.style.width = progress
    palyerProgrss.innerHTML = progress
}

ipcRenderer.on("get-tracks", (_, tracks)  => {    
    renderListHTML(tracks)
    allTracks = tracks
    console.log("renderListHTML")
})

$("track-list").addEventListener("click", (element) => {
    element.preventDefault();
    const { dataset, classList } = element.target
    id = dataset && dataset.id
    
    if (id && classList.contains("fa-play")) {
        if (currentTrack && currentTrack.id === id) {
            musicAudio.play()
        }
        else {
            currentTrack = allTracks.find(track => track.id === id)
            musicAudio.src = currentTrack.path
            musicAudio.play()
            const resetIconElement = document.querySelector(".fa-pause")
            if (resetIconElement) {
                resetIconElement.classList.replace("fa-pause", "fa-play")
            }
        }
        classList.replace("fa-play", "fa-pause")
    }
    else if (id && classList.contains("fa-pause")) {
        musicAudio.pause()
        classList.replace("fa-pause", "fa-play")
    }
    else if (id && classList.contains("fa-trash")) {
        ipcRenderer.send("delete-music", id)
    }
})

musicAudio.addEventListener("loadedmetadata", () => {
    console.log("did load")
    renderPlayerHTML(currentTrack.fileName, musicAudio.duration)
})

musicAudio.addEventListener("timeupdate", () => {
    renderProgress(musicAudio.currentTime, musicAudio.duration)
})