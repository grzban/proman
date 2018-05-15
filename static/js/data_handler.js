// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.


    _loadData: function ()  {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        let jsonString= localStorage.getItem(this.keyInLocalStorage);

        if (jsonString != null) {
            this._data = JSON.parse(jsonString);
        } else {
            this._data = {
            "statuses": [],
            "boards": [],
            "cards": []
            };
        }
    },


    _saveData: function() {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage(JSON.stringify(_data)));
    },


    init: function() {
        this._loadData();
    },


    getBoards: function(callback) {
        // the boards are retrieved and then the callback function is called with the boards      
        let boards = this._data.boards;
      
        if (typeof(boards) === "undefined") {
          return null;
        } else {
            if (callback) {
                return callback(boards);
            } else {
                return boards;
            }
        }
    },


    getBoard: function(boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        let boards = this.getBoards
        
        for (let i = 0; i < boards.length; i++) {
            if (boards[i].boardId === boardId) {
                if (callback) {
                    return callback(boards[i]);
                } else {
                    return boards[i];
                }
            }
        }
        return null;
    },


    getStatuses: function(callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        let statuses = this._data.statuses;

        if (typeof(statuses) === "undefined") {
            return null;
        } else {
            if (callback) {
                return callback(statuses);
            } else {
                return statuses;
            }
        }
    },


    getStatus: function(statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        let statuses = this.getStatuses 
        
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].statusId === statusId) {
                if (callback) {
                    return callback(statuses[i]);
                } else {
                    return statuses[i];
                }
            }
        }
        return null;
    },


    getCardsByBoardId: function(boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let results = [];
        let cards = this._data.cards;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].boardId === boardId) {
                results.push(cards[i]);
            }
        }

        if (results.length === 0) {
            return null;
        } else {
            if (callback) {
                return callback(results);
            }
            else {
                return results;
            }
        }
    },

    
    getCard: function(cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        let cards = this._data.cards;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId) {
                if (callback) {
                    return callback(cards[i]);
                } else {
                    return cards[i];
                }
            }
        }
        return null;
    },


    createNewBoard: function(boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    // here comes more features

};