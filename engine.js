


function checkEnd(){

}

//returns object with arrays of combnations to the cell
function getCellCombs(size,win,cell,fieldArr){
    let row = Math.ceil((cell+1)/size),
        col = (cell+1) % size || size,
        res = {};
    console.log(row, col);
    console.log(fieldArr[100]);

    function makeCellArr(step) {
        let arr = [fieldArr[cell]];
        for (let i=1; i<win; i++){
            arr.unshift(fieldArr[cell-step*i]);
            arr.push(fieldArr[cell+step*i]);
            //console.log(step*i,arr);
        }
        return arr.filter(a => typeof a!== 'undefined');
    }


    res.leftDiagonal = [fieldArr[cell]];
    res.rightDiagonal = [fieldArr[cell]];
    res.horizontalLine = [fieldArr[cell]];
    res.verticalLine = [fieldArr[cell]];
    for(let i = 1; i<=win; i++){
        let checkRow = (row-i),
            checkCol = (col-i);
        if(checkRow > 0 && checkRow < size + 1 && checkCol > 0 && checkCol < size + 1){res.leftDiagonal.unshift(fieldArr[(checkRow-1)*size + checkCol-1])};
            checkRow = (row+i);
            checkCol = (col+i);
        if(checkRow > 0 && checkRow < size + 1 && checkCol > 0 && checkCol < size + 1){res.leftDiagonal.push(fieldArr[(checkRow-1)*size + checkCol-1])};

        checkRow = (row-i);
            checkCol = (col+i);
        if(checkRow > 0 && checkRow < size + 1 && checkCol > 0 && checkCol < size + 1){res.rightDiagonal.push(fieldArr[(checkRow-1)*size + checkCol-1])};
        checkRow = (row+i);
            checkCol = (col-i);
        if(checkRow > 0 && checkRow < size + 1 && checkCol > 0 && checkCol < size + 1){res.rightDiagonal.unshift(fieldArr[(checkRow-1)*size + checkCol-1])};

        //horizontal
            checkRow = row;
            checkCol = (col-i);
        if(checkCol > 0 && checkCol < size + 1){res.horizontalLine.unshift(fieldArr[(checkRow-1)*size + checkCol-1])};
            checkCol = (col+i);
        if(checkCol > 0 && checkCol < size + 1){res.horizontalLine.push(fieldArr[(checkRow-1)*size + checkCol-1])};

        //vertical
        checkRow = (row-i);
        checkCol = col;
        if(checkRow > 0 && checkRow < size + 1){res.verticalLine.unshift(fieldArr[(checkRow-1)*size + checkCol-1])};
        checkRow = row+i;
        if(checkRow > 0 && checkRow < size + 1){res.verticalLine.push(fieldArr[(checkRow-1)*size + checkCol-1])};
    }

    res.arr = [res.leftDiagonal,res.rightDiagonal,res.horizontalLine,res.verticalLine]
    console.log(res);
    return res;

}






//todo нужна проверка, чтобы не было уже создано
function createGame(s, w){
    let fieldArr = Array.from({length: s*s}, () => 0 ),
    active = 0,
    size = s,
    win = w,
    lastMove,
    keysCallback,
    userState = 1,
    aiState = 2,
    endOfGame = false,
    winner = 0;


    return {
        aiMakesMove : function(){
                if(!endOfGame) {
                    do {
                        active = Math.floor(Math.random() * size * size);
                        console.log('ai = ', active);
                    } while (!this.makeMove(aiState));
                }

        },
        userMakesMove : function(){
          console.log('length = ' + fieldArr.filter(a => a===0).length);
          let oldActive=active;
          if(this.makeMove(userState)) {
              this.aiMakesMove();
              document.getElementById('cell-' + oldActive).className = this.getCellClass(oldActive);
          }

        },

        start: function(){
            keysCallback = this.keysFunction.bind(this);
            this.showField();
            this.turnOnKeyListener();
            console.log('game started');
        },

        getSize: function(){
            return size;
        },

        showField: function(){
            console.log(fieldArr);
            document.getElementById('board').style.width = size*102+'px';

            fieldArr.map((a,i) => {
                let board = document.createElement('div');
                board.className = i===active ? "cell active-cell" : "cell";

                board.id = 'cell-'+i;
                board.innerHTML='';

                document.getElementById('board').appendChild(board);
            });
        },

        checkEnd: function(){
            console.log(lastMove);
            let row = Math.ceil((lastMove.active+1)/size),
                col = (lastMove.active+1) % size || size,
                winCondition = RegExp('('+lastMove.state+')'+'{'+win+'}');
            console.log(winCondition);
            console.log(row, col);
            console.log(fieldArr[100]);

            let combs = getCellCombs(s,w,active,fieldArr);
            if( combs.arr.map(a => a.reduce((acc,cur)=>acc+cur,'').match(winCondition))
                .filter(a=>a!==null)
                .length > 0) {
                winner = lastMove.state;
                console.log (lastMove.state + " wins");
                endOfGame = true;
                return true;
            }

            if (fieldArr.filter(a => a ===0).length === 0) {
                console.log (winner + " wins");
                endOfGame = true;
                return true;
            }

            return false;

        },

        getCellClass: function(i){
            let cl = 'cell';
            if(fieldArr[i] === 1){ cl += ' x'; }
            if(fieldArr[i] === 2){ cl += ' o'; }
            if (active === i) { cl += ' active-cell' }
            return cl;
        },

        //todo why uses active???
        updateCellState: function(){
            document.getElementById('cell-'+active).className = this.getCellClass(active);
        },


        makeMove: function(state){
            if(this.setState(state)){
                lastMove = {active, state};
                this.updateCellState();
                if(this.checkEnd()){
                    this.sayGameOver();
                }
                return true;
            }
            console.log('cant move');
            return false;

        },

        sayGameOver: function(){
            this.turnOffKeyListener();
            document.getElementById('game-over').style.display='flex';
            document.getElementById('game-over-text').innerHTML=winner + 'wins';
            setTimeout(Menu.start.bind(Menu),3000);
            setTimeout(()=>document.getElementById('board').innerHTML = '',3000);
        },

        //todo возвращвть инфй об ошибках
        setState: function(state){
            console.log('busy = ', active, 'arr = ', fieldArr[active]);
            if(fieldArr[active] !== 0){
                console.log('its busy');
                return false;
            }
            if(state !== 1 && state !== 0 && state !== 2 ){
                console.log('smth is wrong');
                return false;
            } else {
                fieldArr[active] = state;
                return true;
            }
        },

        moveActive: function(step){
            let oldActive = active;

            if(active+step >= 0 && active+step <= size*size-1) {
                active +=step;
                document.getElementById('cell-'+oldActive).className = this.getCellClass(oldActive);
                document.getElementById('cell-'+active).className = this.getCellClass(active);
            }
        },

        keysFunction: function(e){
            console.log(e.keyCode);
            switch(e.keyCode){
                case 37:  // если нажата клавиша влево
                    this.moveActive(-1); break;
                case 38:   // если нажата клавиша вверх
                    this.moveActive(-size); break;
                case 39:   // если нажата клавиша вправо
                    this.moveActive(1); break;
                case 40:   // если нажата клавиша вниз
                    this.moveActive(size); break;
                case 13:   // если нажата клавиша enter
                    this.userMakesMove(); break;
                case 32:   // если нажата клавиша space
                    this.userMakesMove(); break;
                default: console.log(e.keyCode); break;
            }
        },

        turnOnKeyListener: () => addEventListener("keydown", keysCallback),
        turnOffKeyListener: () => removeEventListener("keydown", keysCallback),


    }
}