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
let pageJustLoaded = true;

// Function Declarations

const updateStatus = function() {
    if (isPlayerOne) {
        if ($("#status").text() === "If you are ready to play, you will be player one!") {
            if (!isPlayerTwo) {
                $("#status").text("Someone is now player one. If you are ready to play, you will be player two!");
            }
        }
    }
};

// Function Calls

database.ref("playerOne").on("value", function(snapshot){
    isPlayerOne = snapshot.val();
    updateStatus();
    if (pageJustLoaded) {
        database.ref("playerTwo").on("value", function(snapshot){
            isPlayerTwo = snapshot.val();
            updateStatus();
            if (pageJustLoaded) {
                if (!isPlayerOne) {
                    statusDiv.append(`<p id="status" class="text-center">If you are ready to play, you will be player one!</p>`);
                    gameStartButton.show();
                } else if (!isPlayerTwo) {
                    statusDiv.append(`<p id="status" class="text-center">If you are ready to play, you will be player two!</p>`);
                    gameStartButton.show();
                } else {
                    statusDiv.append(`<p class="text-center">Sorry! Two people are playing the game right now. No more than two players can play at one time.</p>`);
                }
                pageJustLoaded = false;
            }
        });
    }
});


gameStartButton.on("click", function(){
    if (!isPlayerOne) {
        database.ref("playerOne").set(true);
        whoAmI = "playerOne";
        statusDiv.empty().append(`<h3 class="text-center">Player One</h3>`);
        gameStartButton.hide();
        gameDiv.append(`<p class="text-center">Waiting for Player Two to join.</p>`);
    } else if (!isPlayerTwo) {
        database.ref("playerTwo").set(true);
        whoAmI = "playerTwo";
        statusDiv.empty().append(`<h3 class="text-center">Player Two</h3>`);
        gameStartButton.hide();
    }
});