// I want users to have a secure connection so I made this script
document.addEventListener("DOMContentLoaded",()=>{
    const url = new URLSearchParams()
    if ((window.location.protocol !== 'https:') && !(url.has("unsafe"))) {
        localStorage.clear()
        sessionStorage.clear()
        setTimeout(() => {
            window.location.assign(`https://${window.location.host}${window.location.pathname}${window.location.search}`)
        }, 10)
    }
})