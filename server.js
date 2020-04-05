'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
// Application Setup
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
// API Routes
app.get('/', (request, response) => {
  response.status(200).send('Home Page!');
});
app.get('/bad', (request, response) => {
  throw new Error('oh nooooo!');
});
app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.status(200).json(locationData);
  } catch (error) {
    errorHandler(error, request, response);
  }
});
app.get('/weather',(request,response) =>{
  let alltheWeather=[];
  try{
    const theweatherData = require('./data/darksky.json');
    for(let i = 0 ; i<theweatherData.data.length;i++){
      var locationweatherData = new Weather(theweatherData.data[i]);
      alltheWeather.push(locationweatherData);
    }
    response.send(alltheWeather);
  }catch (error) {
    errorHandler(error, request, response);
  }
});
app.use('*', notFoundHandler);
function Location(city,geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
function Weather(theweatherData) {
  this.forecast = theweatherData.weather.description;
  // this.time = theweatherData.valid_date;
  var d = new Date(theweatherData.valid_date);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var day = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  this.time = day[d.getDay()]+" "+months[d.getMonth()]+" "+d.getDate()+" "+d.getFullYear();
}
function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
// Make sure the server is lisstening for requests
app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));