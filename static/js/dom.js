// It uses data_handler.js to visualize elements
let dom = {
    showWarning: function(){
        let warning = document.getElementById('warning');
        let span = document.getElementsByClassName("close")[3];
        warning.style.display = "block";
        span.onclick = function() {
            warning.style.display = "none";
        }
    },
    addNewCardForm: function(id){
        let modal = document.getElementById('addNewCardForm');
        modal.style.display = "block";

        let span = document.getElementsByClassName("close")[2];
        span.onclick = function() {
            modal.style.display = "none";
        };
        let cardName = document.getElementById('cardName');
        let saveButton = document.getElementById("saveCardName");
        saveButton.onclick = function () {
            let newCardName = cardName.value;
            console.log(newCardName);
            if (newCardName === '') {
                dom.showWarning();
            } else {
                modal.style.display = "none";
                dataHandler.createNewCard(newCardName, id, 1);
                dom.loadBoards();
                cardName.value = '';
            }
        }
    },
    loadBoards: function() {
        let boards = dataHandler.getBoards();
        return this.showBoards(boards);
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

            let singleBoardContainer = document.createElement("div");
            singleBoardContainer.id = "board-" + boards[i].id;

            let singleBoard = document.createElement("div");
            singleBoard.id = "board-" + boards[i].id + "-container";
            singleBoard.className = "row";

            let titleButton = document.createElement("button");
            titleButton.id = "board-" + boards[i]["id"] + "-btn";
            titleButton.classList.add("btn", "btn-primary");
            titleButton.style.width = "100%";
            titleButton.style.margin = "10px";
            let cardButton = document.createElement("button");
            cardButton.classList.add("btn", "btn-warning");
            cardButton.style.fontSize = "12px";
            cardButton.style.margin = "5px";
            cardButton.id = "card-" + boards[i]["id"] + "-btn";

            boardBox.appendChild(titleButton);
            boardBox.appendChild(singleBoardContainer);
            singleBoardContainer.appendChild(cardButton);
            singleBoardContainer.appendChild(singleBoard);

            let buttonHeader = document.createElement("h3");
            let txt = document.createTextNode(boards[i]["title"]);
            buttonHeader.appendChild(txt);
            titleButton.appendChild(buttonHeader);
            let cardButtonHeader = document.createElement("span");
            let cardTxt = document.createTextNode("Add new Card");
            cardButton.appendChild(cardButtonHeader);
            cardButtonHeader.appendChild(cardTxt);

            let statuses = dataHandler.getStatuses();
            statuses.forEach(function(status) {
                let newStatus = document.createElement("div");
                newStatus.id = "board-" + boards[i].id + "-status-" + status.id;
                newStatus.className = "col text-center";
                let cardsWindow = document.createElement("div");
                cardsWindow.id = "card-" + boards[i].id + "-box-" + status.id;
                cardsWindow.className = "droparea";
                cardsWindow.setAttribute("ondragover", "allowDrop(event)");
                cardsWindow.setAttribute("ondrop", "drop(event)");
                cardsWindow.style.minHeight = "40px";
                let newStatusHeader = document.createElement("h5");
                newStatusHeader.style.textAlign = "center";
                let newStatusTitle = document.createTextNode(status.name);

                singleBoard.appendChild(newStatus);
                newStatus.appendChild(newStatusHeader);
                newStatusHeader.appendChild(newStatusTitle);
                newStatus.appendChild(cardsWindow);
            });

            boardsDiv.appendChild(boardBox);

            let cards = dom.loadCards(boards[i].id);
            dom.showCards(boards[i].id, cards);

            let board = boards[i];
            let id = board.id;
            let boardDiv = document.getElementById('board-'+ id);

            if (board.is_active) {
                boardDiv.style.display = ""
            } else {
                boardDiv.style.display = "none";
            }
            titleButton.onclick = function() {
                dataHandler.changeStatus(id);
                dom.loadBoards();
            };

            let addCardButton = document.getElementById("card-" + id + "-btn");
            addCardButton.onclick = function (event) {
                dom.addNewCardForm(id);
            };

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
        if (cards != null) {
            let statuses = dataHandler.getStatuses();
            cards.sort(function sortByOrder(a, b) {
               return a.order - b.order
            }); 

            for (i = 1; i <= statuses.length; i++) {
                for (c = 0; c< cards.length; c++) {
                    if (cards[c].status_id === i) {
                        dom.addCardToStatus(boardId, cards[c])
                    };
                };
            };

      } else {
          return null;
      };
    },



    addCardToStatus: function(boardId, card) {
        let statusDiv = document.getElementById("card-" + boardId + "-box-" + i);
        let cardButt =  document.createElement("button");
        cardButt.draggable = true;
        cardButt.setAttribute("ondragstart", "drag(event)");
        cardButt.style.margin = "8px";
        cardButt.style.width = "100%";
        let cardButtHeader = document.createElement("h8");
        let txt = document.createTextNode(card["title"]);
        cardButt.classList.add('cards', 'btn', 'btn-default', "block");
        cardButt.id = "board-" + boardId + "-card-" + card.id;
        cardButt.appendChild(cardButtHeader);
        cardButtHeader.appendChild(txt);
        statusDiv.appendChild(cardButt);
        let modCardId = cardButt.id;
        cardButt.onclick = function () {
            dom.editCard(modCardId);
        };
      },



    editCard: function(targetId) {
        let boardId = targetId.slice(0, targetId.indexOf('card')).replace( /\D+/g, '');
        let cardId = targetId.slice(targetId.indexOf('card')).replace( /\D+/g, '');

        let modal = document.getElementById('editCardForm');
        modal.style.display = "block";

        let span = document.getElementsByClassName("close")[2];
        span.onclick = function() {
            modal.style.display = "none";
        };

        let cardName = document.getElementById('newCardName');
        let saveButton = document.getElementById("saveNewCardName");

        saveButton.onclick = function () {
            let newCardName = cardName.value;
            if (newCardName == '') {
                dom.showWarning();
            } else {
                modal.style.display = "none";
                dataHandler._data.cards.find(card => card.id == cardId).title = newCardName;
                dataHandler._saveData();
                cardName.value = '';
                location.reload();
            }
        }
    },

        // shows the cards of a board
        // it adds necessary event listeners also
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

    let modal = document.getElementById('addNewBoardForm');
    let btn = document.getElementById("addNewBoardButton");
    let span = document.getElementsByClassName("close")[0];
    let boardName = document.getElementById('boardName');
    let saveBoardName = document.getElementById('saveBoardName');

    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == 'addNewBoardButton') {
            modal.style.display = "none";
        }
    }
    saveBoardName.onclick = function(){
        let newBoardName = boardName.value;
        if (newBoardName == '') {
            dom.showWarning();

        } else {
            if (dataHandler._data.boards.find(function (obj) {
                return obj.title == newBoardName;
            })) {
                dom.showWarning();
            } else {
                modal.style.display = "none";
                dataHandler.createNewBoard(newBoardName);
                dom.loadBoards();
                boardName.value = '';
            }
        }
    };

};

menuButtons()

// Drag & drop

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("droparea")) {
        let data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        let targetId = ev.target.parentElement.id;
        let newBoardId = targetId.slice(0, targetId.indexOf('status')).replace( /\D+/g, '');
        let newStatus = targetId.slice(targetId.indexOf('status')).replace( /\D+/g, '');
        let id = data.slice(13);
        dataHandler.updateCard(id, newBoardId, newStatus);
    }
}

function showLoginModal() {
    let loginModal = document.getElementById("login-modal");
    loginModal.style.display = "block";
    document.getElementById("close-login-modal").addEventListener("click", function() {
        loginModal.style.display = "none";
    })
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
    }
}

function showSignupModal() {
    let signupModal = document.getElementById("signup-modal");
    signupModal.style.display = "block";
    document.getElementById("close-signup-modal").addEventListener("click", function() {
        signupModal.style.display = "none";
    })
    window.onclick = function(event) {
        if (event.target == signupModal) {
            signupModal.style.display = "none";
        }
    }
}