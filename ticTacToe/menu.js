const Menu = makeMenu();
Menu.start();

function makeMenu() {
    let headerText = "hi, username",
        buttonsArr = [
            {
                id: "btn-play-3",
                name: "play 3x3",
                method: "startGame",
                params: {size:3,win:3}
            },
            {
                id: "btn-play-4",
                name: "play 4x4",
                method: "startGame",
                params: {size:4,win:4}
            },
            {
                id: "btn-play-5",
                name: "play 5x5",
                method: "startGame",
                params: {size:5,win:4}
            },
            {
                id: "btn-quit",
                name: "quit",
                method: "quit",
            }
        ],
        buttonsCount = buttonsArr.length,
        activeButton = 0,
        keysCallback,
        startGameDelay = 12000;


    return {

        start: function (){
            this.initMenu();
            this.showMenu();
            this.setKeyListener();
            this.turnOnListener();

            //ads must be reinitiated each time
            adsInit();
        },

        initMenu: function () {
            document.getElementById("menu").innerHTML = "";
            this.appendMenuHeader();
            buttonsArr.map(this.appendMenuButton);
            this.makeButtonActiveClass();
        },

        appendMenuHeader: function() {
            let header = document.createElement("h2");
            header.id = "menu-header";
            header.innerHTML = headerText;
            document.getElementById("menu").appendChild(header);
        },

        appendMenuButton: function(buttonObj) {
            let button = document.createElement("div");
            button.className = "btn";
            button.id = buttonObj.id;
            button.innerHTML = buttonObj.name;
            document.getElementById("menu").appendChild(button);
        },

        showMenu: function () {
            document.getElementById("menu").className = "menu menu-active";
        },

        hideMenu: function () {
            document.getElementById("menu").className = "menu";
        },

        makeButtonActiveClass: () => document.getElementById(buttonsArr[activeButton].id).className = "btn btn-active",
        makeButtonNotActiveClass: () => document.getElementById(buttonsArr[activeButton].id).className = "btn",

        moveActiveButtonClass: function(value) {
            this.makeButtonNotActiveClass();
            this.changeActiveButton(value);
            this.makeButtonActiveClass();
        },

        changeActiveButton: function(value){
            activeButton = (activeButton + value) % buttonsCount ;
            if( activeButton<0 ){ activeButton = (activeButton + buttonsCount) % buttonsCount }
        },

        select: function() {
            switch(buttonsArr[activeButton].method) {
                case "quit":
                    this.quit();
                    break;
                case "startGame":
                    this.startGame(buttonsArr[activeButton]);
                    break;
                default:
                    break;
            }
        },

        quit: function() {
            this.turnOffListener();
            window.location = "http://androsov.in.ua";
        },

        startGame(buttonObj){
            let game = createGame(buttonObj.params.size,buttonObj.params.win);

            this.turnOffListener();
            this.playVideo(buttonObj.id);
            this.hideMenu();
            setTimeout(game.start.bind(game), startGameDelay);
            setTimeout(this.hideVideo, startGameDelay);
        },

        playVideo: function(buttonId) {
            document.getElementById("adsContainer").style.display = "block";
            document.getElementById("game-information").innerHTML = "wait few seconds. the game is still loading";
            document.getElementById(buttonId).addEventListener("click",playAds);
            document.getElementById(buttonId).click();
            document.getElementById(buttonId).removeEventListener("click",playAds);
        },

        hideVideo: function() {
            document.getElementById("adsContainer").style.display = "none";
        },

        turnOffListener: () => document.removeEventListener("keydown", keysCallback),
        turnOnListener:  () => document.addEventListener("keydown", keysCallback),
        setKeyListener: function () {
            keysCallback = this.keysFunction.bind(this)
        },

        keysFunction: function (e) {
            switch (e.keyCode) {
                case 38:
                    this.moveActiveButtonClass(-1);
                    break;
                case 40:
                    this.moveActiveButtonClass(1);
                    break;
                case 13:
                    this.select();
                    break;
                case 32:
                    this.select();
                    break;
                default:
                    break;
            }
        },
    }
}