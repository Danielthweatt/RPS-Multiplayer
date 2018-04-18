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
let whoAmI = "nobody";
const gameStartButton = $("#gameStartButton");
const gameDiv = $("#gameDiv");
const statusDiv = $("#statusDiv");
const whoAmIDiv = $("#whoAmIDiv");
const gameButtons = $("#gameButtons");
let pageJustLoaded = true;

// Function Declarations

const updateStatus = function(){
    if (whoAmI === "nobody") {
        if (isPlayerOne) {
            if (!isPlayerTwo) {
                gameStartButton.show();
                statusDiv.empty().append(`<p>There is now a player one, but no player two! If you are ready to play, you will be player two!</p>`);
            } else {
                gameStartButton.hide();
                statusDiv.empty().append(`<p>Sorry! Two people are playing the game right now. No more than two players can play at one time.</p>`);
            }
        } else {
            if (!isPlayerTwo) {
                gameStartButton.show();
                statusDiv.empty().append(`<p>No one is playing now. If you are ready to play, you will be player one!</p>`);
            } else {
                gameStartButton.hide();
                statusDiv.empty().append(`<p>Hold on...</p>`);
            }
        }
    }
};

const saveRPSValue = function(player, value, otherplayer){
    database.ref(`player${player}RPS`).set(value);
    gameButtons.hide();
    statusDiv.append(`<p>Waiting for player ${otherplayer}.</p>`);
};

// Function Calls

database.ref("playerOne").on("value", function(snapshot){
    isPlayerOne = snapshot.val();
    if (!pageJustLoaded) {
        updateStatus();
    }
    if (pageJustLoaded) {
        database.ref("playerTwo").on("value", function(snapshot){
            isPlayerTwo = snapshot.val();
            if (!pageJustLoaded) {
                updateStatus();
                if (isPlayerOne && isPlayerTwo && whoAmI !== "nobody") {
                    if (whoAmI === "playerOne") {
                        statusDiv.empty();
                    }
                    gameButtons.show();
                }
            }
            if (pageJustLoaded) {
                if (!isPlayerOne) {
                    statusDiv.append(`<p>If you are ready to play, you will be player one!</p>`);
                    gameStartButton.show();
                } else if (!isPlayerTwo) {
                    statusDiv.append(`<p>If you are ready to play, you will be player two!</p>`);
                    gameStartButton.show();
                } else {
                    statusDiv.append(`<p>Sorry! Two people are playing the game right now. No more than two players can play at one time.</p>`);
                }
                pageJustLoaded = false;
            }
        });
    }
});

gameStartButton.on("click", function(){
    if (!isPlayerOne) {
        whoAmI = "playerOne";
        database.ref("playerOne").set(true);
        statusDiv.empty();
        whoAmIDiv.append(`<h3>Player One</h3>`);
        statusDiv.append(`<p id="waiting">Waiting for Player Two to join.</p>`);
        gameStartButton.hide();
    } else if (!isPlayerTwo) {
        whoAmI = "playerTwo";
        database.ref("playerTwo").set(true);
        statusDiv.empty();
        whoAmIDiv.append(`<h3>Player Two</h3>`);
        gameStartButton.hide();
    }
});

$("#rock").on("click", function(){
    if (whoAmI === "playerOne") {
        saveRPSValue("One", "rock", "two");
    } else {
        saveRPSValue("Two", "rock", "one");
    }
});

$("#paper").on("click", function(){
    if (whoAmI === "playerOne") {
        saveRPSValue("One", "paper", "two");
    } else {
        saveRPSValue("Two", "paper", "one");
    }
});

$("#scissors").on("click", function(){
    if (whoAmI === "playerOne") {
        saveRPSValue("One", "scissors", "two");
    } else {
        saveRPSValue("Two", "scissors", "one");
    }
});