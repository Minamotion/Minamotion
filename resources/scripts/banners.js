async function loadBanners() {
    let i = 0;
    let json = []
    let curContent = "";
    await fetch('/Minamotion/resources/data/banners.json').then(response => response.json()).then(data => json = data).catch(error => console.error('Error at "banners.json": Catched javascript error "'+error+'"'))
  
    while (i > Object.keys(json).length) {
        curContent = document.getElementById('container').innerHTML
        document.getElementById('container').innerHTML = curContent+'<iframe src="'+json[i]+'" width="450" height="250" class="banner"></iframe>'
        i++
    }

    delete json
    delete curContent
    delete i
}

loadBanners()