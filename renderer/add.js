const { ipcRenderer } = require("electron")
const { $ } = require("./helper")
const path = require("path")

let musicFilePathes = new Set();

$("select-music").addEventListener("click", () => {
    ipcRenderer.send("choose-music-file")
})

$("import-music").addEventListener("click", () => {
    ipcRenderer.send("import-music-files", Array.from(musicFilePathes))
})

function renderListHTML(filePaths) {
    const musicList = $("music-list");
    const musicItemsHTML = filePaths.reduce((html, musicPath) => {
        return html += `<li class="list-group-item">${path.basename(musicPath)}</li>`
    }, "")
    musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}

ipcRenderer.on("choosed-file-pathes", (_, filePaths) => {
    if (Array.isArray(filePaths)) {
        const fileSet = new Set(filePaths);
        musicFilePathes = new Set([...musicFilePathes, ...fileSet])
        renderListHTML(Array.from(musicFilePathes));
    }
})