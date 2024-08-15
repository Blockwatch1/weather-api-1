require("dotenv").config();
async function getResponse(searchTerm) {
    try{
    const key = await getKey();
    if (key===null){
        throw err("Failed to get server key (local error code: 402)");
    }
    let st = String(searchTerm).replaceAll(" ","").toLowerCase();
    const response = await fetch("http://api.weatherapi.com/v1/current.json?key="+key+"&q="+st,{mode:'cors'});  
    const formattedResponse = await response.json();
    return formattedResponse;
    }
    catch(err){
        alert("Server Error: "+err.message);
        return null;
    }
}
async function getKey() {
    try{
        return process.env.KEY;
    } catch (err){
        return null;
    }
}
let metric = true;
async function displayResponse(searchTerm, nberrors) {
    const locationDisplay = document.getElementById("location-display");
    let locationDisplayValueTemp = locationDisplay.textContent;
    try{
    const contentDiv = document.querySelector("#content");
    contentDiv.style.opacity=  "0";
    const response = await getResponse(searchTerm);
    const weatherIcon = document.getElementById("weather-icon");
    const weatherStateText = document.getElementById("weather-text");
    const temperatureH3 = document.getElementById("temperature");
    const temperatureFeels = document.getElementById("temperature-feels");
    
    const humidityDisplay = document.getElementById("humidity");
    const UV_IndexDisplay = document.getElementById("UV-index");
    const precipitaionDisplay = document.getElementById("precipitation");
    const windSpeedDisplay = document.getElementById("windSpeed");
    const cloudCoverDisplay =  document.getElementById("cloud-cover");
    // const switchUnitsButton = document.getElementById("switch-units");
    humidityDisplay.textContent= `Humidity : ${response.current.humidity}%`;
    UV_IndexDisplay.textContent = `UV Index : ${response.current.uv}`;
    precipitaionDisplay.textContent = metric? `Precipitation : ${response.current.precip_mm}mm`:`Precipitation : ${response.current.precip_in}in` ;
    windSpeedDisplay.textContent = metric? `Wind Speed : ${response.current.wind_kph}Km/h °${response.current.wind_degree} ${response.current.wind_dir}`:`Wind Speed : ${response.current.wind_mph}Mi/h °${response.current.wind_degree} ${response.current.wind_dir}`;
    cloudCoverDisplay.textContent = `Cloud Cover : ${response.current.cloud}%`;
    weatherIcon.src = response.current.condition.icon;
    weatherStateText.textContent = response.current.condition.text;
    temperatureH3.textContent = metric? response.current.temp_c+"°C" : response.current.temp_f+"°F";
    temperatureFeels.textContent = metric? `Feels like : ${response.current.feelslike_c}°C`: `Feels like : ${response.current.feelslike_f}°F`;
    locationDisplay.textContent= response.location.name +", "+response.location.country;
    contentDiv.style.opacity=  "1";
    console.log(response); 
    }catch(err){
        if(nberrors===0){
            console.log(locationDisplayValueTemp);
            nberrors++;
            alert("Server Error : Location not found (405)");
            displayResponse(locationDisplayValueTemp,nberrors);
        }
        else{
            alert("Server Error : Cannot Fetch");
        }
    } 
    
}
const searchButton = document.querySelector("#searchButton");
const searchBar = document.querySelector("#search");
searchButton.addEventListener("click", function(){

 const searchTerm = searchBar.value;
 displayResponse(searchTerm,0);

});
displayResponse("London");


