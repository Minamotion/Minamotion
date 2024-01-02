let repoArray = ["congratscard", "Minamotion", "thegameplace"] // Update when new repository is created
let idx = 0

while (idx < Object.keys(repoArray).length) {
    if("/"+repoArray[idx] === this.location.pathname){
        this.location.assign("https://minamotion.github.io/"+repoArray[idx]+"/index.html")
        break;
    }
    idx++
}

console.warn('If you\'re searching for a repository use "minamotion.github.io" instead of "minamotion.org"')