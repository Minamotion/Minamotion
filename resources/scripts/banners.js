let json = fetch('/Minamotion/resources/data/banners.json').then(response => response.json())
let curContent = ''
let i = 0

while (i < Object.keys(json).length) {
    curContent = document.getElementById('bannercontainer').innerHTML
    document.getElementById('bannercontainer').innerHTML = '<iframe src="'+json[i]+'" width="450" height="250" class="banner"></iframe>'
    i++
}

delete json
delete curContent
delete i