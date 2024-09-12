import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
  

const app = express();
const port = 3000;


const cityListJSON = '{"Leiria":{"Latitude":"39.74953536779671","Longitude":"-8.807594590334055"},"Bragança":{"Latitude":"41.806114279509465","Longitude":"-6.756750293690284"},"Braga":{"Latitude":"41.545448959897435","Longitude":"-8.42726141603376"},"Lisboa":{"Latitude":"38.7221958605147","Longitude":"-9.139325255701255"},"Coimbra":{"Latitude":"40.203310447203854","Longitude":"-8.410271611819436"},"Porto":{"Latitude":"41.157929759046205","Longitude":"-8.629094639566766"},"Santarém":{"Latitude":"39.23663058305848","Longitude":"-8.68606685425665"},"Vila Real":{"Latitude":"41.30101040820514","Longitude":"-7.742222496380777"},"Viseu":{"Latitude":"40.65658174252874","Longitude":"-7.912473572002833"},"Évora":{"Latitude":"38.571430541646805","Longitude":"-7.913504191398818"},"Faro":{"Latitude":"37.01642956436983","Longitude":"-7.935235477800722"},"Viana do Castelo":{"Latitude":"41.69182692007971","Longitude":"-8.834420434115124"},"Aveiro":{"Latitude":"40.64050555262657","Longitude":"-8.653753539757522"},"Beja":{"Latitude":"38.01530504126781","Longitude":"-7.86273841331225"},"Guarda":{"Latitude":"40.53830272496004","Longitude":"-7.266160642363209"},"Castelo Branco":{"Latitude":"39.81970917563139","Longitude":"-7.49647298206845"},"Setúbal":{"Latitude":"38.52604859320611","Longitude":"-8.890925551300578"},"Portalegre":{"Latitude":"39.29670830972098","Longitude":"-7.428479477740804"}}';
const cityListJS = JSON.parse(cityListJSON);
const API_KEY = "8dfb77a610d5384bdbf020b81fa957b8"; //esta é a KEY da api que fornece a informação acerca do tempo
const console_cloud_API_KEY = "AIzaSyDfrR6ImPdbiFFKzNwaFt_wyoYNal0PhJ8"; 
//esta é a KEY do console Cloud necessária para que o package react-geocode possa converter o texto do input nas respetivas coordenadas


let location;
let latitude;
let longitude;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render("index.ejs", {location: 'Bem-vindo'});
});

app.post('/location-forecast', async (req, res) => {

    location = req.body.location;

    console.log(`LOCATION IS: ${location}`);

    if(location != undefined){    
        //console.log(`Selected location is: ${location}`)
        latitude = cityListJS[location]["Latitude"];
        longitude = cityListJS[location]["Longitude"];

        console.log(`Localização é: ${location}`);
        console.log(`Latitude é: ${latitude}`);
        console.log(`Longitude é: ${longitude}`);

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=en&units=metric`);
            const result = response.data;

            console.log(result.weather[0].description);

            console.log(result);

            res.render("index.ejs", {
                location: location,
                weather: result.weather[0].description,
                temperature: result.main.temp,
                min: result.main.temp_min,
                max: result.main.temp_max,
                humidity: result.main.humidity,
                wind: result.wind.speed,
                icon: result.weather[0].icon,
            });

        }catch (error){
            console.log("Failed to make request:", error.message);
            res.render("index.ejs", {location: error.message});
        }

    }else{
        res.render("index.ejs", {nothing: 'Select a city for a weather forecast'});
    }

    
    
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


