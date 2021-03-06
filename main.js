const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const MusicStore = require("./MusicDataStore")
const fs = require("fs");
const path = require("path")

const appDataPath = app.getPath("userData")

class AppWindow extends BrowserWindow {
  constructor(config, fileLoacation) {
    const baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    }
    const finalConfig = { ...baseConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLoacation)
    this.once("ready-to-show", () => {
      this.show()
    })
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, "./renderer/index.html")
  let addWindow;

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.send("get-tracks", musicStore.getTracks());
  })
  const musicStore = new MusicStore({"name": "musicData"})

  ipcMain.on("add-music-window", () => {
    addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow,
      modal: true
    }, "./renderer/add.html")
  })
  ipcMain.on("choose-music-file", (event) => {
    dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }).then(result => {
      if (result.canceled === false) {
        event.sender.send("choosed-file-pathes", result.filePaths)
      }
    })
  })
  ipcMain.on("import-music-files", (_, filePathes) => {
    const updateTracks = musicStore.addTracks(filePathes).getTracks()
    mainWindow.send("get-tracks", updateTracks);
    addWindow.close()

    // const musicDir = appDataPath + "/musics"
    // fs.access(musicDir, (error) => {
    //   if (error) {
    //     fs.mkdir(musicDir, () => {})
    //   }
    // })
    
    // filePathes.forEach(filePath => {
    //   const content = fs.readFileSync(filePath)
    //   const saveFilePath = path.join(musicDir, path.basename(filePath))
    //   console.log(content)
    //   fs.writeFile(saveFilePath ,content, () => {})
    // })

  })
  ipcMain.on("delete-music", (_, id) => {  
    musicStore.deleteTrack(id)
    mainWindow.send("get-tracks", musicStore.getTracks());
  })

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

})
