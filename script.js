const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantLocationAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const errorfound = document.querySelector('[data-errorfound]');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = userTab;
currentTab.classList.add('current-tab');
getfromSessionStorage();




function getfromSessionStorage(){
    const localcoordinates= sessionStorage.getItem('user-coordinates');
    if(!localcoordinates){
        //now show Grant access container
        grantLocationAccess.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert('Browser Not Supported');
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantLocationAccess.classList.remove('active');
    loadingScreen.classList.add('active');
    errorfound.classList.remove("active");

    //api call

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorfound.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        errorfound.classList.add("active");
    }
}

grantAccessButton.addEventListener("click", getLocation);

userTab.addEventListener('click',()=>{
    if(currentTab != userTab){
        currentTab.classList.remove('current-tab');
        currentTab = userTab;
        currentTab.classList.add('current-tab');
        searchForm.classList.remove('active');
        errorfound.classList.remove("active");
        getfromSessionStorage();
        userInfoContainer.classList.add('active');
    }
})

searchTab.addEventListener('click',()=>{
    if(currentTab != searchTab){
        currentTab.classList.remove('current-tab');
        currentTab = searchTab;
        currentTab.classList.add('current-tab');
        searchForm.classList.add('active');
        grantLocationAccess.classList.remove('active');
        errorfound.classList.remove("active");
        userInfoContainer.classList.remove('active');
    }
})


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantLocationAccess.classList.remove("active");
    errorfound.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log(data);
        if(data.cod != "404")
        renderWeatherInfo(data);

        else {
            userInfoContainer.classList.remove("active");
            errorfound.classList.add("active");
        }
    }
    catch(err) {
        //hw
    }
}


function renderWeatherInfo(data){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;
}