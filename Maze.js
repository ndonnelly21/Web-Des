//sources
// https://eloquentjavascript.net/code/chapter/17_canvas.js
// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event

//##################### ALL GLOBALS AND UTILITY FUNCTIONS ###################

//initializing GLOBAL variables to create a canvas
let canvasDiv;
let canvas;
let ctx;
let WIDTH = 768;
let HEIGHT= 768;
let SCORE = 0;
let GRAVITY = 0;
let paused = false;
let timerThen = Math.floor(Date.now() / 1000);

//
let effects = [];

//Arrays for walls (vertical & horitzontal)
let walls = [];
let walls2 = [];




// is game initialized? 
let initialized = false;

// setup mouse position variables
let mouseX = 0;
let mouseY = 0;

// object setting mousePos
let mousePos = {
  x: 0,
  y: 0
};

let mouseClick = {
  x: null,
  y: null
};


function pointCollide(point, obj) {
  if (point.x <= obj.x + obj.w &&
    obj.x <= point.x &&
    point.y <= obj.y + obj.h &&
    obj.y <= point.y
  ) {
    console.log('point collided');
    return true;
  }
}

function signum(){
 let options = [-1,1];
 index = Math.floor(Math.random()*options.length);
 result = options[index];
 return result;
}



// draws text on canvas
function drawText(color, font, align, base, text, x, y) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}

//Timers and counters

function countUp(end) {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  if (currentTimer >= end){
    return end;
  }
  return currentTimer;
}

function counter() {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  return currentTimer;
}

function timerUp(x, y) {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  if (currentTimer <= y && typeof (currentTimer + x) != "undefined") {
      return currentTimer;
  } else {
      timerThen = timerNow;
      return x;
  }
}

function timerDown() {
  this.time = function (x, y) {
      // this.timerThen = Math.floor(Date.now() / 1000);
      // this.timerNow = Math.floor(Date.now() / 1000);
      this.timerThen = timerThen;
      this.timerNow = Math.floor(Date.now() / 1000);
      this.tick = this.timerNow - this.timerThen;
      if (this.tick <= y && typeof (this.tick + x) != "undefined") {
          return y - this.tick;
      } else {
          this.timerThen = this.timerNow;
          return x;
      }
  };
}



//########################### Initialize game function #######################

function init() {
  // create a new div element
  canvasDiv = document.createElement("div");
  canvasDiv.id = "chuck";
  // and give it some content
  canvas = document.createElement('canvas');
  // add the text node to the newly created div
  canvasDiv.appendChild(canvas);
  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(canvasDiv, currentDiv);
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.getElementById("chuck").style.width = canvas.width + 'px';
  document.getElementById("chuck").style.height = canvas.height + 'px';
  ctx = canvas.getContext('2d');
  initialized = true;
}


//############################ ALL GAME CLASSES #########################
//Player sprite
class Sprite {
  constructor(w, h, x, y, c) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = c;
    this.spliced = false;
    }
    get cx() { return this.x + this.w * 0.5; }
    get cy() { return this.y + this.h * 0.5; }
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
    //De
    //source for collision: https://pothonprogramming.github.io/
    collideRectangle(rect) {

      var dx = rect.cx - this.cx;// x difference between centers
      var dy = rect.cy - this.cy;// y difference between centers
      var aw = (rect.w + this.w) * 0.5;// average width
      var ah = (rect.h + this.h) * 0.5;// average height

      /* If either distance is greater than the average dimension there is no collision. */
      if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

      /* To determine which region of this rectangle the rect's center
      point is in, we have to account for the scale of the this rectangle.
      To do that, we divide dx and dy by it's width and height respectively. */
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
      // alert('out of bounds');
      // console.log('out of bounds');
    }
    
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
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

