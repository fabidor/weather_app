const CELSIUS = 273.15;
const button = document.getElementById("submit");
const C = document.getElementById('c');
const F = document.getElementById('f');

async function getWeather(location){
    try{
        const data = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${location},uk&APPID=bd7d46657e91a0b5f9d81d84884067e3`, {mode:'cors'}) ;
        const nicedata = await data.json();
        console.log(nicedata);
        return nicedata;
    } catch{
        console.log(Error);
    }
}

class weatherHolder{
    constructor(name, temperature, feelsLike, humidity, weather, weatherDescriptor, wind, sunrise, sunset){
        this.name = name;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.weather = weather;
        this.weatherDescriptor = weatherDescriptor;
        this.humidity = humidity;
        this.wind = wind;
        this.sunrise = sunrise;
        this.sunset=sunset;
    }
    get name(){
        return this._name;
    }
    set name(value){
        this._name=value;
    }
    get temperature(){
        return this._temperature;
    }
    set temperature(value){
        this._temperature = value;
    }
    get feelsLike(){
        return this._feelsLike;
    }
    set feelsLike(value){
        this._feelsLike = value;
    }
    get humidity(){
        return this._humidity;
    }
    set humidity(value){
        this._humidity = value;
    }
    get weather(){
        return this._weather;
    }
    set weather(value){
        this._weather = value;
    }
    get wind(){
        return this._wind;
    }
    set wind(value){
        this._wind=value;
    }
    get sunrise(){
        return this._sunrise;
    }
    set sunrise(value){
        this._sunrise=value
    }
    get sunset(){
        return this._sunset;
    }
    set sunset(value){
        this._sunset=value;
    }
    get weatherDescriptor(){
        return this._weatherDescriptor;
    }
    set weatherDescriptor(value){
        this._weatherDescriptor = value;
    }
}

const tempType = (type) =>{
    const gettype = () => type;
    const settype = (val) => type=val;
    return {gettype, settype};
}
const temptype = tempType('C');

function getTemp(dataTemp){
    if(temptype.gettype() == 'C'){
        return `${Math.round(dataTemp - CELSIUS)}°C`;
    } else if(temptype.gettype() == 'F'){
        return `${Math.round(1.8*(dataTemp - CELSIUS)+32)}°F`;
    }
}

function convertTime(timeStamp){
    let unixStamp = timeStamp;
    const date = new Date(unixStamp*1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10){
        minutes = '0'+minutes;
    }
    let time = `${hours}:${minutes}`
    return time; 
}
function parseWeather (data){
    try{
        const name = data.name;
        const temp = getTemp(data.main.temp);
        const feelsLike = getTemp(data.main.feels_like);
        const weather = data.weather[0].main;
        const weatherDescriptor = data.weather[0].description;
        const humidity= data.main.humidity;
        const wind = `${data.wind.speed}kph`;
        const sunrise = convertTime(data.sys.sunrise);
        const sunset = convertTime(data.sys.sunset);
        const weatherClass = new weatherHolder(name, temp, feelsLike, humidity, weather, weatherDescriptor, wind, sunrise, sunset);
        return weatherClass;
    }
    catch(error){
        console.log("Get Wrecked");
    }
    
    
}

function displayWeather(weatherHolder){
    document.querySelector('.errorBox').textContent="";
    try{
        const city = document.getElementById('place');
        const temperature = document.getElementById('temperature');
        const symbol = document.getElementById('symbol');
        const feelslike = document.getElementById('feelslike');
        const humidity = document.getElementById('humidity');
        const wind = document.getElementById('wind');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');

        city.innerHTML = weatherHolder.name;
        temperature.innerHTML = weatherHolder.temperature;
        feelslike.innerHTML = weatherHolder.feelsLike;
        wind.innerHTML = weatherHolder.wind;
        humidity.innerHTML = `${weatherHolder.humidity}%`
        sunrise.innerHTML = weatherHolder.sunrise;
        sunset.innerHTML = weatherHolder.sunset;
        symbol.innerHTML = `<img src=${chooseSymbol(weatherHolder.weather, weatherHolder.weatherDescriptor)}>`

    }
    catch(error){
        document.querySelector('.errorBox').textContent = "City Not Found. Try Again";
    }
}
function chooseSymbol(weather, description){
    if(weather == 'Clear' || (weather == 'Clouds' && (description == 'few clouds' || description == 'scattered clouds' || description =='broken clouds'))){
        return './weatherSymbols/bigclear.png'
    } else if(weather == 'Clouds'){
        return './weatherSymbols/bigclouds.png'
    } else if(weather == 'Thunderstorm'){
        return './weatherSymbols/bigthunder.png'
    } else if(weather == 'Drizzle'){
        return './weatherSymbols/bigdrizzle.png';
    } else if(weather == 'Rain'){
        return './weatherSymbols/bigrain.png'
    } else if (weather == 'Snow'){
        return './weatherSymbols/bigsnow.png';
    } else if(weather == 'Tornado'){
        return './weatherSymbols/bigtornado.png'
    } else{
        return './weatherSymbols/bighaze.png'
    }
}

function newWeather(){
    let city = document.getElementById('city').value;
    if(city == ""){
        city = "Chicago, IL";
    }
    getWeather(city)
    .then((data => parseWeather(data)))
    .then((weatherHolder => displayWeather(weatherHolder)));
   
    
    
    
}

getWeather('Chicago, IL')
    .then ((data) => parseWeather(data))
        .then((weatherHolder) => displayWeather(weatherHolder));

button.onclick = () =>{
    newWeather();
    event.preventDefault();
};

C.addEventListener('click', () => {
    if(temptype.gettype() != 'C'){
        temptype.settype('C');
        newWeather();
    }
    
});

F.addEventListener('click', () => {
    if(temptype.gettype() != 'F'){
        temptype.settype('F');
        newWeather();
    }
    
})

 




