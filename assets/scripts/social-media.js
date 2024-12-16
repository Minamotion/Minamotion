document.addEventListener("DOMContentLoaded",async ()=>{
    await fetch("/assets/data/social-media-links.json").then(response=>response.json()).then((array)=>{
        array.forEach((data)=>{
            const element = `<a href="${data.link}" title="${data.title}"><img src="/assets/images/link-icons/${data.icon}.png" width=100></img></a>`
            document.getElementById("socialmedia").innerHTML += element
        })
    })
})