document.addEventListener("DOMContentLoaded",async ()=>{
    let socialMediaLinks = []
    await fetch("https://minamotion.github.io/Minamotion/assets/data/social-media-links.json").then((response)=>{
        response.json()
    }).then((json)=>{
        socialMediaLinks = json
    })
    socialMediaLinks.forEach((data)=>{
        const element = `<a href="${data.link}" title="${data.title}"><img src="https://minamotion.github.io/Minamotion/assets/images/link-icons/${data.icon}.png"></img></a>`
        document.getElementById("socialmedia").innerHTML += element
    })
})