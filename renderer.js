// const { ipcRenderer } = require("electron")

// alert(process.versions.node)

// window.addEventListener("DOMContentLoaded", () => {
//     alert("dom ready")
//     ipcRenderer.send("message", "hello from renderer")
//     ipcRenderer.on("replay", (event, arg) => {
//         document.getElementById("message").innerHTML = arg;
//     })
// })

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {

  ipcRenderer.send("message", "hello from renderer1");

});