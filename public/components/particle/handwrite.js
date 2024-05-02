class HandWrite {
    constructor(text, color = "#1f2f90", speed = 5, dashLen = 220, x = 30, y = 50) {
        this.text = text;
        this.color = color;
        this.speed = speed;
        this.dashLen = dashLen;
        this.dashOffset = dashLen;
        this.length = 630;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.inti_y = y;
        this.init_x = x;
        this.letter = 0;
    }
}
HandWrite.prototype.resize = function(canvas, width = 600, height = 300) {
    //make it 100%;
    canvas.style.width = "100%";
    //set interanal size to match
    if(width <= 0 || height <= 0) {
        canvas.width = this.length;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}
HandWrite.prototype.update = function(canvas) {
    c = canvas.getContext("2d");
    c.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    c.lineWidth = 5;
    c.lineJoin = "round";
    //c.globalAlpha = 2/3;
    c.strokeStyle = c.fillStyle = this.color;
    c.textAlign = "center";

    if(this.letter >= this.text.length) {
        return;
    }
    //clear if frame is reset
    if(this.frame == 0) {
        
        //measure new dimensions
        this.length = c.measureText(this.text).width + ((c.lineWidth + 5) * this.text.length);
        this.resize(canvas, 0, 0);
        c.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.frame++;

    c.clearRect(this.x, 0, 60, 150);
    c.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]);
    this.dashOffset -= this.speed;

    c.strokeText(this.text[this.letter], this.x, this.y);

    if(this.dashOffset <= 0) {
        //fill the letter
        c.fillText(this.text[this.letter], this.x, this.y);
        this.dashOffset = this.dashLen;

        //prep next char
        this.x += c.measureText(this.text[this.letter++]).width + c.lineWidth * Math.random() + 5;

        c.setTransform(1, 0, 0, 1, 0, 3 * Math.random());

        c.rotate(Math.random() * 0.005);
    }
}
HandWrite.prototype.reset = function(text, color) {
    this.text = text;
    this.color = color;
    this.letter = 0;
    this.x = this.init_x;
    this.frame = 0;
}