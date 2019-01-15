//self invoking func for food
(function () {
    //to store each food elements
    var elements = [];

    //food constructor function
    function Food(xAxis, yAxis, width, height, color) {
        this.xAxis = xAxis || 0;
        this.yAxis = yAxis || 0;
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
    }
    //Position the food on the given map
    Food.prototype.init = function (map) {
        //clear all existing food
        remove();

        var divObj = document.createElement("div");
        map.appendChild(divObj);
        //styling the div object
        divObj.style.width = this.width + "px";
        divObj.style.height = this.height + "px";
        divObj.style.backgroundColor = this.color;
        //remove the divObj from the normal flow
        divObj.style.position = "absolute";
        //initialize the food position randomly
        this.xAxis = parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
        this.yAxis = parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
        divObj.style.left = this.xAxis + "px";
        divObj.style.top = this.yAxis + "px";

        elements.push(divObj);
    }
    //remove the divObj from its parent node and the elements
    function remove() {
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            ele.parentNode.removeChild(ele);
            elements.splice(i, 1);
        }
    }
    //export Food to global window object
    window.Food = Food;
}());

//self invoking func for snake
(function () {
    var elements = [];
    //snack constructor function
    function Snake(width, height, direction) {
        //common properties for each "square" of the snake
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || "right";
        //body
        this.body = [
            { xAxis: 3, yAxis: 2, color: "red" },
            { xAxis: 2, yAxis: 2, color: "orange" },
            { xAxis: 1, yAxis: 2, color: "orange" },
        ]
    }
    //init
    Snake.prototype.init = function (map) {
        //clear previous snake
        remove();

        for (var i = 0; i < this.body.length; i++) {
            var obj = this.body[i];
            var divObj = document.createElement("div");
            map.appendChild(divObj);
            //styling each "square"
            divObj.style.position = "absolute";
            divObj.style.width = this.width + "px";
            divObj.style.height = this.height + "px";
            divObj.style.left = obj.xAxis * this.width + "px";
            divObj.style.top = obj.yAxis * this.height + "px";
            divObj.style.backgroundColor = obj.color;

            elements.push(divObj);
        }
    }
    //move func
    Snake.prototype.move = function (food, map) {
        //change the position of each "square" from the end of the body
        //exclude the head
        var i = this.body.length - 1;
        for (; i > 0; i--) {
            this.body[i].xAxis = this.body[i - 1].xAxis;
            this.body[i].yAxis = this.body[i - 1].yAxis;
        }
        //set the direction of the head based on key press
        switch (this.direction) {
            case "right": this.body[0].xAxis += 1; break;
            case "left": this.body[0].xAxis -= 1; break;
            case "up": this.body[0].yAxis -= 1; break;
            case "down": this.body[0].yAxis += 1; break;
        }
        //identify if the snake catches the food
        var currentHeadX = this.body[0].xAxis * this.width;
        var currentHeadY = this.body[0].yAxis * this.height;        
        if (currentHeadX === food.xAxis && currentHeadY === food.yAxis) {
            //get the last element form the snake
            var last = this.body[this.body.length - 1];
            //add this element to the end of the snake body
            this.body.push({
                xAxis: last.xAxis,
                yAxis: last.yAxis,
                color: last.color
            });
            //create a new food square
            food.init(map);
            document.getElementById("card-body").innerText = window.ctr;
            window.ctr++;
        }
    }
    //remove the previous squares
    function remove() {
        var i = elements.length - 1;
        for (; i >= 0; i--) {
            var ele = elements[i];
            ele.parentNode.removeChild(ele);
            elements.splice(i, 1);
        }
    }
    //export snake to the global window object
    window.Snake = Snake;
}());

//self invoking func for game
(function () {
    //Game constuctor func
    function Game(map) {
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that = this;
    }
    //init
    Game.prototype.init = function () {
        this.food.init(this.map);
        this.snake.init(this.map);
        this.runSnake(this.food, this.map);
        this.bindKey();
    }
    //run func
    Game.prototype.runSnake = function (food, map) {
        var timerId = setInterval(function () {
            this.snake.move(food, map);
            this.snake.init(map);

            var maxX = map.offsetWidth / this.snake.width;
            var maxY = map.offsetHeight / this.snake.height;
            var currentHeadX = this.snake.body[0].xAxis;
            var currentHeadY = this.snake.body[0].yAxis;

            if (currentHeadX < 0 || currentHeadX >= maxX || currentHeadY < 0 || currentHeadY >= maxY) {
                clearInterval(timerId);
                alert("Game Over!");
            }

        }.bind(that), 150)
    }
    //bind key press event
    Game.prototype.bindKey = function () {
        document.addEventListener("keydown", function (event) {
            switch (event.keyCode) {
                case 37: this.snake.direction = "left"; break;
                case 38: this.snake.direction = "up"; break;
                case 39: this.snake.direction = "right"; break;
                case 40: this.snake.direction = "down"; break;
            }
        }.bind(that), false);
    }
    window.Game = Game;
}());

var gm = new Game(document.querySelector(".map"));
window.ctr =1;
gm.init();
