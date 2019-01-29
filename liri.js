require("dotenv").config();

var axios = require('axios');
var http = require('http');
const fs = require('fs');

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

function concertThis(parameter) {
  var parameter = parameter.replace(" ","+");
  console.log("concertThis("+parameter+")");
  var queryURL = "https://rest.bandsintown.com/artists/"+parameter+"/events?app_id=codingbootcamp"
    axios.get(queryURL).then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log("-----------------");
        console.log("Venue: "+response.data[i].venue.name);
        console.log("Location: "+response.data[i].venue.city+", "+response.data[i].venue.country);
        console.log("Date: "+response.data[i].datetime);
        console.log("-----------------");
      }
    });
}

function spotifyThisSong(parameter) {
  console.log("spotifyThisSong("+parameter+")");
  var def = "The+Sign";
  if (def === '') {
    parameter = def;
  }
  spotify.search({ type: 'track', query: parameter}).then(function(response) {
    console.log("-----------------");
    console.log(response.tracks.items[0].name);
    console.log("URL: "+response.tracks.items[0].preview_url);
    console.log("Artist: "+response.tracks.items[0].album.artists[0].name);
    console.log("-----------------");
  })
  .catch(function(err) {
    console.log(err);
  });
  // * Artist(s)
  //
  // * The song's name
  //
  // * A preview link of the song from Spotify
  //
  // * The album that the song is from



}

function movieThis(movie) {
  console.log("movieThis("+movie+")");
  var movie = movie.replace(" ","+");
  var def = "Mr.+Nobody.";
  if (movie === '')
    movie = def;
  var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t="+movie;
  axios.get(queryURL).then(function(response) {
    console.log("-----------------");
    console.log(response.data.Title);
    console.log("Released: "+response.data.Released+", Rating: "+response.data.imdbRating);
    console.log("Rotten Tomatoes Rating: "+response.data.Ratings[1].Value);
    console.log("Country: "+response.data.Country+", Language: "+response.data.Language);
    console.log("Plot: "+response.data.Plot);
    console.log("Actors:"+response.data.Actors);
    console.log("-----------------");
  });
}

function determine(programToRun, parameter) {
  // We will then create a switch-case statement (if-else would also work).
  // The switch-case will direct which function gets run.
  switch (programToRun) {
    case "concert-this":
      concertThis(parameter);
      break;

    case "spotify-this-song":
      spotifyThisSong(parameter);
      break;

    case "movie-this":
      movieThis(parameter);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}

function doWhatItSays() {
  console.log("doWhatItSays()");

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    for (var i = 0; i < dataArr.length; i+=2) {
      determine(dataArr[i],dataArr[i+1]);
    }
  });
}

var programToRun = process.argv[2];
var parameter = process.argv[3];

determine(programToRun, parameter);
