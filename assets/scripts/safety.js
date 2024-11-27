// I want users to have a secure connection so I made this script
import { ez } from "https://minamotion.github.io/Minamotion/assets/scripts/ezget.js"
document.addEventListener("DOMContentLoaded",()=>{
    if (window.location.protocol !== 'https:') {
        localStorage.clear()
        sessionStorage.clear()
        setTimeout(() => {
            window.location.assign(`https://${ez.mylink()}`)
        }, 10)
    }
})