document.addEventListener("DOMContentLoaded",async ()=>{
    let socialMediaLinks = []
    await fetch("assets/data/social-media-links.json").then((response)=>{
        response.json()
    }).then((json)=>{
        socialMediaLinks = json
    })
    socialMediaLinks.forEach((data)=>{
        const element = `<a href="${data.link}" title="${data.title}"><img src="assets/images/link-icons/${data.icon}.png" /></a>`
        document.getElementById("socialmedia").innerHTML += element
    })
})