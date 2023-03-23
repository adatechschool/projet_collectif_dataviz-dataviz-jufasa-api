let affichage = document.getElementById("affichage");
const urlBase = "https://earthquake.usgs.gov/fdsnws/event/1/"

async function display(){
    let data = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson") 

    let response = await data.json();
    console.log(response);

    let seismes = response.features
    console.log(`Dans l'heure précédente, il y a eu ${seismes.length} séismes.`)
    seismes.forEach(seisme => {
        let id = seisme.id;
        let place = seisme.properties.place;
        let mag = seisme.properties.mag;
        let date = new Date(seisme.properties.time);
        let dateStr = dateToString(date);

        console.log(`(id=${id}) Un séisme à ${place}, le ${dateStr}, de magnitude ${mag}`)

        
    });

    let lastEarthquake = seismes[0]
    let place = lastEarthquake.properties.place
    let mag = lastEarthquake.properties.mag
    let dateStr = dateToString(new Date(lastEarthquake.properties.time))

    affichage.innerHTML = `Un séisme à ${place}, le ${dateStr}, de magnitude ${mag}`
}

function dateToString(date) {
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    return `${day}/${month}/${year} à ${hour}h${minute}`
}
display()