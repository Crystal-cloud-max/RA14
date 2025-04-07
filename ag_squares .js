"use strict";

//run function after browser reloads
window.addEventListener("load", playPokerSquares);

function playPokerSquares() {
   //variables from HTML page
   var newCard = document.getElementById("newCard");
   var startButton = document.getElementById("startButton");
   var rowSumCells = document.querySelectorAll("table#grid th.rowsum");   
   var colSumCells = document.querySelectorAll("table#grid th.colsum"); 
   var cardImages = document.querySelectorAll("table#grid tr td img");
   var gameScore = document.getElementById("gameScore");
   var gameResult = document.getElementById("gameResult");

    startButton.onclick = function () {
        //setup board game
        squareGame.gameTotal = 0;
        gameScore.value = "";
        gameResult.textContent = "";

        //loooping to set text and src image to default
        for (var i = 0; i < rowSumCells.length; i++) {
            rowSumCells[i].textContent = "";
        }
        for (var i = 0; i < colSumCells.length; i++) {
            colSumCells[i].textContent = "";
        }
        
        for (var i = 0; i < cardImages.length; i++) {
            cardImages[i].src = "ag_trans.gif";
        }

        //setup game deck create object
        var myDeck = new pokerDeck();
        myDeck.shuffle();

        //setup starter card create object
        var myStarterCard = new pokerCard();

        //stores the 1st card from the deck in myStarterCard
        myStarterCard = myDeck.cards.shift();

        //change src attribute of newCard inline image call function from ag_cards2.js
        newCard.src = myStarterCard.cardImage();

        /*the starter card is added to the board by clicking a cell in the grid table
         * where user wants the card to be placed*/
        for (var i = 0; i < cardImages.length; i++) {
            cardImages[i].onclick = function (e) {
            //display the image of the current card in the event object target
            e.target.src = myStarterCard.cardImage();
            //stores row and col#s of clicked image in rowNum and colNum variable
            var rowNum = e.target.getAttribute("id").charAt(1);
            var colNum = e.target.getAttribute("id").charAt(2);

            //applies insertCard() to squareGame.cardGrid[rowNum] obj to insert card into new grid
            squareGame.cardGrid[rowNum].insertCard(myStarterCard, colNum);

            //prevent user from reclicking the cell later in the game
            e.target.onclick = null;

            //game continues
            if (myDeck.cards.length > 27) {
                myStarterCard = myDeck.cards.shift();
                newCard.src = myStarterCard.cardImage();//call function from ag_cards2.js
            }
            else {
                //game over
                for (var i = 0; i < 5; i++) {
                    var rowTotal = squareGame.calcRowPoints(i);//call function from ag_cards2.js
                    squareGame.gameTotal += rowTotal;
                    document.getElementById("row" + i + "sum").textContent = rowTotal;
                }  
                for (var j = 0; j < 5; j++) {
                    var colTotal = squareGame.calcColumnPoints(j);//call function from ag_cards2.js
                    squareGame.gameTotal += colTotal;
                    document.getElementById("col" + j + "sum").textContent = colTotal;
                }

                gameScore.value = squareGame.gameTotal;

                //show whether the user won or lost
                gameResult.textContent = squareGame.gameResult();//call function from ag_cards2.js

                newCard.src = "ag_cardback3.png";
            }

          };
       }
   };
}
                               

