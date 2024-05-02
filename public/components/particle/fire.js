class FireSystem {
    constructor(add = 10, speed = 3, max = 60, size = 20, life = 0) {
        this.particles = [];
        this.particleAdd = add;
        this.speed = speed;
        this.max = max;
        this.life = life;
        this.size = size;
    }
}
FireSystem.prototype.update = function(canvas) {
    //Add new particles every frame
    var c = canvas.getContext("2d");
    c.globalCompositeOperation="xor";
    
    for(let part = 0; part < this.particleAdd; part++) {
        //add a particle in postion of canvas;
        var p = new FireParticle(canvas.width / 2, canvas.height - 16, (Math.random() * 2 * this.speed - this.speed)/ 2, 0 - Math.random() * 2 * this.speed, this.life, this.size);
        this.particles.push(p);
    }


    //Clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.globalCompositeOperation = "lighter";
    //Cycle through all particles
    for(let i = 0; i < this.particles.length; i++) {
        //draw particle
        this.particles[i].draw(c, this.max);
        //update particle position
        this.particles[i].update();

        //if lived too long 
        if(this.particles[i].life >= this.max) {
            this.particles.splice(i, 1);
            i--;
        }
    }
}
FireSystem.prototype.resize = function(canvas, width = 600, height = 300) {
    //make it 100%;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    //set interanal size to match
    if(width <= 0 || height <= 0) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}

class FireParticle {
    constructor(x, y, xs, ys, life = 0, size = 20) {
        this.x = x;
        this.y = y;
        this.xs = xs;
        this.ys = ys;
        this.life = life;
        this.size = size;
    }
}
FireParticle.prototype.draw = function(c, max) {
    //start out red and change to gray out the longer its been alive for
    c.fillStyle = "rgba(" + (260 - (this.life * 2)) + "," + ((this.life * 2) + 50) + "," + (this.life * 2) + "," + (((max - this.life) / max) * 0.4) + ")";

    c.beginPath();
    //gets smaller the longer its been alive
    c.arc(this.x, this.y, (max-this.life)/max*(this.size/2)+(this.size/2), 0, 2 * Math.PI);
    c.fill();
}
FireParticle.prototype.update = function() {
    this.x += this.xs;
    this.y += this.ys;

    this.life++;
}