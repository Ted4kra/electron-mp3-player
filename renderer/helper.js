exports.$ = (id) => {
    return document.getElementById(id);
}

exports.convertDuration = (duration) => {
    const minute = "0" + Math.floor(duration / 60)
    const second = "0" + Math.floor(duration - minute * 60)
    return minute.substr(-2) + ":" + second.substr(-2)
}