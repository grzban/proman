// It uses data_handler.js to visualize elements
let dom = {
    showWarning: function(){
        let warning = document.getElementById('warning');
        let span = document.getElementById("warningClose")
        warning.style.display = "block";
        span.onclick = function() {
            warning.style.display = "none";
        }
        closeModalIfClickedOutside(warning);
    },
    addNewCardForm: function(id){
        document.getElementById("board-id-new-card").value = id;

        let modal = document.getElementById('addNewCardForm');
        modal.style.display = "block";

        let span = document.getElementById("addNewCardFormClose");
        span.onclick = function() {
            modal.style.display = "none";
        };
        closeModalIfClickedOutside(modal);
    },
    loadBoards: function() {
        if (document.getElementById("user-boards").value) {
            let boards = JSON.parse(document.getElementById("user-boards").value);
            return this.showBoards(boards);
        }
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
            singleBoardContainer.classList.add("board-view");

            let singleBoard = document.createElement("div");
            singleBoard.id = "board-" + boards[i].id + "-container";
            singleBoard.classList.add("row");

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

            let statuses = JSON.parse(document.getElementById("statuses").value)
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

            
            

            
            
            let cards = JSON.parse(document.getElementById("user-cards").value);
            dom.showCards(boards[i].id, cards);

            titleButton.addEventListener("click", function() {
                if (singleBoardContainer.style.display = "none") {
                    singleBoardContainer.style.display = "block"
                } else {
                    singleBoardContainer.style.display = "none";
                };
            });

            let addCardButton = document.getElementById("card-" + boards[i].id + "-btn");
            addCardButton.onclick = function() {
                dom.addNewCardForm(boards[i].id);
            };

        }
    },

    showCards: function(boardId, cards) {
        if (cards != null) {

            // cards.sort(function sortByOrder(a, b) {
            //    return a.order - b.order
            // });
            let statuses = JSON.parse(document.getElementById("statuses").value)
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
        let cardId = targetId.slice(targetId.indexOf('card')).replace( /\D+/g, '');
        let modal = document.getElementById('editCardForm');
        modal.style.display = "block";

        let span = document.getElementById("editCardFormClose");
        span.onclick = function() {
            modal.style.display = "none";
        };

        let cardName = document.getElementById('newCardName');
        let saveButton = document.getElementById("saveNewCardName");
        let deleteButton = document.getElementById("deleteCard");

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

        deleteButton.onclick = function () {
            // changes form value to card id
            document.getElementById("deletedCardNum").value = cardId.toString();
            modal.style.display = "none";
        }
        closeModalIfClickedOutside(modal);

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
    let span = document.getElementById("addNewBoardClose");
    let boardName = document.getElementById('boardName');
    let saveBoardName = document.getElementById('saveBoardName');
    if (btn != null) {
        btn.onclick = function () {
            modal.style.display = "block";
        }
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    if (saveBoardName) {
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
    }
    closeModalIfClickedOutside(modal);

};

menuButtons();

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
    closeModalIfClickedOutside(loginModal);
}

function showSignupModal() {
    let signupModal = document.getElementById("signup-modal");
    signupModal.style.display = "block";
    document.getElementById("close-signup-modal").addEventListener("click", function() {
        signupModal.style.display = "none";
    })
    closeModalIfClickedOutside(signupModal);
}

function closeModalIfClickedOutside(modalId) {
     window.onclick = function(event) {
        if (event.target == modalId) {
            modalId.style.display = "none";
        }
    }
}