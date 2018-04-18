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
let opponent;
const gameStartButton = $("#gameStartButton");
const gameDiv = $("#gameDiv");
const statusDiv = $("#statusDiv");
const whoAmIDiv = $("#whoAmIDiv");
const gameButtons = $("#gameButtons");
const restartButton = $("#restartButton");
let pageJustLoaded = true;
let playersRPSValue = {};

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
    gameButtons.hide();
    if (playersRPSValue[`player${otherplayer}`] === "") {
        statusDiv.empty().append(`<p>Waiting for Player ${otherplayer}.</p>`);
    }
    database.ref(`player${player}RPSValue`).set(value);
};

const compareRPSValues = function(){
    if (playersRPSValue.playerOne !== "" && playersRPSValue.playerTwo !== "" && whoAmI !== "nobody") {
        statusDiv.empty();
        if (playersRPSValue.playerOne === playersRPSValue.playerTwo) {
            statusDiv.append(`<p>Tie!</p>`);
            statusDiv.append(`<p>Press the button below to play again or just exit the page to be done.</p>`);
        } else {
            if (playersRPSValue.playerOne === "rock" && playersRPSValue.playerTwo === "scissors") {
                statusDiv.append(`<p>Player One wins!</p>`);
                statusDiv.append(`<p>Press the button below to play again or just exit the page to be done.</p>`);
            } else if (playersRPSValue.playerOne === "paper" && playersRPSValue.playerTwo === "rock") {
                statusDiv.append(`<p>Player One wins!</p>`);
                statusDiv.append(`<p>Press the button below to play again or just exit the page to be done.</p>`);
            } else if (playersRPSValue.playerOne === "scissors" && playersRPSValue.playerTwo === "paper") {
                statusDiv.append(`<p>Player One wins!</p>`);
                statusDiv.append(`<p>Press the button below to play again or just exit the page to be done.</p>`);
            } else {
                statusDiv.append(`<p>Player Two wins!</p>`);
                statusDiv.append(`<p>Press the button below to play again or just exit the page to be done.</p>`);
            }
        }
        restartButton.show();
    }
};

// Function Calls

database.ref("isPlayerOne").on("value", function(snapshot){
    isPlayerOne = snapshot.val();
    if (!pageJustLoaded) {
        updateStatus();
    }
    if (pageJustLoaded) {
        database.ref("isPlayerTwo").on("value", function(snapshot){
            isPlayerTwo = snapshot.val();
            if (!pageJustLoaded) {
                updateStatus();
                if (isPlayerOne && isPlayerTwo && whoAmI !== "nobody") {
                    if (whoAmI === "One") {
                        statusDiv.empty().append(`<p>Play!</p>`);
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
        whoAmI = "One";
        opponent = "Two";
        database.ref("isPlayerOne").set(true);
        statusDiv.empty();
        whoAmIDiv.append(`<h3>Player One</h3>`);
        statusDiv.append(`<p>Waiting for Player Two to join.</p>`);
        gameStartButton.hide();
    } else if (!isPlayerTwo) {
        whoAmI = "Two";
        opponent = "One";
        database.ref("isPlayerTwo").set(true);
        statusDiv.empty().append(`<p>Play!</p>`);
        whoAmIDiv.append(`<h3>Player Two</h3>`);
        gameStartButton.hide();
    }
});

$("#rock").on("click", function(){
    saveRPSValue(whoAmI, "rock", opponent);
});

$("#paper").on("click", function(){
    saveRPSValue(whoAmI, "paper", opponent);
});

$("#scissors").on("click", function(){
    saveRPSValue(whoAmI, "scissors", opponent);
});

database.ref("playerOneRPSValue").on("value", function(snapshot){
    playersRPSValue.playerOne = snapshot.val();
    compareRPSValues();
});

database.ref("playerTwoRPSValue").on("value", function(snapshot){
    playersRPSValue.playerTwo = snapshot.val();
    compareRPSValues();
});

restartButton.on("click", function(){
    restartButton.hide();
    database.ref("playerOneRPSValue").set("");
    database.ref("playerTwoRPSValue").set("");
    database.ref(`player${whoAmI}Again`).set(true);
    database.ref(`player${opponent}Again`).on("value", function(snapshot){
        if (snapshot.val() === false) {
            statusDiv.empty().append(`<p>Waiting for Player ${opponent} to be ready.</p>`);
        } else {
            statusDiv.empty().append(`<p>Play!</p>`);
            gameButtons.show();
            database.ref(`player${opponent}Again`).off("value");
            database.ref(`player${whoAmI}Again`).set(false);
            database.ref(`player${opponent}Again`).set(false);
        }
    });
});