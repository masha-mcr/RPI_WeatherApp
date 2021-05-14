async function init() {
   //localStorage.clear()
    await changeWeatherData()
    if(!localStorage.getItem('currentTimeZone')){
        localStorage.setItem("currentTimeZone", MINSK_TIME_SHIFT.toString())
    }

    const options = {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC"
    };

    const setTime = () => {
        let currentUTCTime = Date.now()
        console.log(localStorage.getItem("currentTimeZone"))
        let timeShift = localStorage.getItem("currentTimeZone") || MINSK_TIME_SHIFT
        let date = new Date(currentUTCTime + parseInt(timeShift))
        document.getElementById("datetime").textContent =
            date.toLocaleDateString('ru-Ru', options).replaceAll(",", "")
    }

    const setDate = () => {
        let currentUTCTime = Date.now()
        let timeShift = localStorage.getItem("currentTimeZone")
        const setNextDayName = (index) => {
            document.getElementById(`next-day__title${index}`).textContent =
                new Date(currentUTCTime + parseInt(timeShift) + index * MILLISECONDS_IN_DAY)
                    .toLocaleDateString("ru-RU", {weekday: "long"})
        }
        setNextDayName(1)
        setNextDayName(2)
        setNextDayName(3)
    }

    setTime()
    setDate()
    setInterval(setTime, 300)
    setInterval(setDate, 300)
    document.getElementById("header__searchbar").onsubmit = (e) => {
        e.preventDefault()
        changeWeatherData()
        document.getElementById("header__input").value = ""
    }
    if(!localStorage.getItem("currentImageUrl")){
        localStorage.setItem("currentImageUrl", "img/bg1.png")
    }
    let imageUrl = localStorage.getItem("currentImageUrl")
    document.getElementById("main").style.backgroundImage =
        `linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.55)), url("${imageUrl}")`
}