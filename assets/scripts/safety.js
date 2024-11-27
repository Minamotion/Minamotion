// I want users to have a secure connection so I made this script
document.addEventListener("DOMContentLoaded",()=>{
    if (window.location.protocol !== 'https:') {
        localStorage.clear()
        sessionStorage.clear()
        setTimeout(() => {
            window.location.assign(`https://${window.location.host}${window.location.pathname}${window.location.search}`)
        }, 10)
    }
})