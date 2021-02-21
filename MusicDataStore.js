const Store = require("electron-store")
const { v4: uuidv4 } = require('uuid');
const path = require("path")

class DataStore extends Store {
    constructor(settings) {
        super(settings)
        this.tracks = this.get("tracks") || []
    }

    saveTracks() {
        this.set("tracks", this.tracks)
        return this
    }

    getTracks() {
        return this.get("tracks") || []
    }

    addTracks(filePathes) {

        const tracksProps = filePathes.map(track => {
            const item = {
                id: uuidv4(),
                path: track,
                fileName: path.basename(track)
            }
            return item
        }).filter(track => {
            const exists = this.getTracks().map(t => t.path)
            return exists.indexOf(track.path) < 0
        })
        
        this.tracks = [ ...this.tracks, ...tracksProps]
        return this.saveTracks()
    }
    deleteTrack(trackID) {
        if (trackID) {
            this.tracks = this.tracks.filter( track => track.id !== trackID)
            this.saveTracks()
        }
    }
}

module.exports = DataStore