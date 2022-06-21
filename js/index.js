class CharacterObject {
  constructor(x, y, width, height, canvasContext, color) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.vxl = 0;
    this.vxr = 0;
    this.vyu = 0;
    this.vyd = 0;
    this.width = width;
    this.height = height;
    this.ctx = canvasContext;
    this.color = color;
  }
  
  updatePosition(){
    if(this.x >= 0){
      this.x += this.vxl;
      this.x += this.vxr;
    }else{
      this.x -= this.vx - 2;
    }
      this.y += this.vyu;
      this.y += this.vyd;
  }
  
  draw(){
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
//for objects with images
class ImageObject extends CharacterObject {
  constructor(x, y, width, height, canvasContext, imageElement) {
    super(x, y, width, height, canvasContext);
    this.image = imageElement;
  }

  draw(){
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
//for bullets
class BulletObject{
  constructor(x, y, radius, canvasContext, color, aim){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = canvasContext;
    this.color = color;
    this.aim = aim;
  }
  draw(){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fill()
  }
  update(){
    this.draw();
    this.x += this.aim.x;
    this.y += this.aim.y;
  }
}

window.onload = () => {
  //create a starting frame count of zero
  let totalFrameCount = 0;
  //will contain all of the zombies
  let zombieArray = [];
  //will contain all of bullets
  let bulletArray = [];
  let ammoArray = [1, 1, 1, 1, 1, 1];
  //initializes interval id to be used as a timer later
  let intervalId = null;
  function reset(){
    setTimeout(() => {
      const myCanvas = document.querySelector('canvas');
      const ctx = myCanvas.getContext('2d');
      menu.style.visibility = 'visible';
      ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
      totalFrameCount = 0;
      zombieArray = [];
      bulletArray = [];
      ammoArray = [1, 1, 1, 1, 1, 1];
    }, 5000)
  }
  //starts game when you click the start button
  const menu = document.getElementById('main-menu');
  document.getElementById('start-button').onclick = () => {
    setTimeout(() =>{
      menu.style.visibility = 'hidden';
      startGame();
    },500)
  };
  //game loop
  function startGame() {    
    //canvas and context
    const myCanvas = document.querySelector('canvas');
    const ctx = myCanvas.getContext('2d');

    //gets images loaded and ready to be used
    const floorImg = new Image();
    floorImg.src = '/images/floortest.png';

    //creates floor and player
    const myFloor = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, floorImg);
    const player = new CharacterObject(myCanvas.width/2, myCanvas.height/2, myCanvas.width/20, myCanvas.width/20, ctx, 'red');
    //zombie class references player
    class ZombieObject extends CharacterObject{
      constructor(x, y, width, height, canvasContext, color, aim){
        super(x, y, width, height, canvasContext, color);
        this.aim = aim;
      }
      //moves zombies towards player's current position
      update(){
        this.draw();
        let angle = Math.atan2(player.y - this.y, player.x - this.x)
        this.aim = {
          x: Math.cos(angle) * .2,
          y: Math.sin(angle) * .2
        }
        this.x += this.aim.x;
        this.y += this.aim.y;
      }
    }
    //gives player more ammo to shoot
    function reload(){
      for(let i = ammoArray.length; i < 6; i++){
      ammoArray.push(1)
      }
    }
    let frames;
    let score = 0;
    let mango = document.querySelector("#score span");
    console.log(mango.innerHTML)
    function updateGame(){
      frames = totalFrameCount++;

      //60 fps - creates zombie every 5 seconds
      if(totalFrameCount % 300 === 0){
        let x
        let y
        //spawns zombies on the outside of map
        if (Math.random() < 0.5){
          x = Math.random() < 0.5 ? 0 - player.width : myCanvas.width + player.width;
          y = Math.random()*myCanvas.height;
        }else{
          x = Math.random() * myCanvas.width;
          y = Math.random() < 0.5 ? 0 - player.height: myCanvas.height + player.height;
        }
        const color = 'green'
        let angle = Math.atan2(player.y - y, player.x - x)
        const velocity = {
          x: Math.cos(angle) * .5,
          y: Math.sin(angle) * .5
        }
        zombieArray.push(new ZombieObject(x, y, player.width, player.height, ctx, color, velocity))
      }
      zombieArray.forEach((zombie, index) => {
        zombie.update()
        //zombie and player collision
        const distBetween = Math.hypot(player.x - zombie.x, player.y - zombie.y)
        if(distBetween-zombie.width/2-player.width/2<1){
          runGame = false;
          reset();
        }
        //updates each bullet and detects collision
        bulletArray.forEach((bullet, bulletIndex) => {
          bullet.update()
          if(bullet.x + bullet.radius < 0 || bullet.x - bullet.radius > myCanvas.width || bullet.y + bullet.radius < 0 || bullet.y - bullet.radius > myCanvas.height){
            bulletArray.splice(bulletIndex, 1)
          }
          const distBetween = Math.hypot(bullet.x - (zombie.x+zombie.width/2), bullet.y - (zombie.y+zombie.height/2))
          if(distBetween-zombie.width/2-bullet.radius/2<1){
            //fixes jitter frames when deleting zombies
            setTimeout(() =>{
              zombieArray.splice(index, 1);
            }, 0)
            bulletArray.splice(bulletIndex, 1);
            score+=10;
            mango.innerHTML = score;
          }
        })
      })
    }
    let runGame = true;
    function startGame(){ 
      if (runGame === true){
        //update player position
        player.updatePosition();
        //clear canvas
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        //draws floor
        myFloor.draw();
        //draws player
        player.draw();
        //creates zombies in intervals;
        updateGame();
        //moves zombies
      }
    }

    
    //only start the game loop after the road image has finished loading
    floorImg.onload =  () => {
      intervalId = setInterval(startGame, 1)
    };

    //player movement
    document.addEventListener('keydown', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vxl = -1;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vxr = 1;
          break;
        case 'ArrowUp':
        case 'KeyW':
          player.vyu = -1;
          break;
        case 'ArrowDown':
        case 'KeyS':
          player.vyd = 1;
          break;
        case 'KeyR':
          reload();
      }
    });

    //stop the player if no key is pressed
     document.addEventListener('keyup', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vxl = 0;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vxr = 0;
          break;
        case 'ArrowUp':
        case 'KeyW':
          player.vyu = 0;
          break;
        case 'ArrowDown':
        case 'KeyS':
          player.vyd = 0;
          break;
      }
    });
    //gets direction of mouse from player
    myCanvas.onmousemove = (e) => {
      // //targets the canvas inside of screen 
      // const bnds = e.target.getBoundingClientRect();
      // //gets x,y position of mouse inside canvas
      // const x = Math.floor(e.clientX - bnds.left)
      // const y = e.clientY - bnds.top;
      // //gets the position of the player
      // const w = player.x+48
      // const h = player.y+48
      // //gets distance between mouse and player
      // const vx = x-w
      // const vy = y-h
      // //gets mouse position in radians
      // const rad = Math.atan2(vy, vx)
      // //convert radians to degrees and round it
      // let deg = Math.round(rad *(180 / Math.PI));
      // //convert to 360 degrees
      // if (deg < 0){deg = (deg + 360) % 360}
      // // console.log(`Current Degree: ${deg}`);
      // console.log(`X:${e.target.getBoundingClientRect().clientX} | X2:${x}`);
    }
    myCanvas.onclick = (e) => {
      //gets angle between player and mouse
      const angle = Math.atan2((e.clientY-e.target.getBoundingClientRect().top)-(player.y+(player.height/2)), 
      (e.clientX-e.target.getBoundingClientRect().left)-(player.x+(player.width/2)))
      const velocity = {
        x: Math.cos(angle) *2.5,
        y: Math.sin(angle) *2.5
      }
      if(ammoArray.length >= 1){
      ammoArray.splice(0, 1);
      bulletArray.push(new BulletObject(player.x+(player.width/3), player.y+(player.height/3), player.width/6, ctx, 'white', velocity))
      }
    }
  }
}