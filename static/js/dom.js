// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        let boards = dataHandler.getBoards();
        return dom.showBoards(boards);
    },
    showBoard: function(board) {
        let boardId = board.id;
        let cards = dom.loadCards(boardId);
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsDiv = document.getElementById('boards');
        boardsDiv.innerHTML = "";
        for (let i = 0; i < boards.length; i++) {

            let boardBox = document.createElement("div");
            boardBox.id = "board-box-" + boards[i].id;
            boardBox.className = "container";

            let singleBoard = document.createElement("div");
            singleBoard.id = "board-" + boards[i].id;
            singleBoard.className = "row";

            let titleButton = document.createElement("button");
            titleButton.id = "board-" + boards[i]["id"] + "-btn";
            titleButton.className = "btn-block";
            boardBox.appendChild(titleButton);
            boardBox.appendChild(singleBoard);

            let buttonHeader = document.createElement("h4");
            let txt = document.createTextNode(boards[i]["title"]);
            buttonHeader.appendChild(txt);
            titleButton.appendChild(buttonHeader);

            let statuses = dataHandler.getStatuses();
            statuses.forEach(function(status) {
                let newStatus = document.createElement("div");
                newStatus.id = boards[i].id + "-status-" + status.id;
                newStatus.className = "col";
                let cardsWindow = document.createElement("div");
                cardsWindow.id = "box-" + status.id;
                let newStatusHeader = document.createElement("h5");
                let newStatusTitle = document.createTextNode(status.name);

                singleBoard.appendChild(newStatus);
                newStatus.appendChild(newStatusHeader);
                newStatusHeader.appendChild(newStatusTitle);
                newStatus.appendChild(cardsWindow);
            })

            boardsDiv.appendChild(boardBox);

            titleButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (e.className == 'btn-block') {
                    e.preventDefault();
                    let id = e.srcElement.id;
                    let board = boards[i];
                    if (board.is_active) {
                        dom.showBoard(board);
                    }
                }
            });
        }
    },
    loadCards: function(boardId) {

          let boardCards = dataHandler.getCardsByBoardId(boardId);
          if (boardCards) {
              return boardCards;
          } else {
              return null;
          }
    },
    showCards: function(boardId, cards) {
        let statuses = dataHandler.getStatuses();
        for (i = 1; i =< statuses.length; i++) {
            if (cards[i].board_id === i) {
              let statusDiv = document.getElementById(boardId + "-status-" + i)
              let cardDiv =  document.createElement("div");
              let txt = document.createTextNode(cards[i]["title"]);
              cardDiv.className = "card";
              cardDiv.id = cards[i].id;
              dom.appendToElement(cardDiv, txt);
              dom.appendToElement(statusDiv, cardDiv);

          }
        }


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
