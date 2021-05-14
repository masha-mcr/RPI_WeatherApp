async function changeBackground() {
    const key = {secret_key}
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=landscape&client_id=${key}`
    let response
    try {
        response = await fetch(url)
    } catch (e) {
        console.log(e)
        return
    }
    const data = await response.json()
    let imageUrl = data.urls.regular
    console.log(imageUrl)
    let image = new Image()
    image.src = imageUrl
    document.getElementById("main").style.cursor = "wait";
    localStorage.setItem("currentImageUrl", imageUrl)
    console.log(imageUrl)
    image.onload = () => {
        if (!(image.complete && image.naturalHeight !== 0)) {
            imageUrl = "img/bg1.png"
        }
        document.getElementById("main").style.backgroundImage =
            `linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.55)), url("${imageUrl}")`
        document.getElementById("main").style.cursor = "default";
    }
}