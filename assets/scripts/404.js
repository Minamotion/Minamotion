document.addEventListener("DOMContentLoaded", ()=>{
    const x = document.getElementById("errortxt")
    if (["/404.html","/404"].includes(window.location.pathname)) {
        x.innerText = 'Requested (404PAGE), is this what you were looking for?'
    } else {
        x.innerText = `Requested (LINK: "${window.location.href}"), received (404PAGE)`
    }
})