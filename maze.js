let canvasDiv;
let canvas;
let ctx;
let WIDTH = 1000;
let HEIGHT= 1000;
let paused = false;
//creates canvas (initializes global variables)


//Walls
let walls = [];

let initialized = false;
//is game initialized?

let mouseX = 0;
let mouseY = 0;
//mouse positions
let mousePos = {
  x: 0,
  y: 0
};

let mouseClicks = {
  x: 0,
  y: 0
};

let mouseClickX = 0;
let mouseClickY = 0;

function mouseCollide(obj) {
  if (mouseClickX <= obj.x + obj.w &&
    obj.x <= mouseClickX&&
    mouseClickY <= obj.y + obj.h &&
    obj.y <= mouseClickY
  ) {
    return true;
  }
}

let keysDown = {};
//USER INPUT
addEventListener("keydown", function (e) {
    keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.key];
}, false);
//initialize game function
function init() {
canvasDiv = document.createElement("div");
canvasDiv.id = "chuck";
//creates content
canvas = document.createElement('canvas');
anvasDiv.appendChild(canvas);
//creates div element
const currentDiv = document.getElementById("div1");
  document.body.insertBefore(canvasDiv, currentDiv);
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.getElementById("chuck").style.width = canvas.width + 'px';
  document.getElementById("chuck").style.height = canvas.height + 'px';
  ctx = canvas.getContext('2d');
  initialized = true;
}
//Creates player character
class Sprite {
  constructor(w, h, x, y, c) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = c;
    this.spliced = false;
    }
    get cx() {return this.x + this.w * 0.5; }
    get cy() {return this.y + this.h * 0.5; }
    inbounds(){
      if (this.x + this.w < WIDTH &&
          this.x > 0 &&
          this.y > 0 &&
          this.y + this.h < HEIGHT){
            console.log ('inbounds..');
        return true;
      }
      else{
        return false;
      }
    }
//collisions
    colliderectangle(rect) {

      var dx = rect.cx - this.cx;
      var dy = rect.cy - this.cy;
      var aw = (rect.w + this.w) * 0.5;
      var ah = (rect.h +this.h) * 0.5;

      if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

      if (Math.abs(dx / this.w) > Math.abs(dy / this.h)) {
      

        if (dx < 0) {rect.x = this.x - rect.w;
          ctx.fillStyle = 'green';
          ctx.fillRect(0, 0, WIDTH/0, HEIGHT/0);
          ctx.strokeRect(0, 0, WIDTH/0, HEIGHT/0);
        }// left
        else rect.x = this.x + this.w; // right
        

      } else {

        if (dy < 0) rect.y = this.y - rect.h; // top
        else rect.y = this.y + this.h; // bottom

      }

      return true;

    }
    collide(obj) {
      if (this.x <= obj.x + obj.w &&
        obj.x <= this.x + this.w &&
        this.y <= obj.y + obj.h &&
        obj.y <= this.y + this.h
      ) {
        return true;
      }
    }
}

class Player extends Sprite {
  constructor(w, h, x, y, c, vx, vy) {
  super(w, h, x, y, c);
  this.vx = vx;
  this.vy = vy;
  this.speed = 3;
  this.canjump = true;
  }
  moveinput() {
    if ('w' in keysDown || 'W' in keysDown) { // Player control
        this.dx = 0;
        this.dy = -1;  
        // this.vx = 0;
        this.vy = -this.speed;
    } else if ('s' in keysDown || 'S' in keysDown) { // Player control
        this.dx = 0;
        this.dy = 1;  
        // this.vx = 0;
        this.vy = this.speed;

    } else if ('a' in keysDown || 'A' in keysDown) { // Player control
        this.dx = -1;
        this.dy = 0;
        // this.vy = 0;
        this.vx = -this.speed;

    } else if ('d' in keysDown || 'D' in keysDown) { // Player control
        this.dx = 1;
        this.dy = 0;
        // this.vy = 0;
        this.vx = this.speed;
    } else if ('e' in keysDown || 'E' in keysDown) { // Player control
      this.w += 1;
  }
  else if ('p' in keysDown || 'P' in keysDown) { // Player control
    paused = true;
}
    else if (' ' in keysDown && this.canjump) { // Player control
      console.log(this.canjump);
      this.vy -= 45;
      this.canjump = false;
      
  }
    else{
      // this.dx = 0;
      // this.dy = 0;
      this.vx = 0;
      this.vy = GRAVITY;
    }
}
  update(){
    this.moveinput();
    if (!this.inbounds()){
      if (this.x <= 0) {
        this.x = 0;
      }
      if (this.x + this.w >= WIDTH) {
        this.x = WIDTH-this.w;
      }
      if (this.y+this.h >= HEIGHT) {
        this.y = HEIGHT-this.h;
        this.canjump = true;
      }
      this.x += this.vx;
    this.y += this.vy;
    }
    collide(obj) {
      if (this.x <= obj.x + obj.w &&
        obj.x <= this.x + this.w &&
        this.y <= obj.y + obj.h &&
        obj.y <= this.y + this.h
      ) {
        console.log('collided with ' + obj);
        return true;
      }
    }
}
//player sprite
class Player extends Sprite {
  constructor(w, h, x, y, c, vx, vy) {
  super(w, h, x, y, c);
  this.vx = vx;
  this.vy = vy;
  this.speed = 3;
  }
  moveinput() {
    if ('w' in keysDown || 'W' in keysDown) { // Player control
        this.vx = 0;
        this.vy = -this.speed;
        console.log('w!!!');
    } else if ('s' in keysDown || 'S' in keysDown) { // Player control
        this.vx = 0;
        this.vy = this.speed;

    } else if ('a' in keysDown || 'A' in keysDown) { // Player control
        this.vy = 0;
        this.vx = -this.speed;

    } else if ('d' in keysDown || 'D' in keysDown) { // Player control
        this.vy = 0;
        this.vx = this.speed;
    }
    else{
      this.vx = 0;
      this.vy = 0;
    }
}
 update(){
    this.moveinput();
    this.inbounds();
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}
addEventListener('mousedown', mouseClick);

function mouseClick(e) {
  console.log(`Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`);
  mouseClickX = e.clientX;
  mouseClickY = e.clientY;
  mouseClicks = {
    x: mouseClickX,
    y: mouseClickY
  };
}
function drawText(color, font, align, base, text, x, y) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}

class Wall extends Sprite {
  constructor(w, h, x, y, c) {
    super(w, h, x, y, c);
    this.type = "normal";
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.key];
}, false);

addEventListener('mousemove', function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;

  mousePos = {
    x: mouseX,
    y: mouseY
  };
});

addEventListener('mousedown', function (e) {
  mouseClickX = e.offsetX;
  mouseClickY = e.offsetX;
  mouseClicks = {
    x: mouseClickX,
    y: mouseClickY
  };
});

//update elements on canvas
function update() {
  player.update();
  for (let w of walls){
    if (w.colliderectangle(player__)){
  console.log('new collision text...');
    }
}
