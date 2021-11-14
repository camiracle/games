(function () {
    window.onload = function () {
        var board = new Board();        
        
        // construct dom game board based on model
        var domBoard = document.getElementById('board');        
        for (var y = 0; y < board.model.length; y++) {
            var row = document.createElement('div');
            row.className = 'row';
            for (var x = 0; x < board.model[y].length; x++) {
                var square = document.createElement('div');
                square.className = 'square';                              
                square.dataset.x = x;
                square.dataset.y = y;                
                                              
                row.appendChild(square);
            }
            domBoard.appendChild(row);
        }
        
        // Respond to square clicks: validate and take turn, determine if game is over
        domBoard.addEventListener('click', function(e) {
            var el = e.target;
            if (el.className === 'square') {
                var x = el.dataset.x;
                var y = el.dataset.y;

                if (board.takeTurn(x, y)) {
                    redrawBoard();

                    if (board.rules.winner) {
                        document.getElementById('status-bar').innerHTML = `<h1>${board.rules.winner} won!!!</h1>`;
                    } else {
                        document.getElementById('status-bar').innerHTML = `${board.rules.marker}'s turn`;
                    }
                }               
            }
        });

        document.getElementById('new-game-button')            
            .addEventListener('click', function(e) {                
                board.reset();
                redrawBoard();
                board.rules.winner = '';
                document.getElementById('status-bar').innerHTML = '';
            });
        
        // map board updated model back to dom
        var redrawBoard = function() {
            var squares = document.getElementsByClassName('square');        
            Array.prototype.forEach.call(squares, function(square) {
                var x = square.dataset.x;
                var y = square.dataset.y;
                square.innerHTML = board.model[y][x];
            });
        }
    };    

    class Board {
        constructor() {
            this.model;

            this.model = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];

            this.rules = new RulesEngine(this.model);
        }
        reset() {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.model[i][j] = '';
                }
            }
        }
        takeTurn(x, y) {
            if (!this.rules.isValidTurn(x, y)) {
                return false;
            }

            this.model[y][x] = this.rules.marker;
            this.rules.toggleMarker();
            this.rules.checkForVictory();

            return true;
        }
    }




    class RulesEngine {
        constructor(board) {
            this.board = board;
            this.marker = 'x';
            this.winner = null;
        }
        isValidTurn(x, y) {
            // returns true if square has not already been played and if the game is not over
            return !this.board[y][x] && !this.winner;
        }
        toggleMarker() {
            this.marker = this.marker == 'x' ? 'o' : 'x';
        }
        checkForVictory() {
            let winner = '';

            // check all row groups
            winner += this.checkGroupForVictory(0, 0, 1, 0);
            winner += this.checkGroupForVictory(0, 1, 1, 0);
            winner += this.checkGroupForVictory(0, 2, 1, 0);

            // check all column groups
            winner += this.checkGroupForVictory(0, 0, 0, 1);
            winner += this.checkGroupForVictory(1, 0, 0, 1);
            winner += this.checkGroupForVictory(2, 0, 0, 1);

            // check diagonal groups
            winner += this.checkGroupForVictory(0, 0, 1, 1);
            winner += this.checkGroupForVictory(0, 2, 1, -1);

            this.winner = winner;
        }
        checkGroupForVictory(x, y, xMove, yMove, marker) {
            if ((x === 2 && xMove === 1) || y === 2 && yMove === 1) {
                if (!!marker && marker === this.board[y][x]) {
                    return marker;
                }
                return '';
            }
            if (!marker || marker === this.board[y][x]) {
                marker = marker || this.board[y][x];

                if (!this.board[y][x]) {
                    return '';
                }

                return this.checkGroupForVictory(x + xMove, y + yMove, xMove, yMove, marker);
            } else {
                return '';
            }
        }
    }
    


        
})();