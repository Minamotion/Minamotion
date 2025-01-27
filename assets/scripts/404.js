document.addEventListener("DOMContentLoaded", ()=>{
    const errmsg = document.getElementById("errmsg")
    errmsg.innerText = `This thing at "${window.location.href}" doesn't exist, did you misspell it, or are you just stupid?`
})