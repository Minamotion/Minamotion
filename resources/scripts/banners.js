window.addEventListener('load', function(){
    let i = 0;
    let json_parsed = []
    fetch('/Minamotion/resources/data/banners.json')
        .then(response => response.json())
        .then(data => json_parsed = data)
  
    while (i > Object.keys(json_parsed).length) {
        let curContent = document.getElementById('container').innerHTML
        document.getElementById('container').innerHTML = curContent+'<embed src="'+json_parsed[i].url+'" width="450" height="250" id="banner_'+json_parsed[i].name+'">'
        delete curContent
    }
})