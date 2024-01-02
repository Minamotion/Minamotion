let repoArray = ["congratscard"]
let idx = 0

while (idx < Object.keys(repoArray).length) {
    if("/"+repoArray[idx] === this.location.pathname){
        this.location.assign("minamotion.github.io/"+repoArray[idx])
    }
}