class Effect extends Sprite {
  constructor(w, h, x, y, c) {
    super(w, h, x, y, c);
    this.type = "normal";
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    update(){
      this.w+=2;
      this.h+=2;
      this.x-=1;
      this.y-=1;
      setTimeout(() => this.spliced = true, 250)
    }
}

// ###################### INSTANTIATE CLASSES ##########################
let player = new Player(25, 25, WIDTH-28, HEIGHT-28, 'red', 0, 0);
//"spawns" the player sprite at the bottom right of the canvas


//Randomized horizontal and vertical walls (also makes them green)
while (walls.length < 20){
  walls.push(new Wall(200,15, Math.floor(Math.random()*500), Math.floor(Math.random()*1000), 'green'));
}

//Vertical walls (reverse dimensions)
while (walls2.length < 20){
  walls2.push(new Wall(15,200, Math.floor(Math.random()*500), Math.floor(Math.random()*1000), 'green'));
}





// ########################## USER INPUT ###############################

let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.key];
}, false);

// gets mouse position when clicked
addEventListener('mousemove', function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  
  // we're gonna use this
  mousePos = {
    x: mouseX,
    y: mouseY
  };
});

// gets mouse position when clicked
addEventListener('mousedown', function (e) {
  // console.log(`Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`);
  mouseClick.x = e.offsetX;
  mouseClick.y = e.offsetY;
  effects.push(new Effect(15, 15, mouseClick.x - 7, mouseClick.y - 7, 'green'))
});

addEventListener('mouseup', function() {
  setTimeout(()=>{
    mouseClick.x = null;
    mouseClick.y = null;
  },
    1000
  )
  
});

let GAMETIME = null;
// ###################### UPDATE ALL ELEMENTS ON CANVAS ################################
function update() {
  player.update();
  for (e of effects) {
    e.update();
  }
  for (e in effects){
    if (effects[e].spliced){
      effects.splice(e, 1);
    }
  }
  //game reaches 60 seconds?
  GAMETIME = counter();
   if (GAMETIME > 60){
     alert("game over...");
   }
  //updates all mobs in a group
  //collisions with horizontal walls
  for (let w of walls){
   
     if (player.collide(w) && player.dy == 1){
       player.dx = 0;
       player.vy*=-1;
       player.y = w.y-player.h;
     }
     if (player.collide(w) && player.dy == -1){
       player.vy*=-1;
       player.y = w.y + w.h;
     }
     if (player.collide(w) && player.dx == 1){
       player.vx*=-1;
       player.x = w.x-player.w;
     }
     if (player.collide(w) && player.dx == -1){
       player.vx*=-1;
       player.x = w.x + w.w;
     }
  }


//Checking for collisions with vertical walls (walls 2)
  for (let w of walls2){
   
    if (player.collide(w) && player.dy == 1){
      player.dx = 0;
      player.vy*=-1;
      player.y = w.y-player.h;
    }
    if (player.collide(w) && player.dy == -1){
      player.vy*=-1;
      player.y = w.y + w.h;
    }
    if (player.collide(w) && player.dx == 1){
      player.vx*=-1;
      player.x = w.x-player.w;
    }
    if (player.collide(w) && player.dx == -1){
      player.vx*=-1;
      player.x = w.x + w.w;
    }
 }
//Is player sprite at top right position? (end here)
 if (player.x<10 && player.y<10){
  alert("YOU DID IT!!!");
 }


}

// ########## DRAW ALL ELEMENTS ON CANVAS ##########
function draw() {
  // clears the canvas before drawing
  //Text elements for start, end, and game timer
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText('black', "24px Helvetica", "left", "top", "END HERE", 10, 10);
  drawText('black', "24px Helvetica", "left", "top", "START HERE", 580, HEIGHT-30);
  drawText('black', "24px Helvetica", "left", "top", "Game Time: " + GAMETIME, 580, 10);

  player.draw();
//horizontal walls
  for (let w of walls){
    w.draw();
  }

//vertical walls
  for (let w of walls2){
    w.draw();
  }

  


}

// set variables necessary for game loop
let fps;
let now;
let delta;
let gDelta;
let then = performance.now();

// ########## MAIN GAME LOOP ##########
function main() {
  now = performance.now();
  delta = now - then;
  gDelta = (Math.min(delta, 17));
  fps = Math.ceil(1000 / gDelta);
  if (initialized) {
    if (!paused){
      update(gDelta);
    }
    draw();
  }
  then = now;
  requestAnimationFrame(main);
}