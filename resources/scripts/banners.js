function loadBanners(data) {
    let curContent = ''
    let i = 0

    while (i < Object.keys(data).length) {
        curContent = document.getElementById('bannercontainer').innerHTML
        document.getElementById('bannercontainer').innerHTML = curContent+'<iframe src="'+data[i]+'" width="450" height="250" class="banner"></iframe>'
        i++
    }

    delete curContent
    delete i
}

fetch('/resources/data/banners.json').then(response => response.json()).then(data => loadBanners(data))