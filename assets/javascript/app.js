'use strict';

// Initialize Firebase

const config = {
    apiKey: "AIzaSyBVfamX-hyA3-F79t1kOdXzM9GuVlm1Zrs",
    authDomain: "rps-multiplayer-c7ba8.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-c7ba8.firebaseio.com",
    projectId: "rps-multiplayer-c7ba8",
    storageBucket: "rps-multiplayer-c7ba8.appspot.com",
    messagingSenderId: "240566913012"
};

firebase.initializeApp(config);

// Variables

const database = firebase.database();
let isPlayerOne;
let isPlayerTwo;
let whoAmI;
const gameStartButton = $("#gameStartButton");
const gameDiv = $("#gameDiv");
const statusDiv = $("#statusDiv");

// Function Declarations

// Function Calls

database.ref("playerOne").on("value", function(snapshot){
    isPlayerOne = snapshot.val();
});

database.ref("playerTwo").on("value", function(snapshot){
    isPlayerTwo = snapshot.val();
});

gameStartButton.on("click", function(){
    if (!isPlayerOne) {
        database.ref("playerOne").set(true);
        whoAmI = "playerOne";
        statusDiv.append(`<h3 class="text-center">Player One</h3>`);
        gameDiv.empty().append(`<p class="text-center">Waiting for Player Two to join.</p>`);
    } else if (!isPlayerTwo) {
        database.ref("playerTwo").set(true);
        whoAmI = "playerTwo";
        statusDiv.append(`<h3 class="text-center">Player Two</h3>`);
        gameDiv.empty();
    } else {
        gameDiv.empty();
        statusDiv.append(`<p class="text-center">Sorry! Two people are playing the game right now. No more than two players can play at one time.</p>`);
    }
});