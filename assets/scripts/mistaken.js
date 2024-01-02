let repoArray = ["congratscard", "Minamotion", "thegameplace"]
let idx = 0

while (idx < Object.keys(repoArray).length) {
    if("/"+repoArray[idx] === this.location.pathname){
        this.location.assign("minamotion.github.io/"+repoArray[idx])
        break;
    }
    idx++
}

console.warn('If you\'re searching for a repository use "minamotion.github.io" instead of "minamotion.org"')