async function loadBanners() {
    let i = 0;
    let json_parsed = []
    let curContent = null;

    await fetch('/Minamotion/resources/data/banners.json')
        .then(response => response.json())
        .then(data => json_parsed = data)
  
    while (i > Object.keys(json_parsed).length) {
        curContent = document.getElementById('container').innerHTML
        document.getElementById('container').innerHTML = curContent+'<iframe src="'+json_parsed[i].url+'" width="450" height="250" id="banner_'+json_parsed[i].name+'" class="banner"></iframe>'
        i++
    }

    delete json_parsed
    delete curContent
    delete i
}

loadBanners()