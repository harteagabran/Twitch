class SquareReveal {
    constructor(row = 7, buffer = 2) {
        this.amnt = row;
        this.frame = 0;
        this.buffer = buffer;
        this.wait = 100;
        this.squares = row * row;
        this.startGrid = new Array();
        this.index = 0;
        this.play = false;
        this.finish = false;
        this.indexRan = new Array();
        this.currentGrid;
    }
}
SquareReveal.prototype.init = function() {
    for(let sq = 0; sq < this.squares; sq++) {
        this.startGrid.push(1);
    }
    this.currentGrid = this.startGrid.slice();
}
SquareReveal.prototype.reset = function() {
    this.currentGrid = this.startGrid.slice();
    this.indexRan = [];
    this.play = false;
    this.wait = 100;
    this.frame = 0;
    for(var count = 0; count < this.squares; count++) {
        this.indexRan.push(count);
    }
    this.finish = false;
}
SquareReveal.prototype.update = function(canvas) {
    var c = canvas.getContext("2d");
    this.frame++;
    //if finished do nothing
    if(this.finish) {
        return;
    }

    //draw square
    this.draw(canvas);
    
    //subtract wait time to start play
    this.wait--;
    
    if(this.wait == 0) {
        this.play = true;
        removeBlink();
    }

    //check if play is true to start taking off squares
    if(this.play) {
        //if not reach buffer stop here
        if(this.frame % this.buffer != 0) {
            return;
        }
        this.changeGrid();
    }
    
    //if last square is gone
    if(this.indexRan.length == 0) {
        //stop animation
        //draw one more time
        this.draw(canvas);
        this.finish = true;
        playGotSound();
    }
}
SquareReveal.prototype.draw = function(canvas) {
    var c = canvas.getContext("2d");
    this.index = 0;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    for(var row = 0; row < this.amnt; row++) {
        for(var col = 0; col < this.amnt; col++) {
            //if 1 draw square
            if(this.currentGrid[this.index] == 1) {
                c.beginPath();
                c.rect(col * 10, row * 10, 10, 10);
                c.fillStyle = 'black';
                c.fill();
            }
            this.index++;
        }
    }
    c.restore();
}
SquareReveal.prototype.changeGrid = function() {
    let num = Math.floor(Math.random() * this.indexRan.length);
    let chosen = this.indexRan[num];

    //delete selected on random and updated index grid
    this.indexRan.splice(num, 1);
    this.currentGrid[chosen] = 0;
}