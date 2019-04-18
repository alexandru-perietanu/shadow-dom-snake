(function () {

    class GameBoard extends HTMLElement {
        constructor() {
            super();

            const shadow = this.attachShadow({ mode: 'open' });
            const element = document.createElement('div');
            element.classList.add("container");
            this.interval = undefined;
            this.canChangeDirection = true;
            this.points = [{
                x: 0,
                y: 0
            },
            {
                x: 1,
                y: 0
            },
            {
                x: 2,
                y: 0
            },
            {
                x: 3,
                y: 0
            }
     
            ];
            this.model = [];
            this.elements = [];
            this.direction = 'R';

            element.innerHTML = `
            <style>
               square-element {
                   display: inline-block;
                   font-size: 0;
                   background: black;
                   position: absolute;
               }
            </style>
            `;

            shadow.appendChild(element);
        }

        connectedCallback() {
            this.lines = parseInt(this.getAttribute("lines"));
            this.columns = parseInt(this.getAttribute("columns"));
            this.squareWidth = parseInt(this.getAttribute("square-width"));
            this.style.width = `${this.columns * this.squareWidth}px`
            this.style.height = `${this.lines * this.squareWidth}px`
            this.createSquares();
            this.addListeners();
            this.startTimer();
            this.createFood();
        }

        createFood() {
            var posibleFoodPositions = [];
            for (let i = 0; i < this.lines; i++) {
                for (let j = 0; j < this.columns; j++) {
                    if (this.model[i][j] == 0) {
                        posibleFoodPositions.push({x: j, y: i});
                    }
                }
            }
            var pos = Math.round(Math.random() * (posibleFoodPositions.length - 1));
            this.model[posibleFoodPositions[pos].y][posibleFoodPositions[pos].x] = 2;
            this.elements[posibleFoodPositions[pos].y][posibleFoodPositions[pos].x].setAttribute("selected", "apple");
        }

        addListeners() {
            document.body.addEventListener("keydown", this._keyDown.bind(this));
        }

        _keyDown(e) {
            switch (e.code) {
                case "ArrowLeft":
                    if ((this.direction != "R" || this.direction != "L") && this.canChangeDirection) {
                        this.direction = "L";
                        this.canChangeDirection = false;
                    }

                    break;
                case "ArrowRight":
                    if ((this.direction != "L" || this.direction != "R" ) && this.canChangeDirection) {
                        this.direction = "R";
                        this.canChangeDirection = false;
                    }
                    break;
                case "ArrowUp":
                    if ((this.direction != "B" || this.direction != "B") && this.canChangeDirection) {
                        this.direction = "T";
                        this.canChangeDirection = false;
                    }
                    break;
                case "ArrowDown":
                    if ((this.direction != "T" || this.direction != "B") && this.canChangeDirection) {
                        this.direction = "B";
                        this.canChangeDirection = false;
                    }
                    break;
            }

        }

        createSquares() {
            var square;
            var container = this.shadowRoot.querySelector(".container");
            for (let i = 0; i < this.lines; i++) {
                this.model[i] = [];
                this.elements[i] = [];
                for (let j = 0; j < this.columns; j++) {

                    square = document.createElement("square-element");
                    this.model[i][j] = 0;
                    this.elements[i][j] = square;
                    square.setAttribute("square-width", this.squareWidth);
                    square.setAttribute("x", j * this.squareWidth);
                    square.setAttribute("y", i * this.squareWidth);
                    square.setAttribute("selected", false);
                    container.appendChild(square);
                }
            }

            for (let i = 0; i < this.points.length; i++) {
                this.model[this.points[i].y][this.points[i].x] = 1;
                this.elements[this.points[i].y][this.points[i].x].setAttribute("selected", true);
            }
        }

        gameMove() {
            this.model[this.points[0].y][this.points[0].x] = 0;
            this.points.push(this.points.splice(0, 1)[0]);
            var last = this.points.length - 1;
            var lastMinusOne = this.points.length - 2;
            this.points[last].x = this.points[lastMinusOne].x;
            this.points[last].y = this.points[lastMinusOne].y;
            switch (this.direction) {
                case "L":
                    this.points[last].x--;
                    break;
                case "R":
                    this.points[last].x++;
                    break;
                case "T":
                    this.points[last].y--;
                    break;
                case "B":
                    this.points[last].y++;
                    break;
            }
            if (this.points[last].x > this.columns - 1 ||
                this.points[last].x < 0 ||
                this.points[last].y < 0 ||
                this.points[last].y > this.lines - 1) {

                this.stopTimer();
                return;
            }

            if (this.model[this.points[last].y][this.points[last].x] == 1) {
                this.stopTimer();
            }
            if (this.model[this.points[last].y][this.points[last].x] == 2) {
                this.model[this.points[last].y][this.points[last].x] = 1;

                this.points.unshift({ x: this.points[0].x, y: this.points[0].y });
                if (this.points.length == this.lines * this.columns) {
                    this.stopTimer();
                    console.log("winner")
                    return;
                }

                this.createFood();
            }


            this.model[this.points[last].y][this.points[last].x] = 1;
            for (let i = 0; i < this.lines; i++) {
                for (let j = 0; j < this.columns; j++) {
                    if (this.model[i][j] == 1) {
                        this.elements[i][j].setAttribute("selected", true);
                    } else if (this.model[i][j] == 0) {
                        this.elements[i][j].setAttribute("selected", false);
                    } else {
                        this.elements[i][j].setAttribute("selected", "apple");
                    }
                }
            }
            this.canChangeDirection = true;
        }

        startTimer() {
            this.interval = setInterval(this.gameMove.bind(this), 150);
        }

        stopTimer() {
            clearInterval(this.interval);
        }
    }

    customElements.define('game-board', GameBoard);
})();

