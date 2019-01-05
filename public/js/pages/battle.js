import SpotifyAPI from "../api/spotify.js";
import {getHashParams} from "../helpers/url.js";
import {STATE_KEY} from "../helpers/constants.js";

const USER_PROFILE = document.getElementById('user-profile');
const {access_token, state} = getHashParams();
const storedState = localStorage.getItem(STATE_KEY);

let artist1Returned = false;
let artist2Returned = false;
let artist1Result = {};
let artist2Result = {};

if (!access_token || (state == null || state !== storedState)) {
  window.location = "/";
} else {
  document.querySelector("#battle-button").addEventListener("click", (event) => {
    //read names from the input boxes
    const artist1 = document.querySelector(".input1").value;
    const artist2 = document.querySelector(".input2").value;
    
    //create a request to the spotify API for artist1
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      //call our handleResponse function to get the first match
      if (this.readyState == 4 && this.status == 200) {
        artist1Result = handleResponse(this);
        artist1Returned = true;
        //compare followers when both artists have returned
        if (artist1Returned && artist2Returned) {
          compareFollowers();
        }
      }
    };
    xmlhttp.open('GET', 'https://api.spotify.com/v1/search?type=artist&q=' + artist1);
    xmlhttp.setRequestHeader("Authorization", "Bearer " + access_token);
    xmlhttp.send();

    //create a request to the spotify API for artist2
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.onreadystatechange = function() {
      //call our handleResponse function to get the first match
      if (this.readyState == 4 && this.status == 200) {
        artist2Result = handleResponse(this);
        artist2Returned = true;
        //compare followers when both artists have returned
        if (artist1Returned && artist2Returned) {
          compareFollowers();
        }
      }
    };
    xmlhttp2.open('GET', 'https://api.spotify.com/v1/search?type=artist&q=' + artist2);
    xmlhttp2.setRequestHeader("Authorization", "Bearer " + access_token);
    xmlhttp2.send();
  });
}

function handleResponse(context){
    console.log(JSON.parse(context.response));
    const artists =  JSON.parse(context.response).artists;
    return artists.items[0];
}

function compareFollowers() {
  //add code to add html with winner here
  if(artist1Result.followers.total > artist2Result.followers.total) {
    alert(artist1Result.name + " has more followers than " + artist2Result.name);
  } else {
    alert(artist2Result.name + " has more followers than " + artist1Result.name);
  }
  artist1Returned = false;
  artist2Returned = false;
}
