let affichage = document.getElementById("affichage");
let freqSelection = document.getElementById("time");
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

async function getDataEarthquakes(freq="hour", type="all") { // les valeurs ("freq et "type") sont définies par défaut pour retourner tous les séismes de l'heure précédente
    let option_freq=["hour", "day", "week", "month"];
    let option_type=["significant", "1.5", "2.5", "4.5", "all"];
    if (!option_freq.includes(freq) || !option_type.includes(type)) {
        console.log("La fonction getData() n'a pas été appelée avec les bons paramètres.")
        return []
    }

    let url=`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${freq}.geojson`;
    // console.log("url", url);
    let data = await fetch(url);
    let response = await data.json();
    
    let earthquakes = response.features
    // console.log("earthquakes", earthquakes)
    let dataEarthquakes = []; // je renverrai ce tableau d'objets qui auront les propriétés dont on a besoin
    for (let i=0; i<earthquakes.length; i++) {
        let e = earthquakes[i];
        const dataEarthquake = { // on peut ajouter des propriétés en fonction de nos besoins
            id: e.id,
            mag: e.properties.mag,
            place: e.properties.place,
            date: new Date(e.properties.time),
            coordinates: e.geometry.coordinates
        }
        dataEarthquakes.push(dataEarthquake);
    }
    //ALTERNATIVE AVEC FOR EACH
    // earthquakes.forEach(e => {
    //     const dataEarthquake = { // on peut ajouter des propriétés en fonction de nos besoins
    //         id: e.id,
    //         mag: e.properties.mag,
    //         place: e.properties.place,
    //         date: new Date(e.properties.time),
    //         coordinates: e.geometry.coordinates
    //     }
    //     dataEarthquakes.push(dataEarthquake);
    // })
    // console.log("dans la fonction", dataEarthquakes)
    return dataEarthquakes;
}

function getMagnitudes(dataEarthquakes) {
    return dataEarthquakes.map(e => e.mag);
}

async function main() {
    let dataArr = await getDataEarthquakes();
    // console.log("infos seismes", dataArr);
    let magnitudes = getMagnitudes(dataArr);
    console.log("magnitudes", magnitudes);
}

function getCoordinates(dataEarthquakes) {
    return dataEarthquakes.map(e => e.coordinates);

}

async function mainCoordinates (freq="hour") {
    let dataCoord = await getDataEarthquakes(freq);
    let coordinates = getCoordinates(dataCoord);
    console.log("coordinates", coordinates)

    for (let i=1; i<coordinates.length; i++) {
        
        drawEarthquake(map, coordinates[i][0], coordinates[i][1], "blue");

    }

    drawEarthquake(map, coordinates[0][0], coordinates[0][1], "red");
}

function drawEarthquake(mapDisplayed, longitude, latitude, color) {
    let circle = L.circle([latitude, longitude], {
        // className: 'pulse',
        color: color,
        fillColor: color,
        fillOpacity: 1,
        radius: 2000
    }).addTo(mapDisplayed);

    let circle1 = L.circle([latitude, longitude], {
        className: 'pulse1',
        color: color,
        // fillColor: '#f03',
        fillOpacity: 0,
        radius: 5000
    }).addTo(mapDisplayed);

    let circle2 = L.circle([latitude, longitude], {
        className: 'pulse2',
        color: color,
        // fillColor: '#f03',
        fillOpacity: 0,
        radius: 10000
    }).addTo(mapDisplayed);
}




var map = L.map('map').setView([51.505, -0.09], 2);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom : 8,
    minZoom : 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// main() 
mainCoordinates();

freqSelection.addEventListener("click", function(e) {
    // console.log(this.value);
    mainCoordinates(this.value)
})