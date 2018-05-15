// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        let boards = dataHandler.getBoards();
        console.log(boards);
        return dom.showBoards(boards);
    },
    showBoard: function(board){
        let boardId = board.id;
        let cards = dom.loadCards(boardId);
        alert("Show board: " + cards.id);
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        var boardsDiv = document.getElementById('boards');
        boardsDiv.innerHTML = "";
        for (let i = 0; i < boards.length; i++) {
            var boardDiv = document.createElement("button");
            boardDiv.id = boards[i]["title"];
            boardDiv.classList.add("btn-block");
            var txt = document.createTextNode(boards[i]["title"]);
            boardDiv.appendChild(txt);
            boardsDiv.appendChild(boardDiv);
            boardDiv.addEventListener('click', function (e) {
                e.preventDefault();
                if (e.target.className == 'btn-block') {
                    e.preventDefault();
                    let id = e.srcElement.id;
                    let board = boards[i];
                    if (board.is_active) {
                        dom.showBoard(board);
                    }
                }
            });

        }
        ;
      //  var boardDiv = document.createElement(div);

    },
    loadCards: function(boardId) {
        //var allCards = dataHandler._data.cards; <- po napisaniu Bartka funkcji
          var allCards = sampleData.cards;
          var boardCards = [];
          for (let i = 0; i< allCards.length; i++) {
            if (allCards[i]["board_id"] == boardId) {
              boardCards.push(allCards[i]);
            }
          };
          return boardCards;
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    appendToElement: function(elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    }
    // here comes more features
}

menuButtons = function () {
    var addBoard = document.getElementById('addBoard');
    var listBoards = document.getElementById('listBoards');
    addBoard.onclick = function () {
        var newName = prompt("Name your new board:")
        dataHandler.createNewBoard(newName);
        dom.loadBoards();
    };
};

menuButtons()
