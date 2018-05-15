// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.


    //new in
    generateBoardId: function() {

          // Sets lastBoardId in local storage to '0' if it doesn't already exist
        if (!JSON.parse(localStorage.getItem("lastBoardId"))) {
            console.log("weszło w if lastId");
            localStorage.setItem('lastBoardId', JSON.stringify(0));
          };

          //sets a unique id
        var newId = JSON.parse(localStorage.getItem("lastBoardId")) + 1;

          // sets lastBoardId to the id of the current board
        localStorage.setItem('lastBoardId', JSON.stringify(newId));

        return newId;
        },


    _loadData: function ()  {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        let _data= JSON.parse(localStorage.getItem("boards"));
        console.log("data z loada:" , _data);
        },

    _saveData: function(dataKey, dataValue) {
        console.log("weszlo w funkcje savedata")
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem('boards', JSON.stringify([]));
        _data= JSON.parse(localStorage.getItem("boards"));
        console.log(_data);
        _data.push(board);
        console.log(_data);
        },

  //    if (!JSON.parse(localStorage.getItem("boards"))) {
  //      localStorage.setItem('boards', JSON.stringify([]))
  //    };
  //  var _data2 = JSON.parse(localStorage.getItem("boards"));
  //    dataValue.id = dataHandler.generateBoardId();
  //    _data2 = _data2.push(dataValue);
  //    console.log("data po miedlenniu" + _data2)




    init: function() {
        this._loadData();
},

    getBoards: function(callback) {
      let boards = datahandler._data["boards"]
      if (callback) callback(boards);
        return boards
          // the boards are retrieved and then the callback function is called with the boards
  },


    getBoard: function(boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function(callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function(statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function(boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function(cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function(boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    }
    // here comes more features

};
var board = {
name: "name2",
api_key :  'proman-data'
};

dataHandler._saveData('board3', board);
