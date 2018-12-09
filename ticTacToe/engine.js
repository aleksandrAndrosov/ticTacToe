function createGame(s, w) {
    let fieldArr = Array.from({length: s * s}, () => 0),
        activeField,
        gameSize = s,
        win = w,
        lastMove,
        keysCallback,
        drawState = 0,
        userState = 1,
        aiState = 2,
        endOfGame = false,
        winner = 0,
        closingDelay = 3000,
        cellWidth = 100,
        borderWidth = 1;


    return {
        start: function () {
            this.initMoveTurns();
            this.initActiveField();
            this.showField();
            this.begin();
            this.showGameInformation();
            this.showControlsInformation();
        },

        initMoveTurns: function () {
            userState = Math.ceil(Math.random() * 2);
            aiState = ( userState + 1 ) % 2 || 2;
        },

        initActiveField: function () {
            if (userState === 1) {
                activeField = 0;
            }
        },

        showGameInformation: function () {
            document.getElementById("game-information").innerHTML = ( userState === 1 ) ?
                "user plays X's and computer plays O's" :
                "computer plays X's and user plays O's";
        },

        showControlsInformation: function () {
            document.getElementById("controls-information").innerHTML =
                "choose field with arrows, make move with 'enter' or 'space'";
        },

        begin: function () {
            if (aiState === 1) {
                this.aiMakesMove()
            }

            this.setKeyListener();
            this.turnOnKeyListener();
        },

        aiMakesMove: function () {
            if (!endOfGame) {
                do {
                    activeField = Math.floor(Math.random() * gameSize * gameSize);
                } while (!this.makeMove(aiState));
            }

        },
        userMakesMove: function () {
            let oldActiveField = activeField;
            if (this.makeMove(userState)) {
                this.aiMakesMove();
                document.getElementById("cell-" + oldActiveField).className = this.getCellClass(oldActiveField);
            }

        },

        showField: function () {
            document.getElementById("board").style.width = gameSize * (cellWidth + borderWidth * 2) + "px";
            fieldArr.map((a, i) => document.getElementById("board").appendChild(this.showCell(i)));
        },

        showCell: function (i) {
            let cell = document.createElement("div");
            cell.className = this.getCellClass(i);
            cell.id = "cell-" + i;
            cell.innerHTML = "";
            return cell
        },

        makeMove: function (state) {
            if (this.setState(activeField, state)) {
                lastMove = {active: activeField, state};
                this.updateCellClass(activeField);
                if (this.checkEnd()) {
                    this.close();
                }
                return true;
            }
            return false;
        },

        updateCellClass: function (field) {
            document.getElementById("cell-" + field).className = this.getCellClass(field);
        },

        getCellClass: function (i) {
            let cl = "cell";

            if (fieldArr[i] === 1) {
                cl += " x";
            }
            if (fieldArr[i] === 2) {
                cl += " o";
            }
            if (activeField === i) {
                cl += " active-cell"
            }

            return cl;
        },

        close: function () {
            this.turnOffKeyListener();
            this.showEndGameMessage();
            setTimeout(Menu.start.bind(Menu), closingDelay);
            setTimeout(() => document.getElementById("board").innerHTML = "", closingDelay);
            setTimeout(this.hideEndGameMessages, closingDelay);
            setTimeout(this.hideGameInformation, closingDelay);
            setTimeout(this.hideControlsInformation, closingDelay);

        },

        showEndGameMessage: function () {
            let eogMessage = "something strange has happened and the game ended not correctly";

            if (winner === userState) {
                eogMessage = "user wins";
            }

            if (winner === aiState) {
                eogMessage = "computer wins";
            }

            if (winner === 0) {
                eogMessage = "we have a draw";
            }

            document.getElementById("game-over-text").innerHTML = eogMessage + "</br>wait few seconds till restart";
            document.getElementById("game-over").style.display = "flex";

        },

        hideEndGameMessages: function () {
            document.getElementById("game-over").style.display = "none";
            document.getElementById("game-over-text").innerHTML = "";
        },

        hideGameInformation: function () {
            document.getElementById("game-information").innerHTML = "";
        },

        hideControlsInformation: function () {
            document.getElementById("controls-information").innerHTML = "";
        },

        setState: function (field, state) {
            if (fieldArr[field] !== 0) {
                return false;
            }
            if (state !== 1 && state !== 0 && state !== 2) {
                return false;
            } else {
                fieldArr[field] = state;
                return true;
            }
        },

        moveActiveField: function (step) {
            let oldActive = activeField;

            if (activeField + step >= 0 && activeField + step <= gameSize * gameSize - 1) {
                activeField += step;
                document.getElementById("cell-" + oldActive).className = this.getCellClass(oldActive);
                document.getElementById("cell-" + activeField).className = this.getCellClass(activeField);
            }
        },

        checkEnd: function () {
            let winCondition = RegExp("(" + lastMove.state + ")" + "{" + win + "}");

            if (this.getFieldCombs(activeField).filter(a => a.match(winCondition)).length > 0) {
                winner = lastMove.state;
                return endOfGame = true;
            }

            if (fieldArr.filter(a => a === 0).length === 0) {
                winner = drawState;
                return endOfGame = true;
            }

            return false;
        },

        getFieldCombs: function (field) {
            let row = Math.ceil((field + 1) / gameSize),
                col = (field + 1) % gameSize || gameSize;

            return [
                this.getVerticalLine(field, row, col),
                this.getHorizontalLine(field, row, col),
                this.getLeftDiagonalLine(field, row, col),
                this.getRightDiagonalLine(field, row, col)
            ]
        },

        getVerticalLine: function (field, row, col) {
            let verticalLine = [fieldArr[field]],
                checkRow,checkCol;
            for (let i = 1; i <= win; i++) {
                checkRow = (row - i);
                checkCol = col;
                if (checkRow > 0 && checkRow < gameSize + 1) {
                    verticalLine.unshift(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
                checkRow = row + i;
                if (checkRow > 0 && checkRow < gameSize + 1) {
                    verticalLine.push(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
            }

            return verticalLine.join("");
        },

        getHorizontalLine: function (field, row, col) {
            let horizontalLine = [fieldArr[field]],
                checkRow,checkCol;
            for (let i = 1; i <= win; i++) {
                checkRow = row;
                checkCol = (col - i);
                if (checkCol > 0 && checkCol < gameSize + 1) {
                    horizontalLine.unshift(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
                checkCol = (col + i);
                if (checkCol > 0 && checkCol < gameSize + 1) {
                    horizontalLine.push(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
            }

            return horizontalLine.join("");
        },

        getLeftDiagonalLine: function (field, row, col) {
            let leftDiagonal = [fieldArr[field]],
                checkRow,checkCol;
            for (let i = 1; i <= win; i++) {
                checkRow = (row - i);
                checkCol = (col - i);
                if (checkRow > 0 && checkRow < gameSize + 1 && checkCol > 0 && checkCol < gameSize + 1) {
                    leftDiagonal.unshift(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
                checkRow = (row + i);
                checkCol = (col + i);
                if (checkRow > 0 && checkRow < gameSize + 1 && checkCol > 0 && checkCol < gameSize + 1) {
                    leftDiagonal.push(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
            }

            return leftDiagonal.join("");
        },

        getRightDiagonalLine: function (field, row, col) {
            let rightDiagonal = [fieldArr[field]],
                checkRow,checkCol;
            for (let i = 1; i <= win; i++) {

                checkRow = (row - i);
                checkCol = (col + i);
                if (checkRow > 0 && checkRow < gameSize + 1 && checkCol > 0 && checkCol < gameSize + 1) {
                    rightDiagonal.push(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }

                checkRow = (row + i);
                checkCol = (col - i);
                if (checkRow > 0 && checkRow < gameSize + 1 && checkCol > 0 && checkCol < gameSize + 1) {
                    rightDiagonal.unshift(fieldArr[(checkRow - 1) * gameSize + checkCol - 1])
                }
            }

            return rightDiagonal.join("");

        },

        turnOnKeyListener: () => addEventListener("keydown", keysCallback),
        turnOffKeyListener: () => removeEventListener("keydown", keysCallback),
        setKeyListener: function () {
            keysCallback = this.keysFunction.bind(this)
        },

        keysFunction: function (e) {
            switch (e.keyCode) {
                case 37:
                    this.moveActiveField(-1);
                    break;
                case 38:
                    this.moveActiveField(-gameSize);
                    break;
                case 39:
                    this.moveActiveField(1);
                    break;
                case 40:
                    this.moveActiveField(gameSize);
                    break;
                case 13:
                    this.userMakesMove();
                    break;
                case 32:
                    this.userMakesMove();
                    break;
                default:
                    break;
            }
        },

    }

}