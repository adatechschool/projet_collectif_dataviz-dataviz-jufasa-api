
let timer = document.getElementById("timer")

const displayTime = async () => {

    let data = await fetch ("http://worldtimeapi.org/api/timezone/Europe/Paris")

    let response = await data.json();
    console.log(response);

    let values = response.datetime
    console.log(values)

    timer.innerHTML = values

    

}

setInterval(displayTime, 1000)