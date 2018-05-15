// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        var boards = sampleData.boards;
        console.log("BOARDS Z DOM", boards)
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        var boardsDiv = document.getElementById('boards');
        boardsDiv.innerHTML = "";
        for (i=0; i < boards.length; i++) {
          console.log("weszło do fora");
          var boardDiv = document.createElement("button");
          boardDiv.id = boards[i]["title"];
          boardDiv.classList.add("btn-block");
          var txt = document.createTextNode(boards[i]["title"]);
          boardDiv.appendChild(txt);
          boardsDiv.appendChild(boardDiv);

      };
      //  var boardDiv = document.createElement(div);

    },



    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
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
console.log("SAMPLE",sampleData.boards);
dom.showBoards(sampleData.boards);

menuButtons = function() {
  var addBoard = document.getElementById('addBoard');
  var listBoards = document.getElementById('listBoards');
  addBoard.onclick = function(){
    var newName = prompt("Name your new board:")
    dataHandler._saveData(newName)
    };
  listBoard.onclick = function(){
    dom.showBoards(boards)};
  };

menuButtons()
