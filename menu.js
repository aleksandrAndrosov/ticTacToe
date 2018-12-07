function makeMenu() {
    let hText = 'hi, username',
        btnsArr = [
            {
                id: 'btn-play-3',
                name: 'play 3x3',
                method: 'startGame',
                params: {size:3,win:3}
            },
            {
                id: 'btn-play-4',
                name: 'play 4-4',
                method: 'startGame',
                params: {size:4,win:4}
            },
            {
                id: 'btn-quit',
                name: 'quit',
                method: 'quit',
            }
        ],
        btnsCount = btnsArr.length,
        activeButton = 0,
        keys;


    return {

        start: function (){
            this.appendPopup();
            //todo тут я фиксирую функцию, которая будет колбеком для event listener - может как-то по другому сделать?
            keys = this.keysFunction.bind(this);
            Menu.turnOnListener();
        },

        appendPopup: function () {
            document.getElementById('welcome').innerHTML = hText;
            btnsArr.map(a => document.getElementById(a.id).innerHTML = a.name);
            this.makeButtonActive();
            document.getElementById('popup').className = "popup popup-active";
            console.log(btnsCount, activeButton, btnsArr);
        },
        hidePopup: function () {
            document.getElementById('popup').className = "popup";
        },

        makeButtonActive: function () {document.getElementById(btnsArr[activeButton].id).className = "btn btn-active" },
        makeButtonNotActive: function () {document.getElementById(btnsArr[activeButton].id).className = "btn" },

        keysFunction: function (e) {
            switch (e.keyCode) {

                case 38:   // если нажата клавиша вверх
                    this.changeActive(-1);break;
                case 40:   // если нажата клавиша вниз
                    this.changeActive(1);break;
                case 13:   // если нажата клавиша enter
                    this.select();break;
                case 32:   // если нажата клавиша space
                    this.select();break;
                default: console.log(e.keyCode); break;
            }
        },

        turnOffListener: function () {document.removeEventListener('keydown', keys)},

        turnOnListener: function () {document.addEventListener("keydown", keys)},

        changeActive: function(value) {
            this.makeButtonNotActive();
            this.changeActiveButton(value);
            this.makeButtonActive();
        },

        changeActiveButton: function(value){
            activeButton = (activeButton + value) % btnsCount;
            if( activeButton<0 ){ activeButton = (activeButton + btnsCount) % btnsCount }

        },

        select: function() {
            switch(btnsArr[activeButton].method) {
                case 'quit': this.quit(); break;
                case 'startGame': this.startGame(btnsArr[activeButton].params); break;
                default: break;
            }
        },

        quit: function() {
            console.log('quit');
            this.turnOffListener();
        },

        startGame(params){
            this.turnOffListener();
            this.hidePopup();
            let game = createGame(params.size,params.win);
            setTimeout(game.start.bind(game),1000);
        }

    }
}


const Menu = makeMenu();
Menu.start